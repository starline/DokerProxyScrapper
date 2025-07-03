import { PuppeteerCrawler } from 'crawlee';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export async function getRenderedHTML(url, proxyUrl = null) {
    let html = '';

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
            await page.waitForSelector('body', { timeout: 15000 });
            html = await page.content();
        },
        maxRequestsPerCrawl: 1
    });

    await crawler.run([url]);

    return html;
}