'use client';

import { useState } from 'react';
import Image from 'next/image';
import QRScanner from '@/components/qr/QRScanner';
import QRGenerator from '@/components/qr/QRGenerator';

interface QRPaymentsProps {
  onScan: (data: string | null) => void;
  onGenerate: (data: string) => void;
}

export default function QRPayments({ onScan, onGenerate }: QRPaymentsProps) {
  const [mode, setMode] = useState<'scan' | 'generate'>('scan');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [paymentData, setPaymentData] = useState<string>('');

  const handleModeSwitch = (newMode: 'scan' | 'generate') => {
    setMode(newMode);
  };

  const handleScan = (data: string | null) => {
    if (data) {
      onScan(data);
    }
  };

  const handleGenerate = () => {
    if (paymentData) {
      onGenerate(paymentData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 justify-center mb-6">
        <button
          onClick={() => handleModeSwitch('scan')}
          className={`px-4 py-2 rounded-lg ${
            mode === 'scan'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Scan QR Code
        </button>
        <button
          onClick={() => handleModeSwitch('generate')}
          className={`px-4 py-2 rounded-lg ${
            mode === 'generate'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Generate QR Code
        </button>
      </div>

      {mode === 'scan' && (
        <div className="space-y-4">
          <QRScanner onScan={handleScan} />
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Position the QR code within the frame to scan
          </p>
        </div>
      )}

      {mode === 'generate' && (
        <div className="space-y-4">
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              value={paymentData}
              onChange={(e) => setPaymentData(e.target.value)}
              placeholder="Enter payment details"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
            />
            <button
              onClick={handleGenerate}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Generate QR Code
            </button>
          </div>
          
          {qrCodeUrl && (
            <div className="flex justify-center">
              <div className="relative w-48 h-48">
                <Image
                  src={qrCodeUrl}
                  alt="Generated QR Code"
                  width={192}
                  height={192}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          )}
          
          {paymentData && !qrCodeUrl && (
            <QRGenerator data={paymentData} />
          )}
        </div>
      )}
    </div>
  );
}