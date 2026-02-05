import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google"; // Suas fontes (mantenha as que estiverem aí)
import "./globals.css";
import { CartProvider } from "@/context/CartContext"; // 👈 IMPORTANTE

// ... (mantenha suas configurações de fonte e metadata)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="..."> {/* Mantenha suas classes do body */}
        {/* 👇 ENVOLVA TUDO AQUI */}
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}