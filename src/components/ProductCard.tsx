import Image from "next/image";
import { ShoppingCart, Star, Flame, Percent } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: any;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addToCart } = useCart();

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const isNew = product.isNewArrival;
  const isPromo = product.isPromo;

  // --- MODO LISTA (Horizontal) ---
  if (viewMode === "list") {
    return (
      <div className="group flex flex-col sm:flex-row w-full bg-paper rounded-card overflow-hidden border border-stone-200 hover:border-black transition-all hover:shadow-hard">
        
        {/* Imagem */}
        <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-canvas-alt">
           <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
           {/* Tags Mini */}
           <div className="absolute top-2 left-2 flex flex-col gap-1">
              {isNew && <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-pill uppercase">Novo</span>}
              {hasDiscount && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-pill uppercase">Promo</span>}
           </div>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col flex-grow p-4 justify-between">
          <div>
             <div className="flex justify-between items-start">
                <h3 className="font-black text-xl text-gray-800 uppercase leading-tight">{product.name}</h3>
                {product.subcategory && (
                  <span className="text-xs font-bold text-gray-400 border border-gray-200 px-2 py-1 rounded-pill">{product.subcategory}</span>
                )}
             </div>
             <p className="text-gray-500 text-sm mt-2 line-clamp-2">{product.description}</p>
          </div>

          <div className="flex items-end justify-between mt-4">
             <div className="flex flex-col">
                {hasDiscount && (
                  <span className="text-sm text-gray-400 line-through font-medium">
                    {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                )}
                <span className="text-2xl font-black text-brand-500">
                  {(hasDiscount ? product.discountPrice : product.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
             </div>

             <button 
                onClick={() => addToCart({ 
                  id: product._id, 
                  name: product.name, 
                  price: hasDiscount ? product.discountPrice : product.price, 
                  image: product.image 
                })}
                className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-btn font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-md"
             >
                <ShoppingCart size={18} />
                Adicionar
             </button>
          </div>
        </div>
      </div>
    );
  }

  // --- MODO GRADE (Vertical - Padrão) ---
  return (
    <div className="group relative bg-paper rounded-card overflow-hidden border-2 border-transparent hover:border-black transition-all hover:shadow-hard flex flex-col h-full">
      
      {/* Imagem Grande */}
      <div className="relative h-64 w-full bg-canvas-alt overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Etiquetas */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-pill shadow-sm flex items-center gap-1">
              <Star size={12} fill="white" /> NOVIDADE
            </div>
          )}
          {isPromo && (
            <div className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-pill shadow-sm flex items-center gap-1">
              <Flame size={12} fill="white" /> HOT
            </div>
          )}
          {hasDiscount && (
             <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-pill shadow-sm flex items-center gap-1">
              <Percent size={12} /> {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
            </div>
          )}
        </div>
      </div>

      {/* Corpo */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
           <h3 className="font-black text-xl text-gray-800 mb-2 uppercase tracking-tight">{product.name}</h3>
           <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{product.description}</p>
        </div>

        {/* Rodapé */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
           <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through font-bold">
                  {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              )}
              {/* Usa Brand 500 para destaque de preço */}
              <span className="text-2xl font-black text-brand-500">
                {(hasDiscount ? product.discountPrice : product.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
           </div>

           <button 
             onClick={() => addToCart({ 
                id: product._id, 
                name: product.name, 
                price: hasDiscount ? product.discountPrice : product.price, 
                image: product.image 
             })}
             className="w-12 h-12 bg-black hover:bg-brand-500 rounded-full flex items-center justify-center text-white transition-colors shadow-lg"
             title="Adicionar ao Carrinho"
           >
              <ShoppingCart size={20} />
           </button>
        </div>
      </div>
    </div>
  );
}