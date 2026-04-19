import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '2mb' }));

async function callMistral(system, userMessage, maxTokens = 2000, attempt = 0) {
    // Trim to stay within limits
    if (userMessage.length > 5000) userMessage = userMessage.slice(0, 5000) + '\n[truncated]';
    if (system && system.length > 2000) system = system.slice(0, 2000) + '\n[truncated]';

    const models = [
        'mistral-small-latest',
        'open-mistral-7b',
        'open-mixtral-8x7b',
    ];

    const model = models[attempt] || models[0];
    console.log(`Trying Mistral model: ${model}`);

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
    console.log('Mistral response status:', response.status);

    if (!response.ok) {
        console.error('Mistral error:', data);
        if (attempt < models.length - 1) {
            await new Promise(r => setTimeout(r, 1000));
            return callMistral(system, userMessage, maxTokens, attempt + 1);
        }
        throw new Error(data?.message || `Mistral API error ${response.status}`);
    }

    return data?.choices?.[0]?.message?.content || '';
}

app.post('/api/claude', async (req, res) => {
    try {
        const { system, messages, max_tokens } = req.body;
        const userMessage = messages?.[0]?.content || '';

        const text = await callMistral(system, userMessage, max_tokens || 2000);
        res.json({ content: [{ type: 'text', text }] });

    } catch (err) {
        console.error('Server error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3001, () => console.log('✅ FairClause backend running on http://localhost:3001'));