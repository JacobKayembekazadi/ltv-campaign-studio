import React from 'react';
import type { Prompt, CampaignType, Tone, Persona } from '../types';
import { ToggleButton } from './ui';
import { EditIcon, WandIcon, MailIcon, MessageIcon, ImageIcon } from './icons';

interface Step2Props {
    promptLibrary: Prompt[];
    selectedPromptId: string;
    handleSelectPrompt: (prompt: Prompt) => void;
    activePromptText: string;
    setActivePromptText: (text: string) => void;
    campaignType: CampaignType;
    setCampaignType: (type: CampaignType) => void;
    tone: Tone;
    setTone: (tone: Tone) => void;
    persona: Persona;
    setPersona: (persona: Persona) => void;
    handleGenerate: () => void;
    isLoading: boolean;
    isGenerateDisabled: boolean;
    setStep: (step: number) => void;
}

export const Step2ConfigureCampaign: React.FC<Step2Props> = ({
    promptLibrary, selectedPromptId, handleSelectPrompt, activePromptText, setActivePromptText,
    campaignType, setCampaignType, tone, setTone, persona, setPersona, handleGenerate, isLoading, isGenerateDisabled, setStep
}) => (
     <section>
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-6 text-center">
            Step 2: Choose a Prompt & Configure
        </h3>
        <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-1/3 bg-gray-50 p-4 rounded-xl border">
                 <h4 className="font-bold text-gray-800 mb-3 px-2">Prompt Library</h4>
                 <div className="space-y-1">
                    {promptLibrary.map(prompt => (
                        <button
                            key={prompt.id}
                            onClick={() => handleSelectPrompt(prompt)}
                            className={`w-full text-left p-3 rounded-lg transition-colors text-sm font-medium ${selectedPromptId === prompt.id ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-200'}`}
                        >
                            {prompt.name}
                        </button>
                    ))}
                </div>
            </aside>
            <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Campaign Type</label>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <ToggleButton active={campaignType === 'Image Email'} onClick={() => setCampaignType('Image Email')}>
                                <ImageIcon /> Image Email
                            </ToggleButton>
                            <ToggleButton active={campaignType === 'Text Email'} onClick={() => setCampaignType('Text Email')}>
                                <MailIcon /> Text Email
                            </ToggleButton>
                            <ToggleButton active={campaignType === 'SMS'} onClick={() => setCampaignType('SMS')}>
                                <MessageIcon /> SMS
                            </ToggleButton>
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="persona" className="block text-sm font-bold text-gray-700 mb-2">Brand Persona</label>
                            <select id="persona" value={persona} onChange={(e) => setPersona(e.target.value as Persona)} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5">
                                <option>Luxury</option>
                                <option>Minimalist</option>
                                <option>Playful</option>
                                <option>Eco-conscious</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="tone" className="block text-sm font-bold text-gray-700 mb-2">Voice / Tone</label>
                            <select id="tone" value={tone} onChange={(e) => setTone(e.target.value as Tone)} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5">
                                <option>Empathetic</option>
                                <option>Urgent</option>
                                <option>VIP Hype</option>
                                <option>Professional</option>
                                <option>Witty</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div>
                     <label htmlFor="prompt-editor" className="flex items-center text-sm font-bold text-gray-700 mb-2">
                        <EditIcon />
                        <span className="ml-1">Prompt Editor</span>
                    </label>
                    <textarea id="prompt-editor" value={activePromptText} onChange={(e) => setActivePromptText(e.target.value)} rows={8}
                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-4 font-mono"
                        placeholder="Your prompt instructions for the AI..."
                    />
                </div>
                 <div className="mt-6 flex justify-between items-center">
                    <button onClick={() => setStep(1)} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm">
                        &larr; Back
                    </button>
                    <button onClick={handleGenerate} disabled={isGenerateDisabled}
                        className="inline-flex items-center justify-center px-8 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300">
                        {isLoading ? (
                            <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating...</>
                        ) : (
                            <><WandIcon />Generate Copy</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    </section>
);