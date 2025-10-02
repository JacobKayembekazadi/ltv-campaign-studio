import type { Customer, Prompt } from './types';

// Assets Constants
export const ASSETS = {
    LOGOS: {
        LTV_LOGO: '/images/logos/ltv-logo.avif',
    }
} as const;

export const INITIAL_CUSTOMERS: Customer[] = [
    { id: 1, name: 'Aaliyah', segment: 'VIP', lastPurchase: '2024-06-15', sentiment: 'Positive' },
    { id: 2, name: 'Maria Garcia', segment: 'New', lastPurchase: '2024-07-28', sentiment: 'Neutral' },
    { id: 3, name: 'David Smith', segment: 'Churn risk', lastPurchase: '2024-03-10', sentiment: 'Negative' },
];

export const PROMPT_LIBRARY: Prompt[] = [
    {
        id: 'promo-1',
        name: 'Abandoned Cart Recovery',
        text: "Generate a personalized message for [Name] who is a [Segment] customer and left items in their cart. Their sentiment is [Sentiment].\n\nObjective: Remind them to complete their order. Offer a small incentive if their segment is 'Churn risk'. Highlight urgency if their segment is 'VIP'. If an explicit image URL override is provided externally, keep copy relevant to that image; do not invent a different one."
    },
    {
        id: 'promo-2',
        name: 'VIP Loyalty Reward',
        text: "Generate a personalized message for [Name] who is a [Segment] customer. Their last purchase was on [Last Purchase] and their sentiment is [Sentiment].\n\nObjective: Thank this loyal customer. If they are a 'VIP', include an exclusive reward or early access. Keep the tone warm, personal, and celebratory. Respect any externally provided image URL if present."
    },
    {
        id: 'promo-3',
        name: 'Product Launch Hype',
        text: "Generate a personalized message for [Name] ([Segment] customer) to build excitement for a new product launch: [PRODUCT NAME - REPLACE THIS].\n\nObjective: For 'VIPs', emphasize exclusivity. For 'New' customers, highlight benefits and social proof. Include a strong call-to-action. If an image override is supplied, align copy with that image theme."
    },
    {
        id: 'promo-4',
        name: 'Service Recovery Apology',
        text: "Generate a personalized message for [Name] ([Segment] customer) who recently had an issue or refund. Their sentiment is [Sentiment].\n\nObjective: Acknowledge their frustration, rebuild trust, and offer a goodwill gesture. Focus on the relationship over the transaction. Honor provided image override if any."
    },
    {
        id: 'promo-5',
        name: 'Churn Risk Re-Engagement',
        text: "Generate a personalized message for [Name] who is a [Segment] customer at risk of churning. Their last purchase was on [Last Purchase].\n\nObjective: Re-engage them by using urgency (a limited-time discount) or curiosity (new arrivals) to spark a return purchase. If an image override is provided, weave its theme into copy."
    }
];
