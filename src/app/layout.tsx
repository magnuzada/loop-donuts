import type { Metadata } from "next";
import { Dela_Gothic_One, Space_Grotesk, Roboto_Mono } from "next/font/google";
import "./globals.css";

const dela = Dela_Gothic_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dela",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const roboto = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Loop Donuts | Felicidade Redonda",
  description: "Peça os melhores donuts artesanais do bairro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${dela.variable} ${space.variable} ${roboto.variable} antialiased bg-cream text-black font-body`}
      >
        {children}
      </body>
    </html>
  );
}