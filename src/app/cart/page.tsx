"use client";

import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, removeFromCart } = useCart();

  // Calcula o total da compra
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <main className="min-h-screen bg-cream flex flex-col">
      <NavBar />

      {/* CORREÇÃO 1: Aumentei o padding-top (pt) 
        - Antes: pt-32 (128px) -> Ficava embaixo do logo
        - Agora: pt-48 (192px) no celular e pt-60 (240px) no PC
        Isso garante que o conteúdo comece bem abaixo do logo gigante.
      */}
      <div className="flex-grow pt-48 md:pt-60 pb-16 px-6 container mx-auto">
        
        {/* CORREÇÃO 2: Título com estilo "Home"
          - Aumentei o texto para text-5xl / text-6xl
          - Adicionei drop-shadow branca para dar o efeito "Pop Art" da marca
        */}
        <h1 className="font-display text-5xl md:text-6xl mb-12 flex items-center gap-4 text-black drop-shadow-[3px_3px_0px_rgba(255,255,255,1)]">
          <ShoppingBag className="w-12 h-12 md:w-16 md:h-16" />
          SEU CARRINHO
        </h1>

        {items.length === 0 ? (
          // --- ESTADO VAZIO ---
          <div className="text-center py-20 border-2 border-black border-dashed rounded-3xl bg-white/50">
            <p className="font-display text-2xl text-gray-400 mb-6">
              Sua caixa de donuts está vazia... 🍩💨
            </p>
            <Link 
              href="/menu" 
              className="inline-block bg-cta px-8 py-3 rounded-pill border-2 border-black font-display hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
            >
              VOLTAR AO MENU
            </Link>
          </div>
        ) : (
          // --- LISTA DE ITENS ---
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            
            {/* Coluna da Esquerda: Lista de Produtos */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border-2 border-black shadow-sm transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  
                  {/* Imagem do Produto */}
                  <div className="w-24 h-24 bg-cream rounded-xl overflow-hidden border border-black/10 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Detalhes */}
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="font-display text-xl">{item.name}</h3>
                    <p className="font-mono text-gray-500 text-sm">Unitário: R$ {item.price.toFixed(2).replace('.', ',')}</p>
                  </div>

                  {/* Quantidade e Subtotal */}
                  <div className="flex items-center gap-6 justify-center md:justify-start">
                    <div className="bg-cream px-4 py-2 rounded-lg border border-black font-mono font-bold">
                      {item.quantity}x
                    </div>
                    <p className="font-mono font-bold text-lg min-w-[80px]">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  {/* Botão Remover */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Remover item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                </div>
              ))}
            </div>

            {/* Coluna da Direita: Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-3xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-40">
                <h2 className="font-display text-2xl mb-6 pb-4 border-b-2 border-black/10">RESUMO</h2>
                
                <div className="space-y-3 mb-6 font-mono text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entrega</span>
                    <span className="text-green-600">Grátis</span>
                  </div>
                </div>

                <div className="flex justify-between font-display text-2xl mb-8 pt-4 border-t-2 border-black">
                  <span>TOTAL</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>

                <button className="w-full bg-black text-white font-display text-xl py-4 rounded-xl hover:bg-cta hover:text-black border-2 border-black transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  FINALIZAR COMPRA
                </button>
                
                <Link href="/menu" className="block text-center mt-4 font-mono text-sm underline hover:text-cta">
                  Continuar comprando
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}