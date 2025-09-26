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
  const containerRef = useRef<HTMLDivElement | null>(null);
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
      if (!scannerRef.current || !containerRef.current) return;
      try {
        const mod = await import('html5-qrcode');
        const Html5Qrcode = (mod as unknown as { Html5Qrcode: typeof import('html5-qrcode').Html5Qrcode }).Html5Qrcode;
        if (!mounted) return;
        const elementId = `html5qr-scanner-${Math.random().toString(36).slice(2, 9)}`;
        // give the inner element a stable id for the library
        scannerRef.current.id = elementId;
        const html5QrCode = new Html5Qrcode(elementId);
        html5QrCodeRef.current = html5QrCode;

        // compute a square qrbox based on container size
        const rect = containerRef.current.getBoundingClientRect();
        const minSide = Math.min(rect.width, rect.height);
        const qrboxSize = Math.max(180, Math.floor(minSide * 0.75));

        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: qrboxSize },
          (decodedText: string) => handleScanResultCallback(decodedText),
          (errorMessage: string) => {
            // ignore per-frame errors
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
  }, [isOpen, handleScanResultCallback]);

  // manual input will call handleScanResultCallback above

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader><DialogTitle>Escanear Código QR</DialogTitle></DialogHeader>

        <div className="mt-4 flex flex-col gap-4">
          <p className="text-sm text-gray-600">Alinea el código QR dentro del área. Si la cámara no funciona, puedes ingresar el número de cuenta manualmente.</p>

          <div ref={containerRef} className="w-full bg-gray-50 rounded overflow-hidden relative">
            <div ref={scannerRef} className="w-full h-64 sm:h-96 bg-black/10" />

            {/* Overlay: translucent edges with centered square cutout */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative" style={{ width: '75%', maxWidth: 420 }}>
                <div className="absolute inset-0 bg-black/40 rounded-lg" />
                <div className="mx-auto my-6" style={{ width: '100%', paddingTop: '100%', position: 'relative' }}>
                  <div className="absolute inset-0 border-4 border-white rounded-md" />
                  {/* animated scanline */}
                  {status === 'scanning' && (
                    <div className="absolute left-0 right-0 top-0 h-0.5 bg-white/80 animate-slide" style={{ transformOrigin: 'left' }} />
                  )}
                </div>
              </div>
            </div>

            {status === 'loading' && <div className="p-6 flex justify-center"><Loader2 className="h-12 w-12 animate-spin" /></div>}

            {status === 'success' && (
              <div className="p-6 flex flex-col items-center gap-3">
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-lg font-semibold">Contacto agregado</h3>
                <p className="text-sm text-gray-600 text-center">{message || 'Se añadió a tu lista de amigos correctamente.'}</p>
                <div className="mt-3">
                  <Button onClick={() => { onScanSuccess(); onClose(); }}>Cerrar</Button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="p-6">
                <Alert variant="destructive"><AlertCircle /><AlertTitle>Error</AlertTitle><AlertDescription>{message}</AlertDescription></Alert>
              </div>
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
