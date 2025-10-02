import { GoogleGenAI, Type } from "@google/genai";
import type { CampaignType, GeneratedVariants, Tone, Persona, ImageEmailContent, EmailContent, SmsContent } from "../types";

// Instantiate client using Vite public env variable. Must be prefixed with VITE_ in .env
const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;
if (!apiKey) {
    console.error('Gemini API key missing. Make sure VITE_GEMINI_API_KEY is defined in your .env file.');
}
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// --- Retry / Backoff Configuration ---
const MAX_RETRIES = 5;
const BASE_DELAY_MS = 500; // initial backoff

function sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms));
}

function isRetriableError(err: any): boolean {
    if (!err) return false;
    const status = err.status || err.code || err?.error?.status;
    const msg = (err.message || "").toLowerCase();
    // 503 (UNAVAILABLE) model overloaded, 429 rate limit, sometimes surfaced only in message
    return status === 503 || status === 429 || msg.includes("overloaded") || msg.includes("unavailable") || msg.includes("rate limit");
}

async function callModelWithRetry(request: Parameters<typeof ai.models.generateContent>[0]) {
    let lastError: any;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            return await ai.models.generateContent(request);
        } catch (err: any) {
            lastError = err;
            if (!isRetriableError(err) || attempt === MAX_RETRIES - 1) {
                break;
            }
            const delay = BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 250; // jitter
            console.warn(`Gemini request failed (attempt ${attempt + 1}/${MAX_RETRIES}). Retrying in ${Math.round(delay)}ms...`, err?.status || err?.message);
            await sleep(delay);
        }
    }
    throw lastError;
}

function createVariantSchema(schemaType: 'Image' | 'Text' | 'SMS') {
    if (schemaType === 'Image') {
        return {
            type: Type.OBJECT,
            properties: {
                subject: { type: Type.STRING, description: 'The subject line of the email.' },
                body: { type: Type.STRING, description: 'The body content of the email, written in markdown. It should be personal and engaging.' },
                imageUrl: { type: Type.STRING, description: 'A URL for a high-quality, relevant stock image.' },
                ctaText: { type: Type.STRING, description: 'The text for the call-to-action button, e.g., "Shop Now".' },
                couponCode: { type: Type.STRING, description: 'A promotional coupon code.' },
            },
            required: ['subject', 'body', 'imageUrl', 'ctaText', 'couponCode']
        };
    }
    if (schemaType === 'Text') {
        return {
            type: Type.OBJECT,
            properties: {
                subject: { type: Type.STRING, description: 'The subject line of the email.' },
                body: { type: Type.STRING, description: 'The body content of the email. Keep it concise and personal, like a note from a friend.' },
            },
            required: ['subject', 'body']
        };
    }
    // SMS
    return {
        type: Type.OBJECT,
        properties: {
            part1: { type: Type.STRING, description: 'The first part of a conversational SMS. Should be a friendly opening.' },
            part2: { type: Type.STRING, description: 'The second part of the SMS, continuing the conversation.' },
        },
        required: ['part1', 'part2']
    };
}


export async function generateCampaignCopy(
    prompt: string,
    campaignType: CampaignType,
    tone: Tone,
    persona: Persona
): Promise<GeneratedVariants> {

    const styleGuidelines = `You are an AI Marketing Copywriter specializing in e-commerce conversion rate optimization (CRO). Your role is to generate short-form, high-impact copy for Email and SMS campaigns that maximizes engagement (opens, clicks, purchases). \n\nSTRICT OUTPUT BEHAVIOR (STILL RETURN JSON SCHEMA BELOW, *NOT* MARKDOWN):\n- ALWAYS produce two distinct persuasive variants (A & B).\n- Personalize copy using provided customer attributes verbatim.\n- Tone MUST reflect: ${tone}.\n- Segment context MUST influence hook & offer framing.\n- Email subjects: 5-8 words, curiosity or benefit-driven, no spammy excessive punctuation.\n- Email body: 3-6 concise sentences. Begin with a hook tied to the segment. Finish with a strong CTA line.\n- SMS body: < 240 characters, 1 hook + benefit + CTA.\n- Include a clear CTA (ctaText / cta field).\n- Avoid generic filler, avoid robotic phrasing, no meta commentary.\n- If couponCode requested or implied by prompt and segment is Churn risk or VIP, you may include one.\n- DO NOT add explanatory prose outside JSON.\n`;

    const systemInstruction = `${styleGuidelines}\nYou are embodying a ${persona} brand persona with a ${tone} tone. Generate two distinct versions of marketing copy (Variant A and Variant B) based on the user's prompt. Ensure the response strictly follows the provided JSON schema. Personalize the content by directly using the customer's name and details provided in the prompt.` +
        '';

    let schemaType: 'Image' | 'Text' | 'SMS';
    if (campaignType === 'Image Email') schemaType = 'Image';
    else if (campaignType === 'Text Email') schemaType = 'Text';
    else schemaType = 'SMS';

    const variantSchema = createVariantSchema(schemaType);

    const finalSchema = {
        type: Type.OBJECT,
        properties: {
            A: { ...variantSchema, description: 'The first version of the marketing copy.' },
            B: { ...variantSchema, description: 'The second, alternative version of the marketing copy.' }
        },
        required: ['A', 'B']
    };


    let response;
    try {
        response = await callModelWithRetry({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: finalSchema
            }
        });
    } catch (err: any) {
        if (isRetriableError(err)) {
            throw new Error("The model is currently overloaded after multiple retries. Please try again in a moment.");
        }
        // Propagate non-retriable errors with original context
        throw new Error(`Gemini request failed: ${err?.message || String(err)}`);
    }

    try {
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        if (!parsedJson.A || !parsedJson.B) {
            throw new Error("Missing Variant A or B in AI response.");
        }
        // Post-process normalization to enforce style constraints (failsafe tightening)
        const normalize = (variant: any) => {
            if (!variant) return variant;
            // SUBJECT (emails only)
            if (campaignType !== 'SMS' && variant.subject) {
                const words = variant.subject.split(/\s+/).filter(Boolean);
                if (words.length > 8) {
                    variant.subject = words.slice(0, 8).join(' ');
                }
            }
            // BODY for SMS: ensure char limit
            if (campaignType === 'SMS' && variant.part1) {
                // legacy schema: part1/part2; we join to measure
                const combined = variant.part1 + (variant.part2 ? ' ' + variant.part2 : '');
                if (combined.length > 240) {
                    const trimmed = combined.slice(0, 237).trimEnd() + '...';
                    // Simple split back (keep everything in part1)
                    variant.part1 = trimmed;
                    delete variant.part2;
                }
            }
            // CTA fallbacks
            if (variant.ctaText && typeof variant.ctaText === 'string') {
                variant.ctaText = variant.ctaText.trim();
                if (!/shop|claim|complete|view|explore|redeem|buy/i.test(variant.ctaText)) {
                    variant.ctaText = variant.ctaText + ' →';
                }
            }
            return variant;
        };
        normalize(parsedJson.A);
        normalize(parsedJson.B);
        return parsedJson as GeneratedVariants;
    } catch (e) {
        console.error("Failed to parse Gemini response raw text:", response?.text);
        throw new Error(`The AI returned an invalid response format. ${String(e)}`);
    }
}