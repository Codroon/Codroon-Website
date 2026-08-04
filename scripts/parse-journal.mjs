import fs from "node:fs";

const j = process.argv[2];
for (const line of fs.readFileSync(j, "utf8").split("\n")) {
  if (!line.trim()) continue;
  let r;
  try { r = JSON.parse(line); } catch { continue; }
  if (r.type !== "result" || !r.result) continue;
  const res = r.result;
  if (Array.isArray(res.findings)) {
    for (const f of res.findings) {
      console.log(`\n[RAISED ${f.severity}] ${f.file.split(/[\\/]/).pop()}`);
      console.log(`  ${f.claim}`);
    }
  } else if (typeof res.refuted === "boolean") {
    console.log(`\n[VERDICT] refuted=${res.refuted}`);
    console.log(`  ${String(res.reason).slice(0, 320)}`);
  }
}
