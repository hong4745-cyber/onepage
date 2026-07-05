import { chromium } from 'playwright-core';

const url = 'https://onepage-khaki.vercel.app/';
const browser = await chromium.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
});
const page = await browser.newPage();
const errors = [];
page.on('console', (msg) => errors.push(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`));
page.on('requestfailed', (req) => errors.push(`[requestfailed] ${req.url()} - ${req.failure()?.errorText}`));

await page.goto(url, { waitUntil: 'load', timeout: 20000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: 'C:\\Users\\UserK\\AppData\\Local\\Temp\\claude\\E--------------bowerswilkins\\301fe54f-f164-48b0-ae8a-2cbd09e62c2a\\scratchpad\\vercel_home.png' });

const heroGifSrc = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll('img'));
  const hero = imgs.find(i => i.src.includes('blob.vercel-storage.com') || i.src.includes('main_video'));
  return hero ? hero.src : null;
});

console.log('HERO_GIF_SRC:', heroGifSrc);
console.log('--- CONSOLE/ERRORS ---');
console.log(errors.join('\n'));

await browser.close();
