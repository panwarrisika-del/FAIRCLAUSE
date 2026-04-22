import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || '*',
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-api-key'],
}));

app.use(express.json({ limit: '10mb' }));

// ─── RATE LIMITER ─────────────────────────────────────────────────────────────
const rateMap = new Map();
function rateLimiter(req, res, next) {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000;
    const maxRequests = 20;

    if (!rateMap.has(ip)) rateMap.set(ip, []);
    const timestamps = rateMap.get(ip).filter(t => now - t < windowMs);
    timestamps.push(now);
    rateMap.set(ip, timestamps);

    if (timestamps.length > maxRequests) {
        return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
    }
    next();
}

// ─── AUTH GUARD ───────────────────────────────────────────────────────────────
function authGuard(req, res, next) {
    if (!process.env.APP_SECRET) return next();
    const key = req.headers['x-api-key'];
    if (key !== process.env.APP_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

// ─── MISTRAL CALL ─────────────────────────────────────────────────────────────
async function callMistral(system, userMessage, maxTokens = 4000, attempt = 0) {
    if (userMessage.length > 12000) userMessage = userMessage.slice(0, 12000) + '\n[truncated for analysis]';
    if (system && system.length > 4000) system = system.slice(0, 4000) + '\n[truncated]';

    const models = [
        'mistral-small-latest',
        'open-mistral-7b',
        'open-mixtral-8x7b',
    ];

    const model = models[attempt] || models[0];
    console.log(`[FairClause] Trying model: ${model}`);

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
            model,
            max_tokens: maxTokens,
            temperature: 0.2,
            messages: [
                ...(system ? [{ role: 'system', content: system }] : []),
                { role: 'user', content: userMessage },
            ],
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('[FairClause] Mistral error:', data);
        if (attempt < models.length - 1) {
            await new Promise(r => setTimeout(r, 1000));
            return callMistral(system, userMessage, maxTokens, attempt + 1);
        }
        throw new Error(data?.message || `API error ${response.status}`);
    }

    return data?.choices?.[0]?.message?.content || '';
}

// ─── MAIN ENDPOINT ────────────────────────────────────────────────────────────
app.post('/api/claude', rateLimiter, authGuard, async (req, res) => {
    try {
        const { system, messages, max_tokens } = req.body;
        const userMessage = messages?.[0]?.content || '';

        if (!userMessage.trim()) {
            return res.status(400).json({ error: 'No message content provided.' });
        }

        if (!process.env.MISTRAL_API_KEY) {
            return res.status(500).json({ error: 'Server not configured. MISTRAL_API_KEY missing.' });
        }

        const text = await callMistral(system, userMessage, max_tokens || 4000);
        res.json({ content: [{ type: 'text', text }] });

    } catch (err) {
        console.error('[FairClause] Server error:', err.message);
        res.status(500).json({ error: err.message || 'Analysis failed. Please try again.' });
    }
});

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'FairClause API', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ FairClause backend running on http://localhost:${PORT}`));