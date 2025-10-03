"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// using @zxing/browser dynamically (no direct import to avoid SSR issues)

type QrScannerDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess?: () => void;
  mode?: 'friend' | 'transfer';
  onAccountDetected?: (numeroCuenta: string) => Promise<void> | void;
  transferSuccessMessage?: string;
};

export default function QrScannerDialog({
  isOpen,
  onClose,
  onScanSuccess,
  mode = 'friend',
  onAccountDetected,
  transferSuccessMessage,
}: QrScannerDialogProps) {
  const [status, setStatus] = useState<'scanning' | 'loading' | 'success' | 'error'>('scanning');
  const [message, setMessage] = useState('');
  const [manualCode, setManualCode] = useState('');
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  type ZXingDecodeResult = { getText?: () => string; text?: string } | null;
  type DecodeCallback = (result: ZXingDecodeResult, error?: Error | null) => void;
  type BrowserQRCodeReaderType = {
    decodeFromVideoDevice(deviceId: string | undefined, element: HTMLVideoElement, cb: DecodeCallback): Promise<void>;
    reset?: () => void;
  };

  const codeReaderRef = useRef<BrowserQRCodeReaderType | null>(null);
  const isRunningRef = useRef(false);

  const handleScanResult = useCallback(async (text: string) => {
    if (!text) return;
    if (status !== 'scanning') return;
    setStatus('loading');
    try {
      let numeroCuenta = '';
      try {
        const url = new URL(text, window.location.origin);
        numeroCuenta =
          url.searchParams.get('account') ??
          url.searchParams.get('numero_cuenta') ??
          url.searchParams.get('numeroCuenta') ??
          '';
        if (!numeroCuenta) {
          const pathSegment = url.pathname.split('/').filter(Boolean).pop();
          if (pathSegment && /\d{6,}/.test(pathSegment)) numeroCuenta = pathSegment;
        }
      } catch (e) {
        void e;
        numeroCuenta = text;
      }

      numeroCuenta = numeroCuenta.trim();
      if (!numeroCuenta) throw new Error('Código QR no válido o sin número de cuenta.');

      if (mode === 'friend') {
        const supabase = createClient();
        const { data, error: invokeError } = await supabase.functions.invoke('solicitar-amistad', {
          body: { numero_cuenta_amigo: numeroCuenta },
        });

        if (invokeError || data?.error) throw new Error(data?.error || invokeError.message);

        try { codeReaderRef.current?.reset?.(); } catch (e) { void e; }

        setStatus('success');
        setMessage(data.message || 'Solicitud de amistad enviada correctamente.');
        setTimeout(() => {
          onScanSuccess?.();
          onClose();
        }, 2000);
      } else {
        if (!onAccountDetected) throw new Error('No se configuró el manejo del número de cuenta.');
        await Promise.resolve(onAccountDetected(numeroCuenta));
        try { codeReaderRef.current?.reset?.(); } catch (e) { void e; }
        setStatus('success');
        setMessage(transferSuccessMessage || 'Número de cuenta detectado. Completa la transferencia.');
        setTimeout(() => {
          onScanSuccess?.();
          onClose();
        }, 1500);
      }
    } catch (err) {
      const error = err as Error;
      setStatus('error');
      setMessage(error.message || 'Ocurrió un error al procesar el código.');
      setTimeout(() => setStatus('scanning'), 3000);
    }
  }, [status, onScanSuccess, onClose, mode, onAccountDetected, transferSuccessMessage]);
  const handleManualSubmit = async () => {
    if (!manualCode.trim()) {
      setMessage('Por favor, ingrese un número de cuenta.');
      setStatus('error');
      setTimeout(() => setStatus('scanning'), 3000);
      return;
    }
    const cleanValue = manualCode.trim();
    if (mode === 'friend') {
      await handleScanResult(`${window.location.origin}/dashboard/amigos/add?account=${cleanValue}`);
    } else {
      await handleScanResult(cleanValue);
    }
  };

  // start the ZXing reader when dialog opens
  useEffect(() => {
    let mounted = true;
    const start = async () => {
      if (!scannerRef.current) return;
      try {
        const mod = await import('@zxing/browser');
        if (!mounted) return;
        let videoEl = videoRef.current;
        if (!videoEl) {
          videoEl = document.createElement('video');
          videoEl.setAttribute('playsInline', 'true');
          videoEl.className = 'w-full h-full object-cover';
          scannerRef.current.innerHTML = '';
          scannerRef.current.appendChild(videoEl);
          videoRef.current = videoEl;
        }

        const { BrowserQRCodeReader } = mod as typeof import('@zxing/browser');
        const reader = (new BrowserQRCodeReader() as unknown) as BrowserQRCodeReaderType;
        codeReaderRef.current = reader;
        await reader.decodeFromVideoDevice(undefined, videoEl, (result, error) => {
          if (result && mounted) {
            let text: string;
            if (typeof result.getText === 'function') {
              text = result.getText();
            } else {
              text = (result?.text ?? String(result ?? '')) as string;
            }
            void handleScanResult(String(text));
          }
          void error;
        });
        isRunningRef.current = true;
      } catch (e) {
        setStatus('error');
        setMessage((e as Error).message || 'No se pudo acceder a la cámara.');
      }
    };

    if (isOpen && status === 'scanning') start();

    return () => {
      mounted = false;
      try { codeReaderRef.current?.reset?.(); } catch (e) { void e; }
      codeReaderRef.current = null;
      isRunningRef.current = false;
    };
  }, [isOpen, status, handleScanResult]);

  // Reset state when dialog is closed/opened
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
    setStatus('scanning');
    setMessage('');
    setManualCode('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Escanear Código QR</DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Alinea el código QR dentro del área. Si la cámara no funciona, puedes ingresar el número de cuenta manualmente.
          </p>

          <div className="w-full h-80 bg-gray-900 rounded-lg overflow-hidden relative flex items-center justify-center">
            <div ref={scannerRef} className="w-full h-full" />
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-3/4 h-3/4 border-4 border-white/50 rounded-lg animate-pulse" />
            </div>

            {status === 'loading' && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-white" />
                <p className="text-white">Procesando...</p>
              </div>
            )}
            
            {status === 'success' && (
              <div className="absolute inset-0 bg-green-600 flex flex-col items-center justify-center gap-3 p-4 text-white">
                <CheckCircle className="h-12 w-12" />
                <h3 className="text-lg font-semibold">¡Éxito!</h3>
                <p className="text-sm text-center">{message}</p>
              </div>
            )}

            {status === 'error' && (
               <div className="absolute bottom-4 left-4 right-4">
                 <Alert variant="destructive">
                   <AlertCircle className="h-4 w-4" />
                   <AlertTitle>Error</AlertTitle>
                   <AlertDescription>{message}</AlertDescription>
                 </Alert>
               </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Número de cuenta (si no puedes escanear)"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              disabled={status === 'loading' || status === 'success'}
            />
            <Button onClick={handleManualSubmit} disabled={status === 'loading' || status === 'success'}>
              Enviar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}