"use client";

import { useEffect, useRef, useState } from 'react';
import { BarcodeDetector } from '@/lib/barcodeDetector';

interface QRScannerProps {
  onScan: (data: string | null) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    let stream: MediaStream | null = null;

    const startScanning = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });

        if (videoRef.current && canvasRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();

          const detector = new BarcodeDetector({
            formats: ['qr_code']
          });

          const scanQRCode = async () => {
            if (videoRef.current && canvasRef.current) {
              const canvas = canvasRef.current;
              const context = canvas.getContext('2d');

              if (context) {
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

                try {
                  const codes = await detector.detect(canvas);
                  if (codes.length > 0) {
                    onScan(codes[0].rawValue);
                    setIsScanning(false);
                    if (stream) {
                      stream.getTracks().forEach(track => track.stop());
                    }
                    return;
                  }
                } catch (error) {
                  console.error('QR detection error:', error);
                }
              }
            }
            animationFrameId = requestAnimationFrame(scanQRCode);
          };

          scanQRCode();
        }
      } catch (err) {
        setError('Unable to access camera. Please ensure camera permissions are granted.');
        console.error('Camera access error:', err);
      }
    };

    if (isScanning) {
      startScanning();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isScanning, onScan]);

  return (
    <div className="relative">
      {!isScanning ? (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <button
            onClick={() => setIsScanning(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Start Scanning
          </button>
        </div>
      ) : (
        <div className="relative aspect-square w-full max-w-md mx-auto">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
            playsInline
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ display: 'none' }}
          />
          <div className="absolute inset-0 border-2 border-indigo-500 rounded-lg pointer-events-none">
            <div className="absolute inset-0 border-[20px] border-white/30 dark:border-black/30 rounded-lg" />
          </div>
          <button
            onClick={() => setIsScanning(false)}
            className="absolute top-4 right-4 px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md shadow-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}
