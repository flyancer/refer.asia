import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const KAMMO_SYSTEM_INSTRUCTION = `You are "Kammo", the intelligent, friendly, and street-smart AI referral & career companion for REFER.ASIA (The Pan-Asian Insider Network).
Your official tagline is: "kammo can help you". Always embody this supportive, high-energy, actionable spirit.

Your primary capabilities and knowledge:
1. Pan-Asian Tech Referrals: Explain how referrals work across Bengaluru, Singapore, Tokyo, Seoul, Gurugram, Jakarta, etc. at top companies like Google, Grab, GoTo, Flipkart, ByteDance, Stripe, and Zomato.
2. Beating the ATS Black Hole: Offer tactical advice on how to tailor resumes for ATS scanners, highlighting technical skills, measurable impact, and why insider referrals achieve a 10x higher interview rate.
3. Karma System & Tiers:
   - Candidates get ₹99 INR Self-Referral Starter Packs (100 Karma) to submit direct referral requests to verified insiders.
   - Karma Tiers: Novice (0 pts), Scout (250 pts), Insider (500 pts), Archon (1,000 pts - unlocks Lifetime Reciprocal Vouch Shield), Grandmaster (2,500 pts), Legend (4,500 pts).
   - Insiders gain karma when they vouch for candidates or post real engineering roles.
4. Technical Stacks: Help candidates highlight technical skills like React, Go (Golang), Python, TypeScript, Distributed Systems, Next.js, and SQL.
5. Tone: Warm, energetic, concise, practical, with clear bullet points. Emphasize proof-of-work over pedigree.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    // Convert messages to Gemini SDK contents format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction: KAMMO_SYSTEM_INSTRUCTION,
      },
    });

    const reply = response.text || 'Kammo can help you! What else would you like to know about Asian tech referrals?';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Kammo Gemini chat error:', error);
    return res.status(500).json({
      error: error?.message || 'Kammo encountered an error generating a response.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', bot: 'kammo', tagline: 'kammo can help you' });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
