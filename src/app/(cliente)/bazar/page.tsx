import Link from "next/link";

export default function BazarPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bazar Escolar</h2>
      <p className="text-gray-600 mb-6">
        Compra útiles y objetos del colegio con tu saldo. Página en construcción
        — aquí aparecerán productos y opciones de pago.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          Ejemplo: Cuaderno — S/ 2.00{" "}
          <div className="mt-2">
            <Link href="#" className="text-sm text-blue-600">
              Comprar
            </Link>
          </div>
        </div>
        <div className="p-4 border rounded">
          Ejemplo: Lápiz — S/ 0.50{" "}
          <div className="mt-2">
            <Link href="#" className="text-sm text-blue-600">
              Comprar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
