import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">Error de Autenticación</CardTitle>
          <CardDescription>
            El enlace de confirmación no es válido o ha expirado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Por favor, intenta registrarte de nuevo o contacta al soporte si el problema persiste.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-block rounded-md bg-munay-blue px-4 py-2 text-sm font-medium text-white hover:bg-munay-blue/90"
          >
            Volver a Iniciar Sesión
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
