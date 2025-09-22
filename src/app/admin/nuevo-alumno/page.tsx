// src/app/admin/nuevo-alumno/page.tsx

'use client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function NuevoAlumnoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    montoInicial: '0',
    tipo: 'alumno', // 'tipo' aquí representa alumno|padre|personal
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El email es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'El formato del email no es válido';
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
    else if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    const monto = parseFloat(formData.montoInicial);
    if (isNaN(monto) || monto < 0) newErrors.montoInicial = 'El monto debe ser un número positivo.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors({});
      
    try {
      // CORRECCIÓN: Llamamos directamente a la Edge Function usando el SDK de Supabase.
      // El SDK se encargará de adjuntar el token de autorización del administrador logueado,
      // permitiendo a la Edge Function validar el rol y ejecutar la lógica privilegiada.
      const supabase = createClient();

      const { data, error: invokeError } = await supabase.functions.invoke('crear-usuario-cliente', {
        body: {
          nombre_completo: formData.nombre.trim(),
          email: formData.email.trim(),
          password: formData.password,
          saldo_inicial: parseFloat(formData.montoInicial),
          // Mapeo correcto de rol y tipo para la base de datos
          // Always set the system role to 'cliente' when creating client users from the admin panel.
          rol: 'cliente',
          // The 'tipo' column stores the kind of client: 'alumno', 'padre', or 'personal'.
          tipo: formData.tipo, 
        },
      });

      if (invokeError) {
        // Captura errores de red o de la llamada a la función
        throw invokeError;
      }
      
      if (data?.error) {
        // Captura errores lógicos devueltos en el cuerpo de la respuesta de la función
        throw new Error(data.error);
      }

      setShowSuccess(true);
      setTimeout(() => {
        router.push('/admin/lista-alumnos');
        router.refresh(); // Aseguramos que la lista de alumnos se actualice
      }, 2000);

    } catch (err) {
      const error = err as Error;
      setErrors({ general: `Error al crear el usuario: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="bg-green-500 text-white p-3 rounded-full w-fit mx-auto mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <CardTitle className="text-green-800">¡Usuario Registrado!</CardTitle>
            <CardDescription className="text-green-700">El usuario y su cuenta han sido creados exitosamente.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-green-700 mb-4">Redirigiendo a la lista de alumnos...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/admin" className="hover:text-chiti_bank-blue">Dashboard</Link>
        <span>/</span>
        <Link href="/admin/lista-alumnos" className="hover:text-chiti_bank-blue">Lista de Alumnos</Link>
        <span>/</span>
        <span className="font-medium text-chiti_bank-blue">Nuevo Usuario</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><UserPlus className="mr-2" /> Registrar Nuevo Usuario</CardTitle>
          <CardDescription>Completa los datos para crear una nueva cuenta.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} className={errors.nombre ? 'border-red-500' : ''} />
              {errors.nombre && <p className="text-sm text-red-600">{errors.nombre}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className={errors.email ? 'border-red-500' : ''} />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña Temporal</Label>
              <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} className={errors.password ? 'border-red-500' : ''} />
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="montoInicial">Monto inicial (S/.)</Label>
              <Input id="montoInicial" name="montoInicial" type="number" min="0" step="0.01" value={formData.montoInicial} onChange={handleInputChange} className={errors.montoInicial ? 'border-red-500' : ''} />
              {errors.montoInicial && <p className="text-sm text-red-600">{errors.montoInicial}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rol">Tipo de Perfil</Label>
              <select id="tipo" name="tipo" value={formData.tipo} onChange={handleInputChange} className="w-full border rounded p-2 bg-white text-sm">
                <option value="alumno">Alumno</option>
                <option value="padre">Padre de Familia</option>
                <option value="personal">Personal de la IE</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" asChild><Link href="/admin/lista-alumnos">Cancelar</Link></Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Registrando...' : 'Registrar Usuario'}
              </Button>
            </div>
          </form>

        </CardContent>
      </Card>

    </div>
  );
}