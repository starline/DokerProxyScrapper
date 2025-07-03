import { PuppeteerCrawler } from 'crawlee';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export async function extractIAAIData(url, proxyUrl = null) {
    let result = {};

    const crawler = new PuppeteerCrawler({
        launchContext: {
            launchOptions: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            },
            puppeteer
        },
        proxyConfiguration: proxyUrl ? { proxyUrls: [proxyUrl] } : undefined,
        requestHandler: async ({ page }) => {
            await page.waitForSelector('h1.heading-2', { timeout: 15000 });

            result = await page.evaluate(() => {
                const vehicle = document.querySelector('h1.heading-2')?.innerText || '';
                const odoText = Array.from(document.querySelectorAll('li')).find(el =>
                    el.innerText.includes('Odometer:'))?.innerText || '';
                const odometer = parseInt(odoText.replace(/[^\d]/g, '')) || 0;

                const branchText = Array.from(document.querySelectorAll('li')).find(el =>
                    el.innerText.includes('Selling Branch:'))?.innerText || '';
                const state = branchText.match(/\((\w{2})\)/)?.[1] || '';

                return { vehicle, odometer, state };
            });
        },
        maxRequestsPerCrawl: 1,
        requestHandlerTimeoutSecs: 60
    });

    await crawler.run([url]);

    return result;
}