'use client';

import { useState } from 'react';
import QRScanner from '@/components/qr/QRScanner';
import QRGenerator from '@/components/qr/QRGenerator';

export default function QRPaymentsPage() {
  const [mode, setMode] = useState<'scan' | 'generate'>('scan');
  const [qrData, setQRData] = useState('');

  const handleQRScan = (data: string | null) => {
    if (data) {
      setQRData(data);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setMode('scan')}
            className={`px-4 py-2 rounded-lg ${
              mode === 'scan' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Scan QR
          </button>
          <button
            onClick={() => setMode('generate')}
            className={`px-4 py-2 rounded-lg ${
              mode === 'generate' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Generate QR
          </button>
        </div>

        {mode === 'scan' ? (
          <QRScanner onScan={handleQRScan} />
        ) : (
          <QRGenerator data={qrData} />
        )}

        {mode === 'generate' && (
          <div className="mt-4">
            <input
              type="text"
              value={qrData}
              onChange={(e) => setQRData(e.target.value)}
              placeholder="Enter data for QR code"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        )}

        {qrData && mode === 'scan' && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Scanned Data:</h3>
            <p className="break-all">{qrData}</p>
          </div>
        )}
      </div>
    </div>
  );
}
