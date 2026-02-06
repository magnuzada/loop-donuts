import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 👈 Faltou importar isso aqui
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

// 👇 E faltou definir isso aqui
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Loop Donuts",
  description: "Os melhores donuts artesanais da cidade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className} suppressHydrationWarning={true}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}