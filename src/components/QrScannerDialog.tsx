'use client';

import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { createClient } from '@/lib/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type QrScannerDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: () => void;
};

export default function QrScannerDialog({ isOpen, onClose, onScanSuccess }: QrScannerDialogProps) {
  const [status, setStatus] = useState<'scanning' | 'loading' | 'success' | 'error'>('scanning');
  const [message, setMessage] = useState('');
  const [manualCode, setManualCode] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleScanResult = async (result: any) => {
    if (result && status === 'scanning') {
      setStatus('loading');
      try {
        const url = new URL(result.text ?? '');
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

      } catch (caught) {
        setStatus('error');
        const error = caught as Error;
        setMessage(error.message || 'Ocurrió un error.');
        // Reset after a delay so the user can try again
        setTimeout(() => setStatus('scanning'), 3000);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader><DialogTitle>Escanear Código QR</DialogTitle></DialogHeader>

        <div className="mt-4 flex flex-col gap-4">
          <p className="text-sm text-gray-600">Alinea el código QR dentro del área. Si la cámara no funciona, puedes ingresar el número de cuenta manualmente.</p>

          <div className="w-full bg-gray-50 rounded overflow-hidden">
            {status === 'scanning' && (
              <div className="aspect-square w-full">
                <QrReader
                  onResult={handleScanResult}
                  constraints={{ facingMode: 'environment' }}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {status === 'loading' && <div className="p-6 flex justify-center"><Loader2 className="h-12 w-12 animate-spin" /></div>}

            {status === 'success' && (
              <Alert variant="default" className="bg-green-100"><CheckCircle /><AlertTitle>Éxito</AlertTitle><AlertDescription>{message}</AlertDescription></Alert>
            )}

            {status === 'error' && (
              <Alert variant="destructive"><AlertCircle /><AlertTitle>Error</AlertTitle><AlertDescription>{message}</AlertDescription></Alert>
            )}
          </div>

          <div className="flex gap-2">
            <Input placeholder="Número de cuenta (si no puedes escanear)" value={manualCode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualCode(e.target.value)} />
            <Button onClick={async () => {
              if (!manualCode) return setMessage('Ingresa un número de cuenta.');
              setStatus('loading');
              try {
                const supabase = createClient();
                const { data, error: invokeError } = await supabase.functions.invoke('solicitar-amistad', { body: { numero_cuenta_amigo: manualCode } });
                if (invokeError || data?.error) throw new Error(data?.error || invokeError.message);
                setStatus('success');
                setMessage(data.message);
                setTimeout(() => { onScanSuccess(); onClose(); }, 2000);
              } catch (err) {
                setStatus('error');
                setMessage((err as Error).message || 'Ocurrió un error.');
                setTimeout(() => setStatus('scanning'), 3000);
              }
            }}>Enviar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
