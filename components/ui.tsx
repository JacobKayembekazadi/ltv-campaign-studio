import React from 'react';
import type { Customer, EmailContent, ImageEmailContent, SmsContent } from '../types';
import { CheckIcon, ClipboardIcon, UserCircleIcon, StarIcon } from './icons';

interface CustomerTableProps {
    customers: Customer[];
    updateCustomer: (id: number, field: keyof Omit<Customer, 'id'>, value: string) => void;
    removeCustomer: (id: number) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({ customers, updateCustomer, removeCustomer }) => (
    <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Purchase</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Remove</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td className="px-6 py-4 whitespace-nowrap"><input type="text" value={customer.name} onChange={(e) => updateCustomer(customer.id, 'name', e.target.value)} className="w-full p-1 border-gray-200 border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" /></td>
                            <td className="px-6 py-4 whitespace-nowrap"><input type="text" value={customer.segment} onChange={(e) => updateCustomer(customer.id, 'segment', e.target.value)} className="w-full p-1 border-gray-200 border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" /></td>
                            <td className="px-6 py-4 whitespace-nowrap"><input type="date" value={customer.lastPurchase} onChange={(e) => updateCustomer(customer.id, 'lastPurchase', e.target.value)} className="w-full p-1 border-gray-200 border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" /></td>
                             <td className="px-6 py-4 whitespace-nowrap">
                                <select value={customer.sentiment} onChange={(e) => updateCustomer(customer.id, 'sentiment', e.target.value)} className="w-full p-1 border-gray-200 border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-transparent">
                                    <option>Positive</option><option>Neutral</option><option>Negative</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => removeCustomer(customer.id)} className="text-red-600 hover:text-red-900 text-xl font-bold">&times;</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

interface ToggleButtonProps {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({ active, onClick, children }) => (
    <button onClick={onClick} className={`flex items-center justify-center w-full px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${active ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white hover:bg-gray-100 border-gray-300'}`}>
        {children}
    </button>
);

interface PreviewProps {
    variant: 'A' | 'B';
    customerName: string;
    onCopy: () => void;
    isCopied: boolean;
}

interface EmailPreviewProps extends PreviewProps {
    content: EmailContent;
}

const EmailInboxItemPreview: React.FC<EmailPreviewProps> = ({ variant, content, customerName, onCopy, isCopied }) => {
    // Debug logging to see what content we're getting
    console.log('EmailInboxItemPreview - variant:', variant, 'content:', content, 'customerName:', customerName);
    
    const subject = content?.subject?.replace('[Name]', customerName) || '[No Subject - Debug: content is ' + JSON.stringify(content) + ']';
    const body = content?.body?.replace('[Name]', customerName) || '';
    const rawSnippet = body.split('\n').join(' ').replace(/\s+/g, ' ').trim();
    const snippet = rawSnippet.length > 110 ? rawSnippet.substring(0, 107).trim() + '…' : rawSnippet;

    return (
        <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 relative group hover:shadow-md transition-shadow duration-200">
            <PreviewHeader variant={variant} onCopy={onCopy} isCopied={isCopied} />
            <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-2 pt-0.5 text-gray-400 flex-shrink-0">
                    <input aria-label="Select conversation" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                    <button className="hover:text-yellow-500" aria-label="Star email">
                        <StarIcon className="h-4 w-4" />
                    </button>
                </div>
                <div className="flex-shrink-0 w-40 md:w-44 font-medium text-gray-800 truncate leading-snug">
                    Marketing Team
                </div>
                <div className="flex-grow min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate leading-snug pr-6">{subject}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed pr-6">{snippet || 'No preview available.'}</p>
                </div>
            </div>
        </div>
    );
};


interface ImageEmailPreviewProps extends PreviewProps {
    content: ImageEmailContent;
}

export const ImageEmailPreview: React.FC<ImageEmailPreviewProps> = (props) => {
    const { content, variant, customerName, onCopy, isCopied } = props;
    // Reuse email inbox header style then add expanded content below
    const subject = content?.subject?.replace('[Name]', customerName) || '[No Subject]';
    const body = content?.body?.replace('[Name]', customerName) || '';
    return (
        <div className="bg-white rounded-lg border border-gray-200 relative group overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <PreviewHeader variant={variant} onCopy={onCopy} isCopied={isCopied} />
            {content.imageUrl && (
                <div className="w-full h-40 bg-gray-100 overflow-hidden flex items-center justify-center border-b border-gray-200">
                    <img src={content.imageUrl} alt="Campaign" className="object-cover w-full h-full" loading="lazy" />
                </div>
            )}
            <div className="p-4 space-y-3">
                <h5 className="font-semibold text-gray-900 text-sm leading-snug">{subject}</h5>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                    {body}
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                    {content.ctaText && (
                        <button className="text-xs font-semibold bg-indigo-600 text-white px-3 py-1.5 rounded-md shadow hover:bg-indigo-700 transition">
                            {content.ctaText}
                        </button>
                    )}
                    {content.couponCode && (
                        <span className="text-[11px] tracking-wide font-mono bg-yellow-100 text-yellow-800 px-2 py-1 rounded border border-yellow-300">CODE: {content.couponCode}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

interface TextEmailPreviewProps extends PreviewProps {
    content: EmailContent;
}

export const TextEmailPreview: React.FC<TextEmailPreviewProps> = (props) => {
    return <EmailInboxItemPreview {...props} />;
}

interface SmsPreviewProps extends PreviewProps {
    content: SmsContent;
}

export const SmsPreview: React.FC<SmsPreviewProps> = ({ variant, content, customerName, onCopy, isCopied }) => {
    const part1 = content?.part1?.replace('[Name]', customerName) || `Hi ${customerName}!`;
    const part2 = content?.part2?.replace('[Name]', customerName);

    return (
        <div className="bg-slate-900 rounded-3xl p-2 shadow-xl border-4 border-slate-800">
            <div className="bg-white rounded-[1.25rem] p-4 flex flex-col min-h-[250px] relative">
                <PreviewHeader variant={variant} onCopy={onCopy} isCopied={isCopied} />
                <div className="flex-grow flex flex-col justify-end p-2 space-y-2">
                    <div className="text-center my-2">
                        <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-3 py-1">{customerName.toUpperCase()} - ACTIVE SEGMENT</span>
                    </div>
                    {/* Sender Message 1 */}
                    <div className="flex justify-start items-end gap-2">
                        <UserCircleIcon className="h-6 w-6 text-gray-300 flex-shrink-0" />
                        <p className="bg-gray-200 text-gray-800 text-sm rounded-t-2xl rounded-r-2xl py-2 px-4 max-w-[80%] break-words">
                            {part1}
                        </p>
                    </div>
                     {/* Customer Reply (Mock) */}
                    <div className="flex justify-end">
                        <p className="bg-blue-500 text-white text-sm rounded-t-2xl rounded-l-2xl py-2 px-4 max-w-[80%] break-words">
                            Thanks! Do you have any leggings to go with it?
                        </p>
                    </div>
                    {/* Sender Message 2 */}
                    {part2 && (
                         <div className="flex justify-start items-end gap-2">
                            <UserCircleIcon className="h-6 w-6 text-gray-300 flex-shrink-0" />
                            <p className="bg-gray-200 text-gray-800 text-sm rounded-t-2xl rounded-r-2xl py-2 px-4 max-w-[80%] break-words">
                                {part2}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface CopyButtonProps {
    onCopy: () => void;
    isCopied: boolean;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ onCopy, isCopied }) => (
     <button onClick={onCopy} className={`p-1.5 rounded-md transition-colors ${isCopied ? 'bg-green-100 text-green-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}>
         {isCopied ? <CheckIcon className="!mr-0 h-4 w-4"/> : <ClipboardIcon className="!mr-0 h-4 w-4"/>}
         <span className="sr-only">Copy</span>
    </button>
);

const PreviewHeader: React.FC<{variant: 'A' | 'B', onCopy: () => void, isCopied: boolean}> = ({variant, onCopy, isCopied}) => (
    <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${variant === 'A' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-sky-50 text-sky-700 border-sky-200'}`}>Variant {variant}</span>
        <CopyButton onCopy={onCopy} isCopied={isCopied} />
    </div>
);