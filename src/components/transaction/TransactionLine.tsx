import * as React from "react";
import { formatSoles } from "@/lib/utils";

type Transaction = {
  id: string;
  tipo: string;
  fecha: string;
  monto: number;
  descripcion?: string;
  cuenta_destino_id?: string;
};

export default function TransactionLine({
  t,
  cuentaId,
}: {
  t: Transaction;
  cuentaId: string;
}) {
  const incoming = t.cuenta_destino_id === cuentaId;

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0 transition-transform transform hover:translate-y-0.5 motion-reduce:transform-none">
      <div className="flex items-center gap-3">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center ${incoming ? "bg-green-100" : "bg-red-100"}`}
        >
          <span
            className={`text-sm font-semibold ${incoming ? "text-green-700" : "text-red-700"}`}
          >
            {t.tipo?.charAt(0)?.toUpperCase() ?? "?"}
          </span>
        </div>
        <div>
          <p className="font-medium capitalize">{t.tipo.replace("_", " ")}</p>
          <p className="text-xs text-gray-500">
            {new Date(t.fecha).toLocaleString("es-PE")}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-semibold ${incoming ? "text-green-600" : "text-red-600"}`}
        >
          {incoming ? "+" : "-"} {formatSoles(t.monto)}
        </p>
        <p className="text-xs text-gray-500">{t.descripcion || ""}</p>
      </div>
    </div>
  );
}
