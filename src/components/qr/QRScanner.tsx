'use client';

import { useEffect, useRef, useState } from 'react';
import { BarcodeDetector } from '@/lib/barcodeDetector';

interface QRScannerProps {
  onScan: (data: string | null) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          startScanning();
        }
      } catch (err) {
        setError('Failed to access camera');
        console.error('Camera access error:', err);
      }
    };

    const startScanning = async () => {
      if (!videoRef.current || !canvasRef.current || isScanning) return;

      try {
        const detector = new BarcodeDetector({ formats: ['qr_code'] });
        setIsScanning(true);

        const checkForQRCode = async () => {
          if (!videoRef.current || !canvasRef.current) return;

          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');

          if (context && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            try {
              const codes = await detector.detect(canvas);
              if (codes.length > 0) {
                onScan(codes[0].rawValue);
              } else {
                onScan(null);
              }
            } catch (err) {
              console.error('QR detection error:', err);
            }
          }
          animationFrameId = requestAnimationFrame(checkForQRCode);
        };

        checkForQRCode();
      } catch (err) {
        setError('QR code scanning not supported');
        console.error('BarcodeDetector error:', err);
      }
    };

    startCamera();

    return () => {
      setIsScanning(false);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
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
        autoPlay
      />
      <canvas
        ref={canvasRef}
        className="hidden"
      />
      <div className="absolute inset-0 border-2 border-dashed border-indigo-500 rounded-lg pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-48 h-48 border-2 border-indigo-500 rounded-lg" />
      </div>
    </div>
  );
}
