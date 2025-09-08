'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { UserPlus, ArrowLeft, CheckCircle, AlertCircle, Mail, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function NuevoAlumnoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    montoInicial: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const supabase = createClient();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
        newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'El formato del email no es válido';
    }

    if (!formData.password) {
        newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    const monto = parseFloat(formData.montoInicial);
    if (!formData.montoInicial) {
      newErrors.montoInicial = 'El monto inicial es obligatorio';
    } else if (isNaN(monto)) {
      newErrors.montoInicial = 'Debe ser un número válido';
    } else if (monto < 0) {
      newErrors.montoInicial = 'El monto no puede ser negativo';
    } else if (monto > 100000) {
      newErrors.montoInicial = 'El monto no puede exceder S/ 100,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const { error } = await supabase.functions.invoke('crear-usuario-cliente', {
        body: {
          nombre_completo: formData.nombre.trim(),
          email: formData.email.trim(),
          password: formData.password,
          saldo_inicial: parseFloat(formData.montoInicial),
        },
      });

      if (error) {
        throw new Error(error.message);
      }
      
      setShowSuccess(true);
      
      setFormData({
        nombre: '',
        email: '',
        password: '',
        montoInicial: '',
      });

      setTimeout(() => {
        router.push('/admin/lista-alumnos');
      }, 2000);

    } catch (error) {
      console.error('Error adding student:', error);
      const err = error as Error;
      setErrors({ general: `Error al registrar el alumno: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nombre: '',
      email: '',
      password: '',
      montoInicial: '',
    });
    setErrors({});
    setShowSuccess(false);
  };

  if (showSuccess) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="bg-green-500 text-white p-3 rounded-full w-fit mx-auto mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <CardTitle className="text-green-800">¡Alumno Registrado!</CardTitle>
            <CardDescription className="text-green-700">
              El estudiante ha sido añadido exitosamente al sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-green-700 mb-4">
              Redirigiendo a la lista de alumnos...
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Registrar Otro
              </Button>
              <Button variant="chiti_bankGreen" asChild className="flex-1">
                <Link href="/admin/lista-alumnos">Ver Lista</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/admin" className="hover:text-chiti_bank-blue transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-chiti_bank-blue font-medium">Nuevo Alumno</span>
      </div>

      <Card className="border-2 shadow-lg">
        <CardHeader className="text-center">
          <div className="bg-chiti_bank-blue text-white p-3 rounded-lg w-fit mx-auto mb-4">
            <UserPlus className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl text-chiti_bank-blue">Registrar Nuevo Alumno</CardTitle>
          <CardDescription>
            Completa la información para crear una nueva cuenta estudiantil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error general */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            )}

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo del alumno</Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ej: María González Pérez"
                value={formData.nombre}
                onChange={handleInputChange}
                className={errors.nombre ? 'border-red-500' : ''}
              />
              {errors.nombre && (
                <p className="text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email del alumno</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ej: maria.gonzalez@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña Temporal</Label>
               <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Monto Inicial */}
            <div className="space-y-2">
              <Label htmlFor="montoInicial">Monto inicial (en soles peruanos)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">S/</span>
                <Input
                  id="montoInicial"
                  name="montoInicial"
                  type="number"
                  placeholder="0.00"
                  value={formData.montoInicial}
                  onChange={handleInputChange}
                  className={`pl-10 ${errors.montoInicial ? 'border-red-500' : ''}`}
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.montoInicial && (
                <p className="text-sm text-red-600">{errors.montoInicial}</p>
              )}
              <p className="text-xs text-gray-600">
                Cantidad de dinero en soles con la que el alumno inicia su cuenta
              </p>
            </div>

            {/* Botones */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex-1"
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
              <Button
                type="submit"
                variant="chiti_bank"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registrando...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Registrar Alumno
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Info Card */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 A tener en cuenta:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• El email debe ser único para cada alumno.</li>
              <li>• La contraseña es temporal. El alumno deberá cambiarla.</li>
              <li>• El saldo inicial puede ser cero.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-6 text-center">
        <Button variant="ghost" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
