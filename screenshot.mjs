import { createRequire } from "module";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";

const require = createRequire(import.meta.url);
const puppeteer = require("C:/Users/rafam/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer");

const __dirname = dirname(fileURLToPath(import.meta.url));
const url   = process.argv[2] || "http://localhost:3000";
const label = process.argv[3] || "";

const outDir = join(__dirname, "temporary screenshots");
mkdirSync(outDir, { recursive: true });

// Auto-increment filename
import { readdirSync } from "fs";
const existing = readdirSync(outDir).filter(f => f.endsWith(".png"));
const nums = existing.map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1] || "0")).filter(n => !isNaN(n));
const next = nums.length ? Math.max(...nums) + 1 : 1;
const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const outPath  = join(outDir, filename);

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const page    = await browser.newPage();

// Mobile viewport (iPhone 14 Pro)
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: outPath, fullPage: false });

await browser.close();
console.log("Saved:", outPath);
