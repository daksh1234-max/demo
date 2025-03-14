'use client';

import { useState } from 'react';
import QRScanner from '@/components/qr/QRScanner';
import QRGenerator from '@/components/qr/QRGenerator';

export default function QRPaymentsPage() {
  const [activeTab, setActiveTab] = useState<'scan' | 'generate'>('scan');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-4 px-6 text-center ${
              activeTab === 'scan'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Scan QR Code
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-4 px-6 text-center ${
              activeTab === 'generate'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Generate QR Code
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'scan' ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Scan QR Code to Pay
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Position the QR code within the frame to scan and process the payment
              </p>
              <QRScanner
                onScan={(data) => {
                  if (data) {
                    // Handle the scanned data
                    console.log('Scanned data:', data);
                  }
                }}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Generate Payment QR Code
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter payment description"
                  />
                </div>
                <div className="pt-4">
                  <QRGenerator
                    data={JSON.stringify({
                      amount,
                      description,
                      timestamp: new Date().toISOString(),
                    })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
