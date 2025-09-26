'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { createClient } from '@/lib/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

type MyQrCodeDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

type UserData = {
  nombre_completo: string;
  numero_cuenta: string;
};

export default function MyQrCodeDialog({ isOpen, onClose }: MyQrCodeDialogProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchUserData = async () => {
        setLoading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data } = await supabase
            .from('cuentas')
            .select(`
              numero_cuenta,
              perfiles ( nombre_completo )
            `)
            .eq('usuario_id', user.id)
            .single();
          
          if (data) {
            setUserData({
              numero_cuenta: data.numero_cuenta,
              nombre_completo: Array.isArray(data.perfiles)
                ? (data.perfiles[0] as { nombre_completo: string }).nombre_completo
                : (data.perfiles as { nombre_completo: string }).nombre_completo,
            });
          }
        }
        setLoading(false);
      };
      fetchUserData();
    }
  }, [isOpen]);

  // IMPORTANT: The value of the QR code should be a full URL to make it universally scannable.
  const qrCodeValue = userData ? `${window.location.origin}/dashboard/amigos/add?account=${userData.numero_cuenta}` : '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mi Código QR</DialogTitle>
          <DialogDescription>
            Pídele a tu amigo que escanee este código para añadirte.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4 gap-4">
          {loading ? (
            <Loader2 className="h-16 w-16 animate-spin" />
          ) : userData ? (
            <>
              <QRCodeSVG
                value={qrCodeValue}
                size={256}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
                includeMargin={true}
              />
              <div className="text-center">
                <p className="font-bold text-lg">{userData.nombre_completo}</p>
                <p className="text-sm text-gray-500 font-mono">{userData.numero_cuenta}</p>
              </div>
            </>
          ) : (
            <p>No se pudieron cargar los datos.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
