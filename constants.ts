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
        text: "Customer Profile: [Name] is a [Segment] customer who abandoned their cart. Current sentiment: [Sentiment]. Last purchase: [Last Purchase].\n\nMission: Create urgency to complete purchase. Use segment psychology - VIP gets exclusivity angle, Churn Risk gets win-back incentive, New gets reassurance and social proof. Reference specific items they left behind. Drive immediate action."
    },
    {
        id: 'promo-2', 
        name: 'VIP Loyalty Reward',
        text: "Customer Profile: [Name] is a [Segment] customer. Last purchase: [Last Purchase]. Sentiment: [Sentiment].\n\nMission: Reward loyalty with exclusive perks. VIP segment gets early access and premium benefits. Regular segment gets appreciation with upgrade path. Create sense of being valued and special. Include time-sensitive reward."
    },
    {
        id: 'promo-3',
        name: 'New Product Launch',
        text: "Customer Profile: [Name] is a [Segment] customer. Purchase history: [Last Purchase]. Sentiment: [Sentiment].\n\nMission: Generate excitement for new product launch. VIP gets first access, New customers get education + social proof, Churn Risk gets comeback incentive. Create FOMO and anticipation. Include specific product benefits."
    },
    {
        id: 'promo-4',
        name: 'Seasonal Sale Blast',
        text: "Customer Profile: [Name] ([Segment]) with [Sentiment] sentiment. Last engaged: [Last Purchase].\n\nMission: Drive seasonal purchases with targeted offers. Reference their past purchase patterns. VIP gets bigger discounts, New gets welcome offer, Churn Risk gets aggressive win-back. Create urgency with limited time."
    },
    {
        id: 'promo-5',
        name: 'Cross-Sell Recommendation',
        text: "Customer Profile: [Name] is a [Segment] customer. Previous purchase: [Last Purchase]. Current sentiment: [Sentiment].\n\nMission: Recommend complementary products based on purchase history. Use social proof and benefit stacking. Create natural progression from what they already bought. Include bundle incentive."
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
