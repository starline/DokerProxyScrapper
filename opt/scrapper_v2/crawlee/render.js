import { PuppeteerCrawler, log } from 'crawlee';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Включаем Stealth-плагин
puppeteer.use(StealthPlugin());

export async function getRenderedHTML(url, proxyUrl = null) {
    let html = '';

    const crawler = new PuppeteerCrawler({
        // ⚠️ Исправление здесь
        launchContext: {
            launchOptions: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                executablePath: puppeteer.executablePath(), // ✅ указываем путь вручную
            },
            useChrome: false // 🟡 важно: иначе ошибка
        },
        proxyConfiguration: proxyUrl ? { proxyUrls: [proxyUrl] } : undefined,
        requestHandler: async ({ page }) => {
            await page.waitForSelector('body', { timeout: 15000 });
            html = await page.content();
        },
        maxRequestsPerCrawl: 1,
        requestHandlerTimeoutSecs: 60,
    });

    await crawler.run([{ url }]);

    return html;
}