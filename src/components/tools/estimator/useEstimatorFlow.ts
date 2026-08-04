"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  buildSnapshot,
  decodeAnswers,
  encodeAnswers,
  estimate as computeEstimate,
  fitToBudget,
  shouldInterrupt,
} from "@/pricing/calculate";
import { UNSURE, type Answers, type Estimate, type ToolConfig } from "@/pricing/types";
import {
  createEstimate,
  fetchEstimate,
  fireAndForget,
  generateShortCode,
  isShortCode,
  updateEstimate,
} from "@/lib/supabase/estimates";
import type { EstimatorCopy } from "./copy/types";

/**
 * The estimator flow, driven entirely by the URL.
 *
 * Every answer, the current stage, the cuts toggled on the results
 * screen and whether the interrupt has already fired all live in the
 * search params. That gives us, for free and with no browser storage:
 *   - a working browser Back button (each answer is a history entry)
 *   - refresh without losing progress
 *   - a pasted link that reproduces the estimate exactly
 *
 * Cut toggles use replace() rather than push() so the Back button
 * steps through questions rather than through checkbox clicks.
 *
 * The database is a durable MIRROR of that URL state, never its source.
 * Writes are debounced and fire-and-forget: if every one of them fails,
 * the tool behaves identically. The short code lands in the URL as `e`
 * on the first answer, which is what makes a session resumable and a
 * result shareable.
 */

const STAGE = "at";
const CUTS = "cuts";
const SEEN_INTERRUPT = "si";
const CODE = "e";

/** Long enough that a fast clicker produces one write, not six. */
const WRITE_DEBOUNCE_MS = 400;

export type Stage = string; // a question id, "interrupt", "interstitial", "results"

/** Display strings the share page needs but pricing does not produce. */
export type EstimateDescription = {
  eyebrow: string;
  metaLine: string;
  panelLabel: string;
};

export function useEstimatorFlow(
  config: ToolConfig,
  copy: EstimatorCopy,
  describe?: (answers: Answers, estimate: Estimate) => EstimateDescription
) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  /** Copy questions, minus any the pricing config skips for this type. */
  const answers = useMemo(
    () => decodeAnswers(config, new URLSearchParams(params.toString())),
    [config, params]
  );

  const visibleQuestions = useMemo(
    () =>
      copy.questions.filter((q) => {
        const spec = config.questions.find((s) => s.id === q.id);
        return !spec?.skipWhen?.(answers);
      }),
    [config, copy, answers]
  );

  const urlCuts = useMemo(
    () => (params.get(CUTS) ?? "").split(",").filter(Boolean),
    [params]
  );

  /**
   * The URL stays the source of truth, but a checkbox bound straight to
   * it snaps back until the router round-trip lands. Hold the toggle
   * locally so it flips instantly, and re-sync whenever the URL's own
   * value changes (budget pre-selection, a pasted link, forward nav).
   */
  const [activeCuts, setActiveCuts] = useState(urlCuts);
  const urlCutsKey = urlCuts.join(",");
  useEffect(() => {
    setActiveCuts(urlCutsKey ? urlCutsKey.split(",") : []);
  }, [urlCutsKey]);

  const seenInterrupt = params.get(SEEN_INTERRUPT) === "1";

  const stage: Stage = params.get(STAGE) ?? visibleQuestions[0]?.id ?? "results";

  /* ---- short code ------------------------------------------------
     Generated once per session and carried in the URL. Held in a ref
     rather than state so the very first answer can put it into the
     same navigation, and so re-renders never mint a second one. */

  const urlCode = params.get(CODE);
  const codeRef = useRef<string | null>(urlCode && isShortCode(urlCode) ? urlCode : null);
  if (urlCode && isShortCode(urlCode)) codeRef.current = urlCode;

  /** Codes that arrived in the URL already exist — never re-insert. */
  const preexistingRef = useRef<string | null | undefined>(undefined);
  if (preexistingRef.current === undefined) {
    preexistingRef.current = urlCode && isShortCode(urlCode) ? urlCode : null;
  }
  const createdRef = useRef<Set<string>>(new Set());

  const ensureCode = useCallback(() => {
    if (!codeRef.current) codeRef.current = generateShortCode();
    return codeRef.current;
  }, []);

  const estimate = useMemo(
    () => computeEstimate(config, answers, activeCuts),
    [config, answers, activeCuts]
  );

  const budgetFit = useMemo(() => fitToBudget(config, answers), [config, answers]);

  /* ---- navigation ---------------------------------------------- */

  const navigate = useCallback(
    (
      nextAnswers: Answers,
      nextStage: Stage,
      opts?: { cuts?: string[]; seenInterrupt?: boolean; replace?: boolean }
    ) => {
      const next = encodeAnswers(nextAnswers);
      next.set(STAGE, nextStage);
      const cuts = opts?.cuts ?? activeCuts;
      if (cuts.length) next.set(CUTS, cuts.join(","));
      if (opts?.seenInterrupt ?? seenInterrupt) next.set(SEEN_INTERRUPT, "1");
      if (codeRef.current) next.set(CODE, codeRef.current);
      const url = `${pathname}?${next.toString()}`;
      if (opts?.replace) router.replace(url, { scroll: false });
      else router.push(url, { scroll: false });
    },
    [activeCuts, pathname, router, seenInterrupt]
  );

  /** The question after `id`, honouring skips against the NEW answers. */
  const nextQuestionAfter = useCallback(
    (id: string, forAnswers: Answers) => {
      const list = copy.questions.filter((q) => {
        const spec = config.questions.find((s) => s.id === q.id);
        return !spec?.skipWhen?.(forAnswers);
      });
      const i = list.findIndex((q) => q.id === id);
      return i >= 0 && i < list.length - 1 ? list[i + 1].id : null;
    },
    [config, copy]
  );

  const answer = useCallback(
    (questionId: string, value: Answers[string]) => {
      const next: Answers = { ...answers, [questionId]: value };

      // The first answer mints the code, so it travels with this very
      // navigation rather than appearing a beat later.
      ensureCode();

      // Record the answer on the history entry that SHOWS this
      // question, before pushing the next one. Without this, stepping
      // back lands on a question with nothing selected — that entry was
      // written before the answer existed.
      //
      // This is replaceState rather than router.replace on purpose: we
      // are leaving this entry, so no re-render is wanted, and a
      // router.replace immediately followed by a push gets coalesced
      // away. Next's own history state is preserved untouched.
      const here = encodeAnswers(next);
      here.set(STAGE, questionId);
      if (activeCuts.length) here.set(CUTS, activeCuts.join(","));
      if (seenInterrupt) here.set(SEEN_INTERRUPT, "1");
      if (codeRef.current) here.set(CODE, codeRef.current);
      if (typeof window !== "undefined") {
        window.history.replaceState(
          window.history.state,
          "",
          `${pathname}?${here.toString()}`
        );
      }

      // The interrupt outranks everything else at its trigger point,
      // and fires at most once per session.
      if (shouldInterrupt(config, next, questionId, seenInterrupt)) {
        navigate(next, "interrupt");
        return;
      }
      if (questionId === copy.interstitialAfter) {
        navigate(next, "interstitial");
        return;
      }
      const following = nextQuestionAfter(questionId, next);
      if (following) {
        navigate(next, following);
        return;
      }
      // Landing on results: if a budget was given, arrive with the
      // leaner version already selected so it fits their number.
      const fit = fitToBudget(config, next);
      navigate(next, "results", { cuts: fit?.cuts ?? [] });
    },
    [
      activeCuts,
      answers,
      config,
      copy,
      navigate,
      nextQuestionAfter,
      pathname,
      router,
      seenInterrupt,
    ]
  );

  /** Leave the interrupt and carry on with the flow. */
  const dismissInterrupt = useCallback(() => {
    const following = nextQuestionAfter(config.interrupt.firesAfter, answers);
    navigate(answers, following ?? "results", { seenInterrupt: true });
  }, [answers, config, navigate, nextQuestionAfter]);

  /** Take the smaller build: recompute at the lower configuration. */
  const takeSmaller = useCallback(() => {
    const next: Answers = { ...answers, ...config.interrupt.smallerConfiguration };
    navigate(next, "results", {
      cuts: config.interrupt.smallerCuts,
      seenInterrupt: true,
    });
  }, [answers, config, navigate]);

  const continueFromInterstitial = useCallback(() => {
    const following = nextQuestionAfter(copy.interstitialAfter, answers);
    navigate(answers, following ?? "results");
  }, [answers, copy, navigate, nextQuestionAfter]);

  const skipToResults = useCallback(() => {
    navigate(answers, "results");
  }, [answers, navigate]);

  const toggleCut = useCallback(
    (id: string) => {
      const next = activeCuts.includes(id)
        ? activeCuts.filter((c) => c !== id)
        : [...activeCuts, id];
      setActiveCuts(next); // flip now; the URL catches up
      navigate(answers, stage, { cuts: next, replace: true });
    },
    [activeCuts, answers, navigate, stage]
  );

  /** Browser history is the source of truth — Back really goes back. */
  const back = useCallback(() => router.back(), [router]);

  /* ---- progressive writes --------------------------------------
     The row is created on the first answer and updated on every one
     after it, debounced. Rows where completed = false are the point of
     the exercise: they show exactly which question people leave at. */

  const answersKey = JSON.stringify(answers);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const code = codeRef.current;
    // nothing to mirror until at least one answer exists
    if (!code || Object.keys(answers).length === 0) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const snapshot = buildSnapshot(config, answers);
      const computed = snapshot
        ? {
            // top-level midpoint: v_high_value_no_lead reads it
            midpoint: estimate.midpoint,
            lo: estimate.lo,
            hi: estimate.hi,
            state: estimate.state,
            timelineLabel: estimate.timelineLabel,
            confidenceLabel: estimate.confidenceLabel,
            cuts: activeCuts,
            snapshot,
            display: describe?.(answers, estimate) ?? null,
          }
        : null;

      const isNew =
        code !== preexistingRef.current && !createdRef.current.has(code);

      fireAndForget(async () => {
        if (isNew) {
          createdRef.current.add(code);
          await createEstimate(config.tool, code, answers);
        }
        await updateEstimate(code, {
          answers,
          computed,
          completed: stage === "results",
        });
      });
    }, WRITE_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answersKey, stage, activeCuts.join(","), config]);

  /* ---- resume --------------------------------------------------
     URL params win. The stored row is only consulted when someone
     arrives with a code and nothing else — a link they mailed
     themselves, or a tab restored after the params were stripped. */

  const resumedRef = useRef(false);
  useEffect(() => {
    if (resumedRef.current) return;
    const code = urlCode;
    if (!code || !isShortCode(code)) return;
    if (Object.keys(answers).length > 0) return; // params already win
    resumedRef.current = true;

    fireAndForget(async () => {
      const row = await fetchEstimate(code);
      if (!row || !row.answers || Object.keys(row.answers).length === 0) return;
      const restored = encodeAnswers(row.answers as Answers);
      restored.set(CODE, code);
      restored.set(STAGE, row.completed ? "results" : (params.get(STAGE) ?? "results"));
      const stored = (row.computed ?? {}) as { cuts?: string[] };
      if (stored.cuts?.length) restored.set(CUTS, stored.cuts.join(","));
      router.replace(`${pathname}?${restored.toString()}`, { scroll: false });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCode]);

  /* ---- derived view state -------------------------------------- */

  const currentQuestion = copy.questions.find((q) => q.id === stage) ?? null;
  const isFirstQuestion = visibleQuestions[0]?.id === stage;

  /** Answers with "Not sure" preserved, for rendering selected state. */
  const rawAnswer = (id: string) => params.get(id) ?? undefined;

  return {
    answers,
    rawAnswer,
    /** null until the first answer mints one */
    shortCode: codeRef.current,
    stage,
    currentQuestion,
    visibleQuestions,
    isFirstQuestion,
    estimate,
    activeCuts,
    budgetFit,
    unsure: UNSURE,
    answer,
    back,
    dismissInterrupt,
    takeSmaller,
    continueFromInterstitial,
    skipToResults,
    toggleCut,
  };
}
