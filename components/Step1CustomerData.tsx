import React from 'react';
import type { Customer } from '../types';
import { CustomerTable } from './ui';
import { ArrowRightIcon } from './icons';

interface Step1Props {
    customers: Customer[];
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    addCustomer: () => void;
    updateCustomer: (id: number, field: keyof Omit<Customer, 'id'>, value: string) => void;
    removeCustomer: (id: number) => void;
    setStep: (step: number) => void;
}

export const Step1CustomerData: React.FC<Step1Props> = ({ customers, handleFileUpload, addCustomer, updateCustomer, removeCustomer, setStep }) => (
    <section>
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-4 text-center">
            Step 1: Upload or Add Customer Data
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="font-bold mb-2 text-gray-800">Upload CSV</h4>
                <p className="text-sm text-gray-500 mb-4">
                    File must have columns: Name, Segment, Last Purchase, Sentiment.
                </p>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="font-bold mb-2 text-gray-800">Or Add Manually</h4>
                <p className="text-sm text-gray-500 mb-4">
                    Add or edit customer data in the table below.
                </p>
                <button onClick={addCustomer} className="w-full bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg text-sm border border-gray-300">
                    + Add Customer Row
                </button>
            </div>
        </div>
        {customers.length > 0 && <CustomerTable customers={customers} updateCustomer={updateCustomer} removeCustomer={removeCustomer} />}
        <div className="mt-8 text-right">
             <button
                onClick={() => setStep(2)}
                disabled={customers.length === 0}
                className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
            >
                Next: Configure Campaign
                <ArrowRightIcon />
            </button>
        </div>
    </section>
);