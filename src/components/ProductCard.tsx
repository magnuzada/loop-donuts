"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useState } from "react"; // Importamos estado para o feedback visual

interface ProductCardProps {
  id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductCard({ id, name, description, price, image }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false); // Estado para controlar o botão

  const handleAddToCart = () => {
    // 1. Monta o produto
    const product = {
      _id: id,
      name,
      description,
      price,
      image,
    };

    // 2. Adiciona ao Carrinho (Silenciosamente)
    addToCart(product);

    // 3. Feedback Visual (Muda o botão para verde)
    setIsAdded(true);

    // 4. Volta o botão ao normal depois de 2 segundos (Não sai da página!)
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all border border-gray-100 flex flex-col h-full group">
      {/* Imagem */}
      <div className="relative w-full h-48 bg-gray-50">
        <Image
          src={image || "/placeholder.png"}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{name}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
          {description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-brand text-orange-600">
            {formatMoney(price)}
          </span>
          
          <button 
            onClick={handleAddToCart}
            disabled={isAdded} // Evita clique duplo rápido
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2 ${
              isAdded 
                ? "bg-green-500 text-white cursor-default" // Estilo "Sucesso"
                : "bg-pink-600 text-white hover:bg-pink-700" // Estilo "Normal"
            }`}
          >
            {isAdded ? (
              <>
                <span>Adicionado!</span>
                <span>🍩</span>
              </>
            ) : (
              "Adicionar +"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}