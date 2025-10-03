import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, GraduationCap, Shield, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const steps = [
    {
      title: "Regístrate en minutos",
      description:
        "Completa el formulario con los datos de tu institución o tutor para crear la cuenta principal.",
    },
    {
      title: "Invita a tu comunidad",
      description:
        "Comparte el acceso con estudiantes y docentes para que abran sus perfiles y reciban sus tarjetas digitales.",
    },
    {
      title: "Comienza a operar",
      description:
        "Realiza transferencias, registra metas de ahorro y monitorea avances desde el panel interactivo.",
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-chiti_bank-blue/15 via-white to-chiti_bank-green/10" />
        <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-white via-white/70 to-transparent" />
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-24 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center rounded-full bg-white/80 px-4 py-1 text-sm font-semibold text-chiti_bank-blue shadow-sm ring-1 ring-chiti_bank-blue/20">
                Educación financiera para estudiantes
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl xl:text-6xl">
                Bienvenido a <span className="text-chiti_bank-blue">ChitiBank</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 md:text-xl">
                El banco escolar que transforma el aprendizaje financiero en experiencias reales. Acompaña a tu comunidad educativa a ahorrar, planear y tomar mejores decisiones con herramientas diseñadas para niños y jóvenes.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Button size="lg" variant="chiti_bank" asChild>
                  <Link href="/auth/register">Crear cuenta estudiantil</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/auth/login">Ingresar al banco</Link>
                </Button>
              </div>
              <div className="mt-4 flex justify-center lg:justify-start">
                <Button
                  size="lg"
                  variant="ghost"
                  className="px-4 text-base font-semibold text-chiti_bank-blue hover:bg-chiti_bank-blue/10"
                  asChild
                >
                  <Link href="/documentos">
                    Repositorio de Documentos
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Guía para docentes, familias y estudiantes con materiales imprimibles, políticas y dinámicas del programa.
              </p>
            </div>
            <Card className="border-0 bg-white/85 shadow-xl backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-gray-900">Tu camino al banco escolar</CardTitle>
                  <Image
                    src="/chitibank-logo.jpeg"
                    alt="ChitiBank Logo"
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full shadow-sm"
                  />
                </div>
                <CardDescription>
                  Sigue estos pasos para activar la experiencia financiera con tu grupo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="flex items-start gap-4 rounded-xl border border-chiti_bank-blue/10 bg-chiti_bank-blue/5 p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-semibold text-chiti_bank-blue shadow">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{step.title}</p>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2 rounded-lg bg-white/90 p-3 text-sm text-gray-600">
                  <CheckCircle2 className="h-5 w-5 text-chiti_bank-green" />
                  Soporte directo con el equipo ChitiBank durante la activación.
                </div>
              </CardContent>
            </Card>
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
                  Interfaz intuitiva para que estudiantes, tutores y docentes gestionen cuentas fácilmente.
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
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="chiti_bankGreen" asChild>
              <Link href="/auth/register">Crear cuenta gratuita</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-chiti_bank-blue hover:bg-white/90"
              asChild
            >
              <Link href="/auth/login">Ingresar con mi cuenta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-chiti_bank-blue text-white p-2 rounded-lg">
                <Image src="/chitibank-logo.jpeg" alt="ChitiBank Logo" width={32} height={32} className="h-8 w-auto" />
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
