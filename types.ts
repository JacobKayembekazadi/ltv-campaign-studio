export interface Customer {
    id: number;
    name: string;
    segment: string;
    lastPurchase: string;
    sentiment: string;
}

export interface Prompt {
    id: string;
    name: string;
    text: string;
}

export type CampaignType = 'Image Email' | 'Text Email' | 'SMS';
export type Tone = 'Empathetic' | 'Urgent' | 'VIP Hype' | 'Professional' | 'Witty';
export type Persona = 'Luxury' | 'Minimalist' | 'Playful' | 'Eco-conscious';


export interface EmailContent {
    subject: string;
    body: string;
}

export interface ImageEmailContent extends EmailContent {
    imageUrl: string;
    ctaText: string;
    couponCode?: string;
}

export interface SmsContent {
    part1: string;
    part2?: string;
}

export type GeneratedVariantContent = ImageEmailContent | EmailContent | SmsContent;

export type GeneratedVariants = {
    A: GeneratedVariantContent;
    B: GeneratedVariantContent;
}

export interface GeneratedCopy {
    customer: Customer;
    variants: GeneratedVariants;
}