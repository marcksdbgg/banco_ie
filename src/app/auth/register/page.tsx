'use client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      // Llamamos a la Edge Function pública que crea Auth + perfil + cuenta con saldo 0
      const res = await supabase.functions.invoke('crear-usuario-cliente', {
        body: { nombre_completo: formData.fullName, email: formData.email, password: formData.password, saldo_inicial: 0, rol: 'cliente', tipo: 'alumno' }
      });

      // The SDK returns a Response-like object; attempt to parse json safely
      let json: unknown;
      try {
        // Some runtimes return a raw object, others a Response-like object
  const maybe = res as unknown;
  const maybeJsonFn = typeof (maybe as { json?: unknown }).json === 'function' ? (maybe as { json: () => Promise<unknown> }).json : undefined;
  json = typeof maybeJsonFn === 'function' ? await maybeJsonFn.call(res) : res;
      } catch {
        json = res;
      }

      const isErrorLike = (obj: unknown): obj is { error?: unknown } => {
        return !!obj && typeof obj === 'object' && 'error' in (obj as Record<string, unknown>);
      };

      if (isErrorLike(json) && json.error) {
        setError(String(json.error) || 'Error al registrar usuario.');
      } else {
        setSuccess('¡Registro exitoso! Por favor, revisa tu correo electrónico para confirmar tu cuenta.');
        setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
      }
    } catch (err) {
      const unknownErr = err as unknown;
      const message = unknownErr instanceof Error ? unknownErr.message : String(unknownErr);
      setError(message || 'Error al registrar usuario.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 text-chiti_bank-blue hover:text-chiti_bank-blue/80 transition-colors">
            <div className="bg-chiti_bank-blue text-white p-2 rounded-lg">
              <Banknote className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ChitiBank</h1>
              <p className="text-sm text-gray-600">Banco Escolar</p>
            </div>
          </Link>
        </div>
        <Card className="border-2 shadow-lg">
            <CardHeader className="text-center">
            <CardTitle className="text-2xl text-chiti_bank-blue">Crear Cuenta de Estudiante</CardTitle>
            <CardDescription>
              Regístrate para obtener tu cuenta en ChitiBank.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Nombre del Estudiante"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="estudiante@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              {success && <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200 text-center">{success}</p>}
              <Button type="submit" className="w-full" variant="chiti_bank" disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link href="/auth/login" className="text-chiti_bank-blue hover:underline font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-chiti_bank-blue transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}