import express from 'express';
import { extractIAAIData } from './crawler.js';

const app = express();
const PORT = 3000;

// GET /extract?url=...&proxy=http://user:pass@host:port
app.get('/extract', async (req, res) => {
    const { url, proxy } = req.query;

    if (!url || !url.includes('iaai.com')) {
        return res.status(400).json({ error: 'Missing or invalid url parameter' });
    }

    try {
        const data = await extractIAAIData(url, proxy);
        res.json(data);
    } catch (err) {
        console.error('Extract error:', err.message);
        res.status(500).json({ error: 'Failed to extract vehicle data' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ API /extract is running on http://localhost:${PORT}`);
});