import React from 'react';
import type { GeneratedCopy, CampaignType, EmailContent, ImageEmailContent, SmsContent } from '../types';
import { DownloadIcon } from './icons';
import { ImageEmailPreview, TextEmailPreview, SmsPreview } from './ui';

interface PreviewProps {
    generatedCopy: GeneratedCopy[];
    campaignType: CampaignType;
    setStep: (step: number) => void;
    exportToCSV: () => void;
    exportToJSON: () => void;
    copyToClipboard: (text: string, id: string) => void;
    copiedStates: Record<string, boolean>;
    abSplit: number;
    setAbSplit: (split: number) => void;
}

export const PreviewView: React.FC<PreviewProps> = ({ generatedCopy, campaignType, setStep, exportToCSV, exportToJSON, copyToClipboard, copiedStates, abSplit, setAbSplit }) => {
    
    const renderPreview = (variant: 'A' | 'B', content: any, customerId: number, customerName: string) => {
        const key = `${customerId}-${variant}`;
        const isCopied = !!copiedStates[key];
        
        switch (campaignType) {
            case 'Image Email':
                const imageContent = content as ImageEmailContent;
                const imageEmailText = `Subject: ${imageContent.subject}\n\n${imageContent.body}`;
                return <ImageEmailPreview variant={variant} content={imageContent} customerName={customerName} onCopy={() => copyToClipboard(imageEmailText, key)} isCopied={isCopied} />;
            case 'Text Email':
                 const textContent = content as EmailContent;
                 const textEmailText = `Subject: ${textContent.subject}\n\n${textContent.body}`;
                return <TextEmailPreview variant={variant} content={textContent} customerName={customerName} onCopy={() => copyToClipboard(textEmailText, key)} isCopied={isCopied} />;
            case 'SMS':
                const smsContent = content as SmsContent;
                const smsText = `${smsContent.part1}${smsContent.part2 ? `\n${smsContent.part2}`: ''}`;
                return <SmsPreview variant={variant} content={smsContent} customerName={customerName} onCopy={() => copyToClipboard(smsText, key)} isCopied={isCopied} />;
            default:
                return null;
        }
    };
    
    return (
        <section>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                     <h3 className="text-2xl font-bold tracking-tight text-gray-900">Step 3: Preview & Export</h3>
                     <p className="text-gray-500">Review the A/B test variants for each customer.</p>
                </div>
                <div className="flex items-center gap-2">
                     <button onClick={() => setStep(2)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm">
                        &larr; Back to Edit
                    </button>
                     <button onClick={exportToJSON} className="inline-flex items-center bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm">
                        <DownloadIcon /> JSON
                    </button>
                    <button onClick={exportToCSV} className="inline-flex items-center bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm">
                        <DownloadIcon /> CSV
                    </button>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8">
                <label htmlFor="ab-split-slider" className="block text-sm font-bold text-gray-700 mb-2 text-center">A/B Test Distribution</label>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-indigo-600 w-20 text-center">Variant A: {abSplit}%</span>
                    <input
                        id="ab-split-slider"
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={abSplit}
                        onChange={(e) => setAbSplit(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        aria-label="A/B test split slider"
                    />
                    <span className="text-sm font-semibold text-sky-600 w-20 text-center">Variant B: {100 - abSplit}%</span>
                </div>
            </div>
            
            <div className="space-y-8">
                {generatedCopy.map(({ customer, variants }) => (
                    <div key={customer.id} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <div className="pb-4 border-b border-gray-200 mb-4">
                            <h4 className="font-bold text-lg text-gray-900">
                                Customer: <span className="text-indigo-600">{customer.name}</span>
                            </h4>
                            <p className="text-sm text-gray-500">
                               {customer.segment} &bull; Last Purchase: {customer.lastPurchase} &bull; Sentiment: {customer.sentiment}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {renderPreview('A', variants.A, customer.id, customer.name)}
                            {renderPreview('B', variants.B, customer.id, customer.name)}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};