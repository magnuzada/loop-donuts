import type { Metadata } from "next";
import { Inter, Dela_Gothic_One, Space_Grotesk, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext"; // Importante

const inter = Inter({ subsets: ["latin"] });
const dela = Dela_Gothic_One({ weight: "400", subsets: ["latin"], variable: "--font-dela" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const roboto = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto" });

export const metadata: Metadata = {
  title: "Loop Donuts",
  description: "Os melhores donuts da galáxia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        suppressHydrationWarning={true}
        className={`${dela.variable} ${space.variable} ${roboto.variable} antialiased bg-cream text-black font-body`}
      >
        {/* O CartProvider precisa ser o "Pai" de todos */}
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}