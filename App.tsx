import React, { useState, useCallback } from 'react';
import { Stepper } from './components/Stepper';
import { Step1CustomerData } from './components/Step1CustomerData';
import { Step2ConfigureCampaign } from './components/Step2ConfigureCampaign';
import { PreviewView } from './components/PreviewView';
import { generateCampaignCopy } from './services/geminiService';
import { INITIAL_CUSTOMERS, PROMPT_LIBRARY, ASSETS } from './constants';
import type { Customer, Prompt, CampaignType, Tone, Persona, GeneratedCopy, ImageEmailContent, EmailContent, SmsContent } from './types';

export default function App() {
    // --- STATE MANAGEMENT ---
    const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
    const [promptLibrary] = useState<Prompt[]>(PROMPT_LIBRARY);
    const [campaignType, setCampaignType] = useState<CampaignType>('Image Email');
    const [tone, setTone] = useState<Tone>('Empathetic');
    const [persona, setPersona] = useState<Persona>('Luxury');
    const [selectedPromptId, setSelectedPromptId] = useState<string>(promptLibrary[0].id);
    const [activePromptText, setActivePromptText] = useState<string>(promptLibrary[0].text);
    const [generatedCopy, setGeneratedCopy] = useState<GeneratedCopy[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [step, setStep] = useState<number>(1);
    const [error, setError] = useState<string>('');
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
    const [abSplit, setAbSplit] = useState<number>(50);

    // --- HANDLERS & LOGIC ---

    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === "text/csv") {
            setError('');
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                if (!text) return;
                const rows = text.split('\n').slice(1);
                const newCustomers = rows.map((row, index) => {
                    const columns = row.split(',');
                    if (columns.length >= 4) {
                        return {
                            id: Date.now() + index,
                            name: columns[0].trim(),
                            segment: columns[1].trim(),
                            lastPurchase: columns[2].trim(),
                            sentiment: columns[3].trim(),
                        };
                    }
                    return null;
                }).filter((c): c is Customer => c !== null);
                if (newCustomers.length > 0) {
                    setCustomers(newCustomers);
                } else {
                    setError('CSV file is empty or malformed. Please check the format.');
                }
            };
            reader.readAsText(file);
        } else if (file) {
            setError('Invalid file type. Please upload a CSV file.');
        }
    }, []);

    const addCustomer = () => {
        setCustomers([...customers, { id: Date.now(), name: '', segment: 'New', lastPurchase: '', sentiment: 'Neutral' }]);
    };
    
    const updateCustomer = (id: number, field: keyof Omit<Customer, 'id'>, value: string) => {
        setCustomers(customers.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const removeCustomer = (id: number) => {
        setCustomers(customers.filter(c => c.id !== id));
    };

    const handleSelectPrompt = (prompt: Prompt) => {
        setSelectedPromptId(prompt.id);
        setActivePromptText(prompt.text);
    };
    
    const handleGenerate = async () => {
        if (customers.length === 0) {
            setError('Please add at least one customer before generating copy.');
            return;
        }
        setError('');
        setIsLoading(true);
        setGeneratedCopy([]);
        
        const results: GeneratedCopy[] = [];
        
        for (const customer of customers) {
            const fullPrompt = activePromptText
                .replace('[Name]', customer.name)
                .replace('[Segment]', customer.segment)
                .replace('[Last Purchase]', customer.lastPurchase)
                .replace('[Sentiment]', customer.sentiment);
            
            try {
                const aiResponse = await generateCampaignCopy(fullPrompt, campaignType, tone, persona);
                results.push({ customer, variants: aiResponse });
            } catch (e) {
                console.error("API Error:", e);
                const errorMessage = e instanceof Error ? e.message : String(e);
                setError(`Failed to generate content for "${customer.name}". ${errorMessage}`);
                setIsLoading(false);
                return; 
            }
        }
        
        setGeneratedCopy(results);
        setIsLoading(false);
        setStep(3);
    };
    
    const downloadFile = (filename: string, content: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const exportToCSV = () => {
        let csvContent = "Customer Name,Segment,Type,Variant,Subject,Body,Image URL,CTA Text,Coupon Code,SMS Part 1,SMS Part 2\n";
        
        generatedCopy.forEach(item => {
            const { customer, variants } = item;
            const common = `"${customer.name}","${customer.segment}"`;

            const processVariant = (variantName: 'A' | 'B', content: any) => {
                if (campaignType === 'Image Email') {
                    const c = content as ImageEmailContent;
                    return `${common},"${campaignType}","${variantName}","${c.subject}","${c.body.replace(/"/g, '""')}","${c.imageUrl}","${c.ctaText}","${c.couponCode || ''}","",""\n`;
                } else if (campaignType === 'Text Email') {
                    const c = content as EmailContent;
                    return `${common},"${campaignType}","${variantName}","${c.subject}","${c.body.replace(/"/g, '""')}","","","","",""\n`;
                } else { // SMS
                    const c = content as SmsContent;
                    return `${common},"${campaignType}","${variantName}","","","","","","${c.part1.replace(/"/g, '""')}","${(c.part2 || '').replace(/"/g, '""')}"\n`;
                }
            };
            csvContent += processVariant('A', variants.A);
            csvContent += processVariant('B', variants.B);
        });

        downloadFile("campaign_copy.csv", csvContent, "text/csv");
    };

    const exportToJSON = () => {
        const jsonContent = JSON.stringify(generatedCopy, null, 2);
        downloadFile("campaign_copy.json", jsonContent, "application/json");
    };

    const copyToClipboard = (text: string, id: string) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            setCopiedStates(prev => ({ ...prev, [id]: true }));
            setTimeout(() => setCopiedStates(prev => ({ ...prev, [id]: false })), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        document.body.removeChild(textArea);
    };
    
    return (
        <div className="bg-gray-50 font-sans text-gray-800 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <img 
                            src={ASSETS.LOGOS.LTV_LOGO} 
                            alt="LTV Logo" 
                            className="h-12 w-auto"
                        />
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Campaign Studio</h1>
                    </div>
                    <p className="mt-2 text-lg text-gray-600">A simpler way to generate personalized campaigns.</p>
                </header>

                <Stepper currentStep={step} />

                {error && (
                    <div className="my-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-r-lg" role="alert">
                        <p className="font-bold">An Error Occurred</p>
                        <p>{error}</p>
                    </div>
                )}

                <div className="mt-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
                    {step === 1 && (
                        <Step1CustomerData
                            customers={customers}
                            handleFileUpload={handleFileUpload}
                            addCustomer={addCustomer}
                            updateCustomer={updateCustomer}
                            removeCustomer={removeCustomer}
                            setStep={setStep}
                        />
                    )}
                    {step === 2 && (
                        <Step2ConfigureCampaign
                            promptLibrary={promptLibrary}
                            selectedPromptId={selectedPromptId}
                            handleSelectPrompt={handleSelectPrompt}
                            activePromptText={activePromptText}
                            setActivePromptText={setActivePromptText}
                            campaignType={campaignType}
                            setCampaignType={setCampaignType}
                            tone={tone}
                            setTone={setTone}
                            persona={persona}
                            setPersona={setPersona}
                            handleGenerate={handleGenerate}
                            isLoading={isLoading}
                            isGenerateDisabled={isLoading || customers.length === 0}
                            setStep={setStep}
                        />
                    )}
                    {step === 3 && (
                        <PreviewView
                            generatedCopy={generatedCopy}
                            campaignType={campaignType}
                            setStep={setStep}
                            exportToCSV={exportToCSV}
                            exportToJSON={exportToJSON}
                            copyToClipboard={copyToClipboard}
                            copiedStates={copiedStates}
                            abSplit={abSplit}
                            setAbSplit={setAbSplit}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}