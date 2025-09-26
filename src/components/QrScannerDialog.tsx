'use client';

import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { createClient } from '@/lib/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

type QrScannerDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: () => void;
};

export default function QrScannerDialog({ isOpen, onClose, onScanSuccess }: QrScannerDialogProps) {
  const [status, setStatus] = useState<'scanning' | 'loading' | 'success' | 'error'>('scanning');
  const [message, setMessage] = useState('');

  const handleScanResult = async (result: any, error: any) => {
    if (!!result && status === 'scanning') {
      setStatus('loading');
      try {
        const url = new URL(result.text);
        const numeroCuenta = url.searchParams.get('account');

        if (!numeroCuenta) {
          throw new Error("Código QR no válido.");
        }

        const supabase = createClient();
        const { data, error: invokeError } = await supabase.functions.invoke('solicitar-amistad', {
          body: { numero_cuenta_amigo: numeroCuenta },
        });

        if (invokeError || data?.error) {
          throw new Error(data?.error || invokeError.message);
        }

        setStatus('success');
        setMessage(data.message);
        setTimeout(() => {
          onScanSuccess(); // Refresh the friends list
          onClose();       // Close the dialog
        }, 2000);

      } catch (err) {
        setStatus('error');
        const error = err as Error;
        setMessage(error.message || 'Ocurrió un error.');
        // Reset after a delay so the user can try again
        setTimeout(() => setStatus('scanning'), 3000);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Escanear Código QR</DialogTitle></DialogHeader>
        <div className="mt-4">
          {status === 'scanning' && (
            <QrReader
              onResult={handleScanResult}
              constraints={{ facingMode: 'environment' }}
              className="w-full"
            />
          )}
          {status === 'loading' && <Loader2 className="mx-auto h-16 w-16 animate-spin" />}
          {status === 'success' && (
            <Alert variant="default" className="bg-green-100"><CheckCircle /><AlertTitle>Éxito</AlertTitle><AlertDescription>{message}</AlertDescription></Alert>
          )}
          {status === 'error' && (
            <Alert variant="destructive"><AlertCircle /><AlertTitle>Error</AlertTitle><AlertDescription>{message}</AlertDescription></Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
