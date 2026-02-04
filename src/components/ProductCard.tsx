"use client";

import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext"; 

interface ProductProps {
  name: string;
  description: string;
  price: string;
  image: string;
}

export function ProductCard({ name, description, price, image }: ProductProps) {
  const { addToCart } = useCart(); 

  const handleAdd = () => {
    // Tira o "R$" e vira número (Ex: "R$ 12,90" -> 12.90)
    const priceNumber = parseFloat(price.replace("R$", "").replace(",", ".").trim());
    
    // Cria ID único
    const id = name.length + priceNumber + Math.floor(Math.random() * 1000); 

    addToCart({
      id,
      name,
      price: priceNumber,
      image
    });

    console.log(`Adicionado: ${name}`); 
  };

  return (
    <div className="group bg-white rounded-3xl border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all h-full flex flex-col">
      <div className="relative h-48 mb-4 overflow-hidden rounded-2xl border border-black/10 bg-cream/20">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="flex flex-col flex-grow">
        <h3 className="font-display text-xl mb-1">{name}</h3>
        <p className="font-body text-sm text-gray-500 mb-4 flex-grow line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="font-mono font-bold text-lg">{price}</span>
          
          <button 
            onClick={handleAdd}
            className="bg-cta p-2 rounded-full border-2 border-black hover:bg-black hover:text-cta transition-colors active:scale-90"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}