'use client';

import { useState } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';

interface QRPaymentsProps {
  onScan?: (data: string) => void;
  onGenerate?: (data: string) => void;
}

export default function QRPayments({ onScan, onGenerate }: QRPaymentsProps) {
  const [mode, setMode] = useState<'scan' | 'generate'>('scan');
  const [qrData, setQRData] = useState('');
  const [qrImage, setQRImage] = useState('');

  const handleQRScan = async (imageData: ImageData) => {
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
      setQRData(code.data);
      onScan?.(code.data);
    }
  };

  const generateQR = async (data: string) => {
    try {
      const url = await QRCode.toDataURL(data);
      setQRImage(url);
      onGenerate?.(data);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-center space-x-4">
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

      {mode === 'scan' && (
        <div className="mt-4">
          <video
            id="qr-video"
            className="w-full rounded-lg"
            onCanPlay={(e) => {
              const video = e.target as HTMLVideoElement;
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                handleQRScan(imageData);
              }
            }}
          />
          {qrData && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">Scanned Data:</h3>
              <p className="break-all">{qrData}</p>
            </div>
          )}
        </div>
      )}

      {mode === 'generate' && (
        <div className="mt-4">
          <input
            type="text"
            value={qrData}
            onChange={(e) => {
              setQRData(e.target.value);
              generateQR(e.target.value);
            }}
            placeholder="Enter data for QR code"
            className="w-full px-4 py-2 border rounded-lg mb-4"
          />
          {qrImage && (
            <div className="flex justify-center">
              <img src={qrImage} alt="Generated QR Code" className="rounded-lg" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}