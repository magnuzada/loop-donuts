"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext"; // 👈 Importa o Hook

interface ProductCardProps {
  id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export function ProductCard({ id, name, description, price, image }: ProductCardProps) {
  const { addToCart } = useCart(); // 👈 Pega a função oficial

  const handleAdd = () => {
    // Usa a função do contexto (muito mais limpo!)
    addToCart({
      id: id || name, // Fallback se não tiver ID
      name,
      price,
      image,
    });
    
    // Feedback visual opcional (pode manter o alert ou tirar)
    // alert(`🍩 ${name} foi para o carrinho!`); 
  };

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all h-full flex flex-col">
      {/* ... (O resto do visual continua IGUAL, não mudei nada no CSS) ... */}
      
      {/* ... Imagem ... */}
      <div className="relative h-48 w-full bg-cream overflow-hidden border-b-2 border-black">
         <img src={image || "/placeholder.png"} alt={name} className="w-full h-full object-cover" />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-display text-xl leading-tight mb-2">{name}</h3>
        <p className="font-mono text-xs text-gray-500 mb-4 line-clamp-2 flex-grow">{description}</p>

        <div className="flex items-center justify-between mt-auto">
          <span className="font-display text-2xl text-cta-dark">
            R$ {price.toFixed(2).replace(".", ",")}
          </span>

          {/* Botão de Adicionar */}
          <button
            onClick={handleAdd}
            className="bg-black text-white p-3 rounded-full hover:bg-cta hover:text-black transition-colors border-2 border-transparent hover:border-black"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}