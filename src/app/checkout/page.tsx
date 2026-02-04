"use client";

import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, MapPin, CreditCard, DollarSign, Bike } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, cartCount } = useCart();
  const router = useRouter(); // Para redirecionar depois
  
  // Total do Pedido
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Estado simples para simular o envio
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔥 FORMULÁRIO ENVIADO COM SUCESSO!"); // <--- O Console vai mostrar isso
    alert("🎉 PEDIDO RECEBIDO! \n\n(Isso é uma simulação. Na vida real, aqui enviaríamos os dados para o banco de dados).");
  };

  return (
    <main className="min-h-screen bg-cream flex flex-col">
      <NavBar />

      <div className="flex-grow pt-48 md:pt-60 pb-16 px-6 container mx-auto">
        
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart" className="p-2 bg-white rounded-full border-2 border-black hover:bg-black hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-display text-4xl md:text-5xl text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">
            FINALIZAR PEDIDO
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            
          {/* --- COLUNA ESQUERDA: FORMULÁRIO --- */}
          <div className="lg:col-span-2">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              
              {/* Seção 1: Dados Pessoais e Entrega */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="font-display text-2xl mb-6 flex items-center gap-3">
                  <MapPin className="text-cta" />
                  ONDE VAMOS ENTREGAR?
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block font-mono font-bold text-sm mb-2">Seu Nome Completo</label>
                    <input required type="text" placeholder="Ex: Homer Simpson" className="w-full bg-cream border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow" />
                  </div>
                  
                  <div className="md:col-span-1">
                    <label className="block font-mono font-bold text-sm mb-2">WhatsApp / Telefone</label>
                    <input required type="tel" placeholder="(00) 00000-0000" className="w-full bg-cream border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow" />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block font-mono font-bold text-sm mb-2">CEP</label>
                    <input required type="text" placeholder="00000-000" className="w-full bg-cream border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-mono font-bold text-sm mb-2">Endereço (Rua/Av)</label>
                    <input required type="text" placeholder="Av. Evergreen Terrace" className="w-full bg-cream border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow" />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block font-mono font-bold text-sm mb-2">Número</label>
                    <input required type="text" placeholder="742" className="w-full bg-cream border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow" />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block font-mono font-bold text-sm mb-2">Bairro</label>
                    <input required type="text" placeholder="Springfield" className="w-full bg-cream border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow" />
                  </div>
                </div>
              </div>

              {/* Seção 2: Pagamento */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="font-display text-2xl mb-6 flex items-center gap-3">
                  <DollarSign className="text-cta" />
                  PAGAMENTO NA ENTREGA
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Opção PIX */}
                  <label className="cursor-pointer">
                    <input type="radio" name="payment" className="peer sr-only" required />
                    <div className="h-full flex flex-col items-center justify-center p-4 rounded-xl border-2 border-black bg-cream peer-checked:bg-cta peer-checked:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white transition-all">
                      <span className="font-display text-lg">PIX</span>
                      <span className="text-xs text-center mt-1">Chave na entrega</span>
                    </div>
                  </label>

                  {/* Opção Cartão */}
                  <label className="cursor-pointer">
                    <input type="radio" name="payment" className="peer sr-only" />
                    <div className="h-full flex flex-col items-center justify-center p-4 rounded-xl border-2 border-black bg-cream peer-checked:bg-cta peer-checked:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white transition-all">
                      <CreditCard className="mb-2" />
                      <span className="font-display text-lg">CARTÃO</span>
                    </div>
                  </label>

                  {/* Opção Dinheiro */}
                  <label className="cursor-pointer">
                    <input type="radio" name="payment" className="peer sr-only" />
                    <div className="h-full flex flex-col items-center justify-center p-4 rounded-xl border-2 border-black bg-cream peer-checked:bg-cta peer-checked:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white transition-all">
                      <DollarSign className="mb-2" />
                      <span className="font-display text-lg">DINHEIRO</span>
                    </div>
                  </label>
                </div>
              </div>

              <button type="submit" className="w-full md:hidden bg-black text-white font-display text-xl py-4 rounded-xl hover:bg-cta hover:text-black border-2 border-black transition-all">
                CONFIRMAR PEDIDO
              </button>

            </form>
          </div>

          {/* --- COLUNA DIREITA: RESUMO FIXO --- */}
          <div className="lg:col-span-1">
            <div className="bg-cta p-6 rounded-3xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-40">
              <h2 className="font-display text-2xl mb-4 border-b-2 border-black pb-2">SUA CAIXA</h2>
              
              {/* Mini Lista de Itens */}
              <div className="max-h-60 overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-hide">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm font-mono border-b border-black/10 pb-2">
                    <span>{item.quantity}x {item.name}</span>
                    <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 font-mono font-bold text-lg border-t-2 border-black pt-4">
                <div className="flex justify-between">
                  <span>Entrega</span>
                  <span className="flex items-center gap-1"><Bike size={16}/> Grátis</span>
                </div>
                <div className="flex justify-between text-2xl mt-2">
                  <span>TOTAL</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              <button 
                onClick={(e) => {
                  // Hack para submeter o form à distância (simula o clique no botão do form)
                  const form = document.querySelector('form');
                  if (form) form.requestSubmit();
                }}
                className="hidden md:block w-full bg-black text-white font-display text-xl py-4 rounded-xl hover:bg-white hover:text-black border-2 border-black transition-all hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
              >
                CONFIRMAR PEDIDO
              </button>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}