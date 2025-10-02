import { GoogleGenAI, Type } from '@google/genai';

// --- Retry / Backoff Configuration (duplicated from client logic) ---
const MAX_RETRIES = 5;
const BASE_DELAY_MS = 500;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function isRetriableError(err) {
  if (!err) return false;
  const status = err.status || err.code || err?.error?.status;
  const msg = (err.message || '').toLowerCase();
  return status === 503 || status === 429 || msg.includes('overloaded') || msg.includes('unavailable') || msg.includes('rate limit');
}

async function callModelWithRetry(ai, request) {
  let lastError;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await ai.models.generateContent(request);
    } catch (err) {
      lastError = err;
      if (!isRetriableError(err) || attempt === MAX_RETRIES - 1) break;
      const delay = BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 250;
      console.warn(`Gemini server request failed (attempt ${attempt + 1}/${MAX_RETRIES}). Retrying in ${Math.round(delay)}ms...`, err?.status || err?.message);
      await sleep(delay);
    }
  }
  throw lastError;
}

function createVariantSchema(kind) {
  if (kind === 'Image') {
    return {
      type: Type.OBJECT,
      properties: {
        subject: { type: Type.STRING },
        body: { type: Type.STRING },
        imageUrl: { type: Type.STRING },
        ctaText: { type: Type.STRING },
        couponCode: { type: Type.STRING }
      },
      required: ['subject', 'body', 'imageUrl', 'ctaText', 'couponCode']
    };
  }
  if (kind === 'Text') {
    return {
      type: Type.OBJECT,
      properties: {
        subject: { type: Type.STRING },
        body: { type: Type.STRING }
      },
      required: ['subject', 'body']
    };
  }
  return {
    type: Type.OBJECT,
    properties: {
      part1: { type: Type.STRING },
      part2: { type: Type.STRING }
    },
    required: ['part1', 'part2']
  };
}

export async function generateServerVariants({ prompt, campaignType, tone, persona }) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Server missing GEMINI_API_KEY (or VITE_GEMINI_API_KEY). Add it to your .env file.');
  }
  const ai = new GoogleGenAI({ apiKey });

  const styleGuidelines = `You are an AI Marketing Copywriter specializing in e-commerce conversion rate optimization (CRO). Generate persuasive short-form copy. Tone: ${tone}. Persona: ${persona}.`;

  let schemaType;
  if (campaignType === 'Image Email') schemaType = 'Image';
  else if (campaignType === 'Text Email') schemaType = 'Text';
  else schemaType = 'SMS';

  const variantSchema = createVariantSchema(schemaType);
  const finalSchema = {
    type: Type.OBJECT,
    properties: {
      A: { ...variantSchema },
      B: { ...variantSchema }
    },
    required: ['A', 'B']
  };

  const response = await callModelWithRetry(ai, {
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: styleGuidelines,
      responseMimeType: 'application/json',
      responseSchema: finalSchema
    }
  });

  let parsed;
  try {
    parsed = JSON.parse(response.text.trim());
  } catch (e) {
    throw new Error('Invalid JSON from model');
  }
  if (!parsed.A || !parsed.B) throw new Error('Missing variants');
  return parsed;
}
