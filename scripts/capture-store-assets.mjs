import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const outputDir = fileURLToPath(new URL('../store-assets/', import.meta.url));
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 393, height: 852 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();

const capture = async (name) => {
  await page.screenshot({ path: `${outputDir}${name}.png` });
};

await page.goto('http://127.0.0.1:8087/welcome');
await page.getByText('A quiet daily ritual').waitFor();
await capture('01-welcome');

await page.getByRole('button', { name: 'Continue' }).click();
await page.getByRole('button', { name: 'Continue' }).click();
await page.getByRole('button', { name: 'Get started' }).click();
await page.getByRole('button', { name: 'Continue privately' }).click();
await page.getByText("Today's check-in").waitFor();
await capture('02-home');

await page.getByRole('button', { name: 'See what is included' }).click();
await page.getByText('Go a little deeper').waitFor();
await capture('03-premium');

await browser.close();
