import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSoles(amount: number): string {
  // Accept number or numeric string; fallback to 0
  const value = typeof amount === 'number' ? amount : Number(amount);
  const safe = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(safe);
}