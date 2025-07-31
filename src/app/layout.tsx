import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BancoMunayProvider as ChitibankProvider } from "@/contexts/banco-munay-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chitibank - Banco Escolar",
  description: "Sistema educativo de gestión bancaria para estudiantes",
  keywords: "banco escolar, educación financiera, Chitibank",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ChitibankProvider>
          {children}
        </ChitibankProvider>
      </body>
    </html>
  );
}
