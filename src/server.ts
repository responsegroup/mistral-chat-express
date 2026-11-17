import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Mistral } from '@mistralai/mistralai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT ?? 3000);
const MODEL = 'mistral-small-latest';

if (!process.env.MISTRAL_API_KEY) {
  console.warn('Warning: MISTRAL_API_KEY is not set. Create a .env file from .env.example.');
}

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

app.post('/api/chat', async (req, res) => {
  const messages = req.body?.messages;

  const isValid =
    Array.isArray(messages) &&
    messages.length > 0 &&
    messages.every(
      (m: unknown) =>
        typeof m === 'object' &&
        m !== null &&
        ['system', 'user', 'assistant'].includes((m as ChatMessage).role) &&
        typeof (m as ChatMessage).content === 'string',
    );

  if (!isValid) {
    return res.status(400).json({ error: 'Body must contain a non-empty "messages" array.' });
  }

  if (!process.env.MISTRAL_API_KEY) {
    return res.status(500).json({ error: 'MISTRAL_API_KEY is not configured on the server.' });
  }

  try {
    const response = await mistral.chat.complete({
      model: MODEL,
      messages: messages as ChatMessage[],
    });

    const content = response.choices[0]?.message?.content;
    if (typeof content !== 'string') {
      return res.status(502).json({ error: 'Unexpected response from the Mistral API.' });
    }

    res.json({ role: 'assistant', content });
  } catch (err) {
    console.error('Mistral API error:', err);
    res.status(502).json({ error: 'The Mistral API request failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`Chat app running at http://localhost:${PORT}`);
});
