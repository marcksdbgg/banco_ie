'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBancochiti_bank } from "@/contexts/banco-chiti_bank-context";
import { GraduationCap, Shield, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { auth } = useBancochiti_bank();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (auth.isLoggedIn && auth.isAdmin) {
      router.push('/admin');
    }
  }, [auth, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/chitibank-logo.jpeg" alt="ChitiBank Logo" className="h-12 w-auto" />
              <div>
                <h1 className="text-xl font-bold text-chiti_bank-blue">ChitiBank</h1>
                <p className="text-xs text-gray-600">Banco Escolar</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" asChild>
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
              <Button variant="chiti_bank" asChild>
                <Link href="/auth/register">Registrarse</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-chiti_bank-green text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <GraduationCap className="h-4 w-4" />
            <span>Educación Financiera</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Bienvenidos a{" "}
            <span className="text-chiti_bank-blue">ChitiBank</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            El primer banco escolar que enseña a los estudiantes sobre educación financiera 
            de manera práctica y divertida. Aprende a ahorrar, gestionar dinero y 
            desarrollar hábitos financieros saludables.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="chiti_bank" asChild>
              <Link href="/auth/register">Comenzar Ahora</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/documentos">Repositorio de Documentos</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Acceso Administrativo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir ChitiBank?
            </h2>
            <p className="text-xl text-gray-600">
              Una plataforma diseñada específicamente para la educación financiera estudiantil
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-chiti_bank-blue transition-colors">
              <CardHeader className="text-center">
                <div className="bg-chiti_bank-blue text-white p-3 rounded-lg w-fit mx-auto mb-4">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <CardTitle className="text-chiti_bank-blue">Educación Práctica</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Aprende conceptos financieros a través de experiencias reales de ahorro y gestión de dinero.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-chiti_bank-green transition-colors">
              <CardHeader className="text-center">
                <div className="bg-chiti_bank-green text-white p-3 rounded-lg w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <CardTitle className="text-chiti_bank-green">Seguro y Confiable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Plataforma segura diseñada específicamente para el entorno educativo escolar.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-chiti_bank-blue transition-colors">
              <CardHeader className="text-center">
                <div className="bg-chiti_bank-blue text-white p-3 rounded-lg w-fit mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="text-chiti_bank-blue">Gestión Sencilla</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Interface intuitiva que permite a profesores y estudiantes gestionar cuentas fácilmente.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-chiti_bank-blue text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para comenzar tu educación financiera?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Únete a miles de estudiantes que ya están aprendiendo sobre finanzas con ChitiBank
          </p>
          <Button size="lg" variant="chiti_bankGreen" asChild>
            <Link href="/auth/register">Crear Cuenta Gratuita</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-chiti_bank-blue text-white p-2 rounded-lg">
                <img src="/chitibank-logo.jpeg" alt="ChitiBank Logo" className="h-8 w-auto" />
              </div>
              <div>
                <h3 className="text-lg font-bold">ChitiBank</h3>
                <p className="text-sm text-gray-400">Educación financiera escolar</p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 ChitiBank. Proyecto educativo sin fines comerciales.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
