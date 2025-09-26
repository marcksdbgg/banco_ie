"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import MyQrCodeDialog from '@/components/MyQrCodeDialog';
import QrScannerDialog from '@/components/QrScannerDialog';
import { Users, QrCode } from 'lucide-react';

export default function DashboardQuickActions() {
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" onClick={() => setIsScannerOpen(true)} className="flex items-center gap-2">
        <QrCode className="h-4 w-4" /> Escanear QR
      </Button>

      <Button onClick={() => setIsQrOpen(true)} className="flex items-center gap-2">
        <Users className="h-4 w-4" /> Mi Código QR
      </Button>

      <MyQrCodeDialog isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
      <QrScannerDialog isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScanSuccess={() => setIsScannerOpen(false)} />
    </div>
  );
}
