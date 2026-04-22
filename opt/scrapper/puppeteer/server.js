require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const app = express();
const PORT = 3000;
const API_TOKEN = process.env.API_TOKEN;

if (!API_TOKEN) {
    console.error('FATAL: API_TOKEN is required (set in environment or .env file)');
    process.exit(1);
}

// ✅ Middleware: проверка токена
app.use((req, res, next) => {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '').trim();

    if (token !== API_TOKEN) {
        return res.status(403).json({ error: 'Forbidden: Invalid or missing token' });
    }

    next();
});

// 🚀 Рендеринг страницы
app.get('/render', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('Missing "url" parameter.');

    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // ✅ Устанавливаем нормальный User-Agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

        // ⏳ Заходим и ждём до полной загрузки
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // 🕵️ Можно подождать h1, если точно знаем что он есть
        await page.waitForSelector('h1.heading-2', { timeout: 15000 });

        const html = await page.content();
        await browser.close();

        res.send(html);
    } catch (err) {
        console.error('Render error:', err.message);
        res.status(500).send('Failed to render page.');
    }
});

app.listen(PORT, () => {
    console.log(`✅ Puppeteer API server running at ${PORT}`);
});