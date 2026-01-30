import { ShoppingCart, Menu } from "lucide-react";
import Link from "next/link";

export function NavBar() {
  return (
    // 'pointer-events-none' faz com que a barra seja "fantasma" (cliques passam pelo meio dela)
    <nav className="fixed top-0 left-0 right-0 z-50 py-6 bg-transparent transition-all pointer-events-none">
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* Esquerda: Menu Mobile */}
        <button className="md:hidden p-2 hover:bg-black/5 rounded-full pointer-events-auto">
          <Menu className="w-6 h-6 text-black" />
        </button>

        {/* Centro/Esquerda: Logo */}
        <Link href="/" className="hover:scale-105 transition-transform pointer-events-auto">
          <img src="/logo.png" alt="Loop Donuts Logo" className="h-32 w-auto object-contain" />
        </Link>

        {/* --- AQUI NÃO TEM MAIS OS LINKS (Eles foram para a Hero Section) --- */}

        {/* Direita: Carrinho */}
        <button className="relative group pointer-events-auto">
          <div className="bg-cta p-3 rounded-full border-2 border-black group-hover:bg-cta-hover transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
            <ShoppingCart className="w-5 h-5 text-black" />
          </div>
          
          <span className="absolute -top-1 -right-1 bg-brand text-white text-xs font-mono font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-black">
            2
          </span>
        </button>
      </div>
    </nav>
  );
}