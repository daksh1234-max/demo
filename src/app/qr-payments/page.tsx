'use client';

import QRPayments from '@/components/client/QRPayments';

export default function QRPaymentsPage() {
  const handleQRScan = (data: string) => {
    console.log('Scanned QR code:', data);
    // Handle the scanned data (e.g., process payment)
  };

  const handleQRGenerate = (data: string) => {
    console.log('Generated QR code:', data);
    // Handle the generated data (e.g., save payment details)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">QR Payments</h1>
        <QRPayments onScan={handleQRScan} onGenerate={handleQRGenerate} />
      </div>
    </div>
  );
}
