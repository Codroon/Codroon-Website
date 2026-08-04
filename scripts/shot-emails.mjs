import { chromium } from "playwright";
import path from "node:path";

const b = await chromium.launch();

const files = [
  ["email-notification-quote", 700, "desktop"],
  ["email-notification-quote", 390, "phone"],
  ["email-notification-call", 700, "desktop"],
  ["email-visitor", 700, "desktop"],
];

for (const [name, width, label] of files) {
  const p = await b.newPage({ viewport: { width, height: 900 } });
  await p.goto("file://" + path.resolve(`scripts/shots/${name}.html`));
  await p.waitForTimeout(200);
  await p.screenshot({
    path: `scripts/shots/${name}-${label}.png`,
    fullPage: true,
  });
  await p.close();
}

console.log("done");
await b.close();
