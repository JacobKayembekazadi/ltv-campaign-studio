
import React from 'react';
import type { Customer, CampaignType, Tone } from '../types';
import { CustomerTable, ToggleButton } from './ui';
import { EditIcon, WandIcon, MailIcon, MessageIcon } from './icons';

interface SetupViewProps {
    customers: Customer[];
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    addCustomer: () => void;
    updateCustomer: (id: number, field: keyof Omit<Customer, 'id'>, value: string) => void;
    removeCustomer: (id: number) => void;
    error: string;
    campaignType: CampaignType;
    setCampaignType: (type: CampaignType) => void;
    tone: Tone;
    setTone: (tone: Tone) => void;
    activePrompt: string;
    setActivePrompt: (prompt: string) => void;
    handleGenerate: () => void;
    isGenerateDisabled: boolean;
    isLoading: boolean;
}

export const SetupView: React.FC<SetupViewProps> = ({
    customers, handleFileUpload, addCustomer, updateCustomer, removeCustomer, error,
    campaignType, setCampaignType, tone, setTone, activePrompt, setActivePrompt,
    handleGenerate, isGenerateDisabled, isLoading
}) => (
    <div className="space-y-10">
        <section>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
                <span className="text-indigo-600 mr-2">1.</span> Customer Data
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="font-bold mb-2">Upload CSV</h4>
                    <p className="text-sm text-gray-500 mb-4">
                        File must have columns: Name, Segment, Last Purchase, Sentiment.
                    </p>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="font-bold mb-2">Or Add Manually</h4>
                    <p className="text-sm text-gray-500 mb-4">
                        Add or edit customer data below.
                    </p>
                    <button onClick={addCustomer} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg text-sm">
                        + Add Customer
                    </button>
                </div>
            </div>
            {customers.length > 0 && <CustomerTable customers={customers} updateCustomer={updateCustomer} removeCustomer={removeCustomer} />}
        </section>

        <section>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
                <span className="text-indigo-600 mr-2">2.</span> Campaign Configuration
            </h3>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Campaign Type</label>
                    <div className="flex space-x-2">
                        <ToggleButton active={campaignType === 'Email'} onClick={() => setCampaignType('Email')}>
                            <MailIcon /> Email
                        </ToggleButton>
                        <ToggleButton active={campaignType === 'SMS'} onClick={() => setCampaignType('SMS')}>
                            <MessageIcon /> SMS
                        </ToggleButton>
                    </div>
                </div>
                <div>
                    <label htmlFor="tone" className="block text-sm font-bold text-gray-700 mb-2">Brand Voice / Tone</label>
                    <select
                        id="tone"
                        value={tone}
                        onChange={(e) => setTone(e.target.value as Tone)}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
                    >
                        <option>Empathetic</option>
                        <option>Urgent</option>
                        <option>VIP Hype</option>
                        <option>Professional</option>
                        <option>Witty</option>
                    </select>
                </div>
            </div>
        </section>

        <section>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
                <span className="text-indigo-600 mr-2">3.</span> Refine & Generate
            </h3>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <label htmlFor="prompt-editor" className="flex items-center text-sm font-bold text-gray-700 mb-2">
                    <EditIcon />
                    <span className="ml-1">Prompt Editor</span>
                </label>
                <textarea
                    id="prompt-editor"
                    value={activePrompt}
                    onChange={(e) => setActivePrompt(e.target.value)}
                    rows={8}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-4 font-mono"
                    placeholder="Your prompt instructions for the AI..."
                />
                 <div className="mt-6 text-right">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerateDisabled}
                        className="inline-flex items-center justify-center px-8 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            <>
                                <WandIcon />
                                Generate Copy
                            </>
                        )}
                    </button>
                </div>
            </div>
        </section>
    </div>
);
