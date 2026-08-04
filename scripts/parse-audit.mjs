import fs from "node:fs";

const path = process.argv[2];
const j = JSON.parse(fs.readFileSync(path, "utf8")).result;

console.log(`refuted: ${j.refutedCount} | confirmed: ${j.confirmed.length}\n`);
j.confirmed.forEach((f, i) => {
  const sev = f.verdict?.corrected_severity ?? f.severity;
  console.log(
    `--- ${i + 1} [${sev}] ${f.dimension} :: ${f.file.split(/[\\/]/).pop()}`
  );
  console.log(`CLAIM   : ${f.claim}`);
  console.log(`FAILURE : ${f.failure.slice(0, 500)}`);
  console.log("");
});
