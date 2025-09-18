import Link from "next/link";

export default function ComedorPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Comedor</h2>
      <p className="text-gray-600 mb-6">
        Compra almuerzos y snacks con tu saldo escolar. Página en construcción —
        aquí aparecerán menús y precios.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          Ejemplo: Menú del día — S/ 3.50{" "}
          <div className="mt-2">
            <Link href="#" className="text-sm text-blue-600">
              Comprar
            </Link>
          </div>
        </div>
        <div className="p-4 border rounded">
          Ejemplo: Jugo natural — S/ 1.50{" "}
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
