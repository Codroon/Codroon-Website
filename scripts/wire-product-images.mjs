/**
 * Wires screenshots dropped into /public/products/<slug>/ onto the
 * slides in src/content/products/<slug>.ts.
 *
 * Files are matched to slides in alphabetical order, so name them
 * 01-…, 02-…, 03-…, 04-…. Safe to re-run: it rewrites `src` rather
 * than appending, and leaves a slide untouched when no file exists for
 * it — the slider falls back to its reserved frame.
 *
 *   node scripts/wire-product-images.mjs           # wire
 *   node scripts/wire-product-images.mjs --check   # report only
 */
import fs from "node:fs";
import path from "node:path";

const CHECK_ONLY = process.argv.includes("--check");
const PUBLIC_DIR = "public/products";
const CONTENT_DIR = "src/content/products";
const IMAGE_RE = /\.(png|jpe?g|webp|avif)$/i;

/**
 * True pixel dimensions, so the declared width/height can never lie
 * about the file — they drive both the CLS reservation and next/image's
 * sizing. PNG only for now; other formats keep whatever is declared.
 */
function pngSize(file) {
  try {
    const b = fs.readFileSync(file);
    if (b.length < 24 || b.readUInt32BE(12) !== 0x49484452) return null; // IHDR
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  } catch {
    return null;
  }
}

const slugs = fs
  .readdirSync(PUBLIC_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

let wired = 0;
let problems = 0;

for (const slug of slugs) {
  const contentFile = path.join(CONTENT_DIR, `${slug}.ts`);
  if (!fs.existsSync(contentFile)) {
    console.log(`skip  ${slug} — no ${contentFile}`);
    continue;
  }

  const files = fs
    .readdirSync(path.join(PUBLIC_DIR, slug))
    .filter((f) => IMAGE_RE.test(f))
    .sort();

  let source = fs.readFileSync(contentFile, "utf8");

  // Isolate the slides array so nothing else in the file is touched.
  const start = source.indexOf("slides: [");
  if (start === -1) {
    console.log(`skip  ${slug} — no slides array`);
    continue;
  }
  const open = source.indexOf("[", start);
  let depth = 0;
  let end = open;
  for (let i = open; i < source.length; i++) {
    if (source[i] === "[") depth++;
    else if (source[i] === "]") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const block = source.slice(open + 1, end);

  // Split into slide objects at top level.
  const slides = [];
  let d = 0;
  let from = 0;
  for (let i = 0; i < block.length; i++) {
    if (block[i] === "{") {
      if (d === 0) from = i;
      d++;
    } else if (block[i] === "}") {
      d--;
      if (d === 0) slides.push([from, i + 1]);
    }
  }

  console.log(`\n${slug}: ${slides.length} slide(s), ${files.length} image(s)`);
  if (files.length > slides.length) {
    console.log(`  ! ${files.length - slides.length} extra image(s) ignored — only ${slides.length} slides exist`);
    problems++;
  }

  let rebuilt = "";
  let cursor = 0;
  slides.forEach(([s, e], i) => {
    const original = block.slice(s, e);
    const file = files[i];
    let updated = original;

    if (file) {
      const src = `/${PUBLIC_DIR.replace(/^public\//, "")}/${slug}/${file}`;
      updated = /(^|\s)src:\s*"[^"]*",?/.test(original)
        ? original.replace(/(^|\s)src:\s*"[^"]*",/, `$1src: "${src}",`)
        : original.replace(/(\{\s*\n)(\s*)/, `$1$2src: "${src}",\n$2`);

      // keep the declared size honest
      const size = pngSize(path.join(PUBLIC_DIR, slug, file));
      let note = "";
      if (size) {
        updated = updated
          .replace(/(^|\s)width:\s*\d+,/, `$1width: ${size.width},`)
          .replace(/(^|\s)height:\s*\d+,/, `$1height: ${size.height},`);
        note = `  ${size.width}×${size.height}  (${(size.width / size.height).toFixed(2)}:1)`;
      }
      console.log(`  ${i + 1}. ${file}${note}`);
      wired++;
    } else {
      // no image yet — strip any stale src so the reserved frame returns
      updated = original.replace(/(^|\s)src:\s*"[^"]*",\s*\n\s*/, "$1");
      console.log(`  ${i + 1}. (no image — reserved frame)`);
    }

    rebuilt += block.slice(cursor, s) + updated;
    cursor = e;
  });
  rebuilt += block.slice(cursor);

  const next = source.slice(0, open + 1) + rebuilt + source.slice(end);
  if (next !== source && !CHECK_ONLY) {
    fs.writeFileSync(contentFile, next);
    console.log(`  → updated ${contentFile}`);
  } else if (next !== source) {
    console.log(`  → would update ${contentFile}`);
  }
}

console.log(
  `\n${wired} slide(s) wired${problems ? `, ${problems} problem(s)` : ""}.` +
    (CHECK_ONLY ? " (check only, nothing written)" : "")
);
console.log("Run `npx tsc --noEmit` after wiring, then reload the page.\n");
