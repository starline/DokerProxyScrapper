import express from 'express';
import { getRenderedHTML } from './render.js';

const app = express();
const PORT = 3000;

app.get('/render', async (req, res) => {
    const { url, proxy } = req.query;

    if (!url || !url.startsWith('http')) {
        return res.status(400).send('Missing or invalid "url" parameter.');
    }

    try {
        const html = await getRenderedHTML(url, proxy);
        res.send(html);
    } catch (err) {
        console.error('Render error:', err.message);
        res.status(500).send('Failed to render page.');
    }
});

app.listen(PORT, () => {
    console.log(`✅ /render API started on http://localhost:${PORT}`);
});