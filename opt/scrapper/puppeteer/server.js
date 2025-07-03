const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;

// 🔐 Конфигурируем токен (можно перенести в .env позже)
const API_TOKEN = 'qwerty321654nk32yfydsl1df';

// ✅ Middleware: проверка токена
app.use((req, res, next) => {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '').trim();

    if (token !== API_TOKEN) {
        return res.status(403).json({ error: 'Forbidden: Invalid or missing token' });
    }

    next();
});

// 🚀 Рендеринг HTML по URL
app.get('/render', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('Missing "url" parameter.');

    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        const html = await page.content();

        await browser.close();
        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to render page.');
    }
});

app.listen(PORT, () => {
    console.log(`Puppeteer API server running at http://localhost:${PORT}`);
});