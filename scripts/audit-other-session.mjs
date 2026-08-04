/**
 * Reconciliation: which files did the monorepo-rooted session write
 * into this repo, are they still on disk, and has anything overwritten
 * them since?
 *
 * Reads only tool-call metadata (tool name + file path + timestamp) —
 * not the conversation content.
 */
import fs from "node:fs";
import path from "node:path";

const TRANSCRIPT =
  "C:/Users/Gaming/.claude/projects/c--Users-Gaming-monorepo/89dfba8a-616f-4d73-aa26-34984de932ad.jsonl";
const REPO = "c:/Users/Gaming/Codroon-Web-App";

const WRITE_TOOLS = new Set(["Write", "Edit", "NotebookEdit", "MultiEdit"]);
const touched = new Map(); // file -> { tools:Set, count, last }

const walk = (node, ts) => {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) return node.forEach((n) => walk(n, ts));
  if (node.type === "tool_use" && node.name && node.input) {
    const fp = node.input.file_path ?? node.input.notebook_path;
    if (typeof fp === "string" && fp.toLowerCase().includes("codroon-web-app")) {
      const key = path.resolve(fp).toLowerCase();
      const e = touched.get(key) ?? { tools: new Set(), count: 0, last: ts };
      e.tools.add(node.name);
      e.count++;
      e.last = ts ?? e.last;
      touched.set(key, e);
    }
  }
  for (const v of Object.values(node)) walk(v, ts);
};

for (const line of fs.readFileSync(TRANSCRIPT, "utf8").split("\n")) {
  if (!line.trim()) continue;
  try {
    const row = JSON.parse(line);
    walk(row.message ?? row, row.timestamp);
  } catch {
    /* skip malformed lines */
  }
}

const writes = [...touched.entries()].filter(([, e]) =>
  [...e.tools].some((t) => WRITE_TOOLS.has(t))
);
const readsOnly = touched.size - writes.length;

console.log(`\nFiles the monorepo session referenced in this repo: ${touched.size}`);
console.log(`  written/edited: ${writes.length}`);
console.log(`  read only:      ${readsOnly}\n`);

if (writes.length === 0) {
  console.log("That session made NO writes to this repo — it only read files.\n");
  process.exit(0);
}

console.log("state  file                                                    edits  last touched by them");
console.log("-".repeat(104));
let missing = 0;
let newer = 0;
for (const [file, e] of writes.sort((a, b) => a[0].localeCompare(b[0]))) {
  const rel = path.relative(REPO, file).replace(/\\/g, "/");
  let state = "GONE ";
  let mtime = "";
  if (fs.existsSync(file)) {
    const st = fs.statSync(file);
    mtime = st.mtime.toISOString().slice(0, 16).replace("T", " ");
    const theirs = e.last ? new Date(e.last) : null;
    // rewritten since = mtime meaningfully after their last edit
    if (theirs && st.mtime.getTime() > theirs.getTime() + 60_000) {
      state = "REWRT";
      newer++;
    } else {
      state = "PRESN";
    }
  } else {
    missing++;
  }
  console.log(
    `${state}  ${rel.padEnd(54).slice(0, 54)}  ${String(e.count).padStart(5)}  ${
      e.last ? e.last.slice(0, 16).replace("T", " ") : "?"
    }  (disk ${mtime})`
  );
}

console.log("-".repeat(104));
console.log(`PRESN = still as they left it   REWRT = changed since   GONE = no longer exists`);
console.log(`\n  present: ${writes.length - newer - missing}   rewritten since: ${newer}   missing: ${missing}\n`);
