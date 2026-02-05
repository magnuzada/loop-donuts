"use client";

import { ShoppingCart } from "lucide-react"; // Mantive o Carrinho (Cart) em vez da Sacola (Bag)
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation"; 

export function NavBar() {
  const { cartCount } = useCart();
  const pathname = usePathname();

  // Função que decide o que fazer ao clicar no Logo
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Se já estiver na Home ("/"), apenas sobe suavemente
    if (pathname === "/") {
      e.preventDefault(); 
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    // Se NÃO estiver na home, o Link segue normal para o href="/"
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 pointer-events-none">
      <div className="container mx-auto flex justify-between items-center w-full">
        
        {/* --- LOGO INTELIGENTE (Tamanho Original Grande) --- */}
        <Link 
          href="/" 
          onClick={handleLogoClick}
          className="hover:scale-105 transition-transform pointer-events-auto"
        >
          <img 
            src="/logo.png" 
            alt="Loop Donuts Logo" 
            className="h-32 w-auto object-contain" // h-32 (128px) conforme seu código
          />
        </Link>

        {/* --- BOTÃO CARRINHO (Estilo "Padrão" Amarelo CTA) --- */}
        <Link 
          href="/cart"
          className="pointer-events-auto relative bg-cta p-3 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          {/* Ícone Carrinho */}
          <ShoppingCart className="w-6 h-6 text-black" />
          
          {/* Contador (Bolinha Preta piscando) */}
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
              {cartCount}
            </span>
          )}
        </Link>

      </div>
    </nav>
  );
}