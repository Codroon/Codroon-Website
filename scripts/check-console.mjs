import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const msgs = [];
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") msgs.push(`[${m.type()}] ${m.text()}`);
});
page.on("pageerror", (e) => msgs.push(`[pageerror] ${e.message}`));

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1500);

console.log(msgs.length ? msgs.join("\n---\n") : "NO ERRORS/WARNINGS");
await browser.close();