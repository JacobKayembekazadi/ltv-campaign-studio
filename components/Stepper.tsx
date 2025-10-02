import React from 'react';
import { CheckIcon } from './icons';

interface StepperProps {
    currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
    const steps = ["Customer Data", "Configure Campaign", "Preview & Export"];
    return (
        <nav aria-label="Progress">
            <ol role="list" className="flex items-center justify-center">
                {steps.map((step, index) => {
                    const stepIndex = index + 1;
                    const isCompleted = currentStep > stepIndex;
                    const isCurrent = currentStep === stepIndex;
                    return (
                        <li key={step} className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                            {isCompleted ? (
                                <>
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="h-0.5 w-full bg-indigo-600" />
                                    </div>
                                    <span className="relative flex h-8 w-8 items-center justify-center bg-indigo-600 rounded-full hover:bg-indigo-900">
                                        <CheckIcon className="h-5 w-5 text-white !mr-0" />
                                    </span>
                                </>
                            ) : isCurrent ? (
                                <>
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="h-0.5 w-full bg-gray-200" />
                                    </div>
                                    <span className="relative flex h-8 w-8 items-center justify-center bg-white border-2 border-indigo-600 rounded-full" aria-current="step">
                                        <span className="h-2.5 w-2.5 bg-indigo-600 rounded-full" aria-hidden="true" />
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="h-0.5 w-full bg-gray-200" />
                                    </div>
                                    <span className="group relative flex h-8 w-8 items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400">
                                        <span className="h-2.5 w-2.5 bg-transparent rounded-full" aria-hidden="true" />
                                    </span>
                                </>
                            )}
                            <span className={`absolute top-10 w-max -left-1/2 transform translate-x-1/2 pt-1 text-xs font-medium ${isCurrent ? 'text-indigo-600' : 'text-gray-500'}`}>{step}</span>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
