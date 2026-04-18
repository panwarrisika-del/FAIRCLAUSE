import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '2mb' }));

const MODELS = [
    'meta-llama/llama-3.3-70b-instruct:free',
    'mistralai/mistral-7b-instruct:free',
    'google/gemma-3-4b-it:free',
    'openrouter/free',
];

async function callOpenRouter(system, userMessage, maxTokens = 2000, modelIndex = 0) {
    if (modelIndex >= MODELS.length) {
        throw new Error('All free models are currently unavailable. Please try again in a minute.');
    }

    const model = MODELS[modelIndex];

    // Trim to stay within limits
    if (userMessage.length > 4000) userMessage = userMessage.slice(0, 4000) + '\n[truncated]';
    if (system && system.length > 1500) system = system.slice(0, 1500) + '\n[truncated]';

    console.log(`Trying model: ${model}`);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'http://localhost:5173',
            'X-Title': 'RiskSurface India',
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
    console.log(`Response from ${model}:`, JSON.stringify(data).slice(0, 300));

    if (!response.ok || data.error) {
        console.warn(`Model ${model} failed, trying next...`);
        return callOpenRouter(system, userMessage, maxTokens, modelIndex + 1);
    }

    const text = data?.choices?.[0]?.message?.content || '';
    if (!text) {
        console.warn(`Model ${model} returned empty, trying next...`);
        return callOpenRouter(system, userMessage, maxTokens, modelIndex + 1);
    }

    return text;
}

app.post('/api/claude', async (req, res) => {
    try {
        const { system, messages, max_tokens } = req.body;
        const userMessage = messages?.[0]?.content || '';

        const text = await callOpenRouter(system, userMessage, max_tokens || 2000);
        res.json({ content: [{ type: 'text', text }] });

    } catch (err) {
        console.error('Server error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3001, () => console.log('✅ Backend running on http://localhost:3001'));