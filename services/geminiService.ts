import { GoogleGenAI, Type } from "@google/genai";
import type { CampaignType, GeneratedVariants, Tone, Persona, ImageEmailContent, EmailContent, SmsContent } from "../types";

// Get API key from Vite env vars
const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
if (!apiKey) {
    console.error('Gemini API key missing. Make sure VITE_GEMINI_API_KEY is defined in your .env file.');
}
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// --- Retry / Backoff Configuration ---
const MAX_RETRIES = 5;
const BASE_DELAY_MS = 500;

function sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms));
}

function isRetriableError(err: any): boolean {
    if (!err) return false;
    const status = err.status || err.code || err?.error?.status;
    const msg = (err.message || "").toLowerCase();
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
            const delay = BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 250;
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
            part1: { type: Type.STRING, description: 'First SMS message: casual, direct opener with name. Max 70 characters. Example: "Hey Sarah! Your cart misses you 😊"' },
            part2: { type: Type.STRING, description: 'Second SMS message: benefit + urgency + CTA. Max 90 characters. Example: "Grab those items before they sell out → [link]"' },
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

    const styleGuidelines = `You are an AI Marketing Copywriter specializing in e-commerce conversion rate optimization (CRO). Your role is to generate short-form, high-impact copy for Email and SMS campaigns that maximizes engagement (opens, clicks, purchases).

CRITICAL RULES FOR HIGH-CONVERTING COPY:
1. PERSONALIZATION: Use the customer's exact name, segment, purchase history, and sentiment provided
2. SEGMENT-SPECIFIC HOOKS: 
   - VIP: Exclusive access, early bird, members-only
   - Churn Risk: We miss you, come back, special win-back offer
   - New: Welcome, first purchase bonus, discover
   - Regular: Seasonal offers, new arrivals, recommendations
3. TONE ADHERENCE: Copy MUST reflect the specified ${tone} tone throughout
4. PERSONA EMBODIMENT: Channel the ${persona} brand voice consistently

STRICT FORMATTING REQUIREMENTS:
- Email subjects: 3-7 words max, benefit-driven or curiosity gap, NO excessive punctuation
- Email body: 2-4 sentences max, hook + benefit + urgency + clear CTA
- SMS: CASUAL & CONVERSATIONAL like texting a friend. Use "Hey [Name]!" openings. Max 160 chars total across both parts. Include emojis sparingly.
- CTAs: Action-oriented verbs (Shop, Claim, Discover, Get, Unlock)
- Coupons: Only for VIP/Churn segments, format like SAVE20 or WELCOME15

SMS-SPECIFIC RULES:
- Write like you're texting a friend, not sending a formal message
- Use contractions (you're, don't, can't)
- Keep sentences short and punchy
- NO formal language like "exquisite selections" or "patiently awaiting"
- Use casual phrases: "Your cart misses you", "Don't let these sell out", "Grab yours"
- Include 1-2 relevant emojis maximum
- Split naturally between 2 messages that flow together

AVOID AT ALL COSTS:
- Generic greetings like "Hope you're well"
- Corporate jargon or robotic language  
- Multiple exclamation points or ALL CAPS
- Vague benefits or weak CTAs
- Repetitive phrasing between variants
- FORMAL SMS LANGUAGE - keep it casual and conversational!

OUTPUT: Two distinctly different, high-converting variants that feel human-written and segment-appropriate.`;

    const systemInstruction = `${styleGuidelines}\n\nEmbody a ${persona} brand persona with ${tone} tone. The customer data provided contains real insights - use them strategically. Generate two completely different marketing approaches (Variant A and B) that would genuinely convert this specific customer based on their profile.`;

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
        throw new Error(`Gemini request failed: ${err?.message || String(err)}`);
    }

    try {
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        if (!parsedJson.A || !parsedJson.B) {
            throw new Error("Missing Variant A or B in AI response.");
        }
        
        // Enhanced post-processing for quality control
        const normalize = (variant: any) => {
            if (!variant) return variant;
            
            // Subject line quality control
            if (campaignType !== 'SMS' && variant.subject) {
                let subject = variant.subject.trim();
                // Remove excessive punctuation
                subject = subject.replace(/[!]{2,}/g, '!').replace(/[?]{2,}/g, '?');
                // Word count enforcement (3-7 words for better open rates)
                const words = subject.split(/\s+/).filter(Boolean);
                if (words.length > 7) {
                    subject = words.slice(0, 7).join(' ');
                }
                variant.subject = subject;
            }
            
            // Body quality control
            if (variant.body) {
                let body = variant.body.trim();
                // Remove generic openers
                body = body.replace(/^(Hi there,?|Hello,?|Hope you're well,?)\s*/i, '');
                // Ensure personal name usage if available in original prompt
                variant.body = body;
            }
            
            // SMS length and quality enforcement
            if (campaignType === 'SMS' && variant.part1) {
                // Clean up formal language in SMS
                let part1 = variant.part1.replace(/exquisite|patiently awaiting|valued customer|selections/gi, '');
                let part2 = variant.part2 || '';
                
                // Ensure casual tone
                part1 = part1.replace(/^(Hello|Hi there),?\s*/i, 'Hey ');
                part1 = part1.replace(/\byou are\b/gi, "you're");
                part1 = part1.replace(/\bdo not\b/gi, "don't");
                part1 = part1.replace(/\bcannot\b/gi, "can't");
                
                // Same for part2
                part2 = part2.replace(/\byou are\b/gi, "you're");
                part2 = part2.replace(/\bdo not\b/gi, "don't");
                part2 = part2.replace(/\bcannot\b/gi, "can't");
                
                const combined = part1 + ' ' + part2;
                if (combined.length > 160) {
                    // Trim but keep it natural
                    const trimmed = combined.slice(0, 157).trimEnd() + '...';
                    // Try to split at natural point
                    const midPoint = Math.floor(trimmed.length / 2);
                    const splitPoint = trimmed.indexOf(' ', midPoint);
                    if (splitPoint > 0 && splitPoint < trimmed.length - 20) {
                        variant.part1 = trimmed.slice(0, splitPoint).trim();
                        variant.part2 = trimmed.slice(splitPoint).trim();
                    } else {
                        variant.part1 = trimmed;
                        delete variant.part2;
                    }
                } else {
                    variant.part1 = part1.trim();
                    variant.part2 = part2.trim();
                }
            }
            
            // CTA enhancement
            if (variant.ctaText && typeof variant.ctaText === 'string') {
                let cta = variant.ctaText.trim();
                // Ensure action-oriented language
                const actionWords = ['shop', 'claim', 'get', 'discover', 'unlock', 'grab', 'secure', 'explore', 'buy', 'order'];
                if (!actionWords.some(word => cta.toLowerCase().includes(word))) {
                    cta = 'Shop ' + cta;
                }
                variant.ctaText = cta;
            }
            
            // Coupon code enhancement for relevant segments
            if (variant.couponCode && typeof variant.couponCode === 'string') {
                let coupon = variant.couponCode.trim().toUpperCase();
                // Ensure proper format (letters + numbers)
                if (!/^[A-Z0-9]+$/.test(coupon)) {
                    coupon = coupon.replace(/[^A-Z0-9]/g, '');
                }
                variant.couponCode = coupon || 'SAVE15';
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