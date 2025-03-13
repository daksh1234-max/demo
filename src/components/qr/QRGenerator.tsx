"use client";

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRGeneratorProps {
  data: string;
}

export default function QRGenerator({ data }: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && data) {
      QRCode.toCanvas(canvasRef.current, data, { width: 300, margin: 2 })
        .catch(error => {
          console.error('Error generating QR code:', error);
        });
    }
  }, [data]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas ref={canvasRef} className="border border-gray-300 rounded-lg p-2" />
    </div>
  );
}
