# Product screenshots

Drop screenshots here, then run:

    node scripts/wire-product-images.mjs

That sets `src` on each slide in `src/content/products/<slug>.ts`, in
filename order, and reports anything that doesn't line up. Re-running it
is safe.

## Naming

Files are matched in **alphabetical order**, so prefix them:

    01-....png   02-....png   03-....png   04-....png

The number decides the slide; the rest of the name is for you.

## Specs

- Any reasonable landscape ratio works — the frame now adopts each
  image's own ratio (`object-contain`, no cropping, no bars). Keep a
  slide's replacement at the *same* ratio as the file it replaces, or
  the frame height will change for that slide.
- The wiring script reads the true pixel size from each PNG and writes
  it into the content file, so declared dimensions never drift.
- PNG or WebP. WebP if the screenshot is photographic; PNG for flat UI.
- Keep each file under ~400 KB where possible. Slide 1 loads with
  `priority`, so it's on the critical path for that page.
- No device frames or drop shadows — the slider supplies its own border.

## Current slides (order set by the client, 2026-08-02)

The live product site leads; app screens follow. Captions live in
`src/content/products/<slug>.ts` and appear under each frame, so a
replacement image has to keep matching its caption.

### replydude/
1. `01-replydude-site.png` — replydude.ai, the shipped product
2. `02-campaign-builder.png` — new-campaign dialog, one-line brief
3. `03-live-status.png` — Home dashboard, counters + activity
4. `04-settings.png` — platforms, saved logins, background window

### decipher-engine/
1. `01-decipher-site.png` — decipherengine.ai hero
2. `02-dashboard.png` — featured world + Rejoin Your Adventures
3. `03-image-studio.png` — art styles, seven models, canvas
4. `04-story-creator.png` — chapter editor with AI Assistant

## Frame colour

Each product sets the colour of its screenshot frame as `brandColor` in
`src/content/products/<slug>.ts`. Omitting it is also a real option, not
an oversight — the frame then uses the neutral `--border` hairline
(`#403d36`).

> **ReplyDude is `#000000`** (client decision, 2026-08-02). Its blue was
> sampled and tried, and rejected: the coloured edge read as decoration
> rather than as a frame. Black is a deliberate exception to the 3:1
> guidance below — at 1.21:1 the edge recedes rather than announcing
> itself, which is the intent. Do not "fix" it. Decipher Engine keeps
> its purple.

When the colour is meant to be the *product's*, sample it from that
product's live site rather than picking by eye:

    node scripts/sample-brand-colour.mjs

It ranks the vivid pixels and prints each candidate's contrast against
the page background. Take a value at **3:1 or better** — the dominant
shade is often a background gradient that vanishes on our dark page
(Decipher's nebula purple was 2.08:1; its button purple is 3.07:1).

Must be a literal hex. The slider validates it and falls back to the
neutral hairline if not, because an invalid CSS colour resolves to
`currentColor` — a near-white frame that nothing else would catch.

Contrast is necessary but not sufficient: check the shot itself. A
saturated colour on a dark page starts reading as a glow rather than an
edge, which is why ReplyDude's 3.62:1 blue was rejected. Below roughly
2:1 the frame stops separating the image from the page — take that as a
choice to make on purpose, not to arrive at by accident.

Codroon orange still owns every control on the page: the caption link,
the dots, the CTAs. Only the frame edge is the product's colour.

## After replacing an image

1. `node scripts/wire-product-images.mjs` — re-wires src + true size.
2. `node scripts/contact-sheet.mjs` — renders every image beside its
   caption; check the pair still makes sense.
3. Update the slide's `alt` in `src/content/products/<slug>.ts` if the
   new screenshot shows different UI.
