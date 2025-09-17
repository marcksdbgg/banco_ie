// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSoles(amount: number | string | null | undefined): string {
  const numericValue = Number(amount);
  const valueToFormat = Number.isFinite(numericValue) ? numericValue : 0;
  
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(valueToFormat);
}