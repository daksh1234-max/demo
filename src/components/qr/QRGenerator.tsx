import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface QRGeneratorProps {
  data: string;
  size?: number;
}

export default function QRGenerator({ data, size = 256 }: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, data, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      }).catch((err) => {
        setError('Failed to generate QR code');
        console.error('QR code generation error:', err);
      });
    }
  }, [data, size]);

  const handleDownload = () => {
    try {
      if (canvasRef.current) {
        const link = document.createElement('a');
        link.download = 'payment-qr.png';
        link.href = canvasRef.current.toDataURL('image/png');
        link.click();
      }
    } catch (err) {
      setError('Failed to download QR code');
      console.error('QR code download error:', err);
    }
  };

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <canvas ref={canvasRef} />
      </div>
      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Download QR Code
      </button>
    </div>
  );
}
