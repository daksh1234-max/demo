"use client";

import { useEffect, useRef, useState } from 'react';
import { BarcodeDetector } from '@/lib/barcodeDetector';

interface QRScannerProps {
  onScan: (data: string | null) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          startScanning();
        }
      } catch (err) {
        setError('Failed to access camera');
        console.error('Camera access error:', err);
      }
    };

    const startScanning = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      try {
        const detector = new BarcodeDetector({ formats: ['qr_code'] });
        const checkForQRCode = async () => {
          if (!videoRef.current || !canvasRef.current) return;

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
              }
            } catch (err) {
              console.error('QR detection error:', err);
            }
          }
          requestAnimationFrame(checkForQRCode);
        };
        checkForQRCode();
      } catch (err) {
        setError('QR code scanning not supported');
        console.error('BarcodeDetector error:', err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onScan]);

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400 text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/10">
        {error}
      </div>
    );
  }

  return (
    <div className="relative aspect-video max-w-lg mx-auto">
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg"
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="hidden"
      />
      <div className="absolute inset-0 border-2 border-dashed border-indigo-500 rounded-lg pointer-events-none" />
    </div>
  );
}
