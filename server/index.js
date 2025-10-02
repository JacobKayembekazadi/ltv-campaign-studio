import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { generateServerVariants } from './geminiHandler.js';

// Load environment variables from .env at startup
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, campaignType, tone, persona } = req.body;
    if (!prompt) return res.status(400).json({ error: 'prompt required' });
    const data = await generateServerVariants({ prompt, campaignType, tone, persona });
    res.json(data);
  } catch (e) {
    console.error('Generation error:', e);
    res.status(500).json({ error: e.message || 'Internal Error' });
  }
});

const port = process.env.PORT || 5174;
const keyPresent = !!(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);
app.listen(port, () => console.log(`API server listening on ${port} (Gemini key ${keyPresent ? 'detected' : 'MISSING'})`));
