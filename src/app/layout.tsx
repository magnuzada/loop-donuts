import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { NavBar } from "@/components/NavBar"; // 👈 Nome correto aqui
import { Footer } from "@/components/Footer"; // 👈 Aproveite e coloque o Footer aqui

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
          <NavBar /> {/* O Logo agora aparece em tudo, inclusive no Sobre Nós */}
          <main>
            {children}
          </main>
          <Footer /> {/* O Footer também fica fixo em todas as páginas */}
        </CartProvider>
      </body>
    </html>
  );
}