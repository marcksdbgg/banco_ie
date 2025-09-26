"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
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
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const html5QrCodeRef = useRef<import('html5-qrcode').Html5Qrcode | null>(null);

  // stable handler for scan results
  const handleScanResultCallback = useCallback(async (text: string) => {
    if (text && status === 'scanning') {
      setStatus('loading');
      try {
        const url = new URL(text ?? '');
        const numeroCuenta = url.searchParams.get('account') ?? text; // accept plain number as fallback

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
  }, [status, onScanSuccess, onClose]);

  useEffect(() => {
    let mounted = true;

    const startScanner = async () => {
      if (!scannerRef.current) return;
      try {
  const mod = await import('html5-qrcode');
  const Html5Qrcode = (mod as unknown as { Html5Qrcode: typeof import('html5-qrcode').Html5Qrcode }).Html5Qrcode;
        if (!mounted) return;
        const elementId = `html5qr-scanner-${Math.random().toString(36).slice(2, 9)}`;
        // give the container a stable id for the library
        scannerRef.current.id = elementId;
        const html5QrCode = new Html5Qrcode(elementId);
        html5QrCodeRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText: string) => handleScanResultCallback(decodedText),
          (errorMessage: string) => {
            // we could log errors per frame; keep UI stable
            void errorMessage;
          }
        );
      } catch (err) {
        setStatus('error');
        setMessage((err as Error).message || 'No se pudo acceder a la cámara.');
      }
    };

    if (isOpen) {
      setStatus('scanning');
      setMessage('');
      startScanner();
    }

    return () => {
      mounted = false;
      const instance = html5QrCodeRef.current;
      if (instance && instance.stop) {
        instance.stop().catch(() => undefined).finally(() => instance.clear && instance.clear());
      }
      html5QrCodeRef.current = null;
    };
  }, [isOpen]);

  // manual input will call handleScanResultCallback above

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader><DialogTitle>Escanear Código QR</DialogTitle></DialogHeader>

        <div className="mt-4 flex flex-col gap-4">
          <p className="text-sm text-gray-600">Alinea el código QR dentro del área. Si la cámara no funciona, puedes ingresar el número de cuenta manualmente.</p>

          <div className="w-full bg-gray-50 rounded overflow-hidden">
            <div ref={scannerRef} className="w-full h-64 sm:h-96" />
            {status === 'scanning' && <p className="sr-only">Escaneando...</p>}

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
