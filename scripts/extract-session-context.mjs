/**
 * Pulls the human instructions out of a Claude Code transcript, so a
 * later session can inherit intent rather than only the code.
 *
 *   node scripts/extract-session-context.mjs <transcript.jsonl> [--assistant]
 */
import fs from "node:fs";

const file = process.argv[2];
const withAssistant = process.argv.includes("--assistant");
/** --since=2026-08-01 keeps a long-running session's older work out. */
const since = process.argv.find((a) => a.startsWith("--since="))?.split("=")[1];

const text = (content) => {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .filter((c) => c?.type === "text" && typeof c.text === "string")
    .map((c) => c.text)
    .join("\n");
};

let n = 0;
for (const line of fs.readFileSync(file, "utf8").split("\n")) {
  if (!line.trim()) continue;
  let row;
  try {
    row = JSON.parse(line);
  } catch {
    continue;
  }
  if (since && (row.timestamp ?? "") < since) continue;
  const msg = row.message;
  if (!msg?.role) continue;
  if (msg.role !== "user" && !(withAssistant && msg.role === "assistant")) continue;

  const body = text(msg.content).trim();
  if (!body) continue;
  // skip tool-result echoes and system noise
  if (body.startsWith("<local-command") || body.startsWith("Caveat:")) continue;
  if (/^\s*$/.test(body)) continue;

  n++;
  console.log(`\n${"═".repeat(76)}`);
  console.log(`[${msg.role}] #${n}  ${row.timestamp?.slice(0, 16).replace("T", " ") ?? ""}`);
  console.log("═".repeat(76));
  console.log(body.length > 4000 ? body.slice(0, 4000) + "\n… [truncated]" : body);
}
console.log(`\n\n(${n} messages)`);
