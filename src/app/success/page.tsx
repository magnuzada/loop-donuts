"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, ShoppingBag, Home } from "lucide-react";
import { useEffect, useState, Suspense } from "react";

// Componente interno para ler os parâmetros (necessário para Suspense no Next.js)
function SuccessContent() {
  const searchParams = useSearchParams();
  // O Mercado Pago envia 'payment_id' ou 'collection_id'
  const paymentId = searchParams.get("payment_id") || searchParams.get("collection_id");
  const status = searchParams.get("status") || searchParams.get("collection_status");

  return (
    <div className="max-w-lg w-full bg-white rounded-card border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-center animate-pop relative z-10 mx-4">
      
      {/* Ícone Animado */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-green-100 rounded-full border-3 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce-slow">
          <CheckCircle className="w-12 h-12 text-green-600" strokeWidth={3} />
        </div>
      </div>

      <h1 className="font-display text-4xl md:text-5xl text-black mb-4 leading-tight">
        PEDIDO <span className="text-green-600">CONFIRMADO!</span>
      </h1>

      <p className="font-body text-lg text-gray-600 mb-8 leading-relaxed">
        Oba! O pagamento foi processado.
        <br />
        A cozinha já está aquecendo os fornos para preparar seus donuts.
      </p>

      {/* Detalhes do Pedido (Cardzinho interno) */}
      {paymentId && (
        <div className="bg-brand-light/30 border-2 border-dashed border-brand rounded-lg p-4 mb-8 font-mono text-sm text-gray-600">
          <p className="mb-1">Código do Pedido:</p>
          <span className="text-black font-bold text-lg tracking-wider">#{paymentId}</span>
          <div className="mt-2 text-xs uppercase bg-green-200 text-green-800 px-2 py-1 rounded-full inline-block font-bold border border-green-800">
            {status === 'approved' ? 'Pago' : status || 'Processando'}
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex flex-col gap-4">
        <Link
          href="/menu"
          className="group relative w-full inline-flex items-center justify-center gap-3 bg-secondary hover:bg-yellow-400 text-black font-display text-xl px-8 py-4 rounded-pill border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          VOLTAR AO CARDÁPIO
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/"
          className="group w-full inline-flex items-center justify-center gap-2 text-black font-mono font-bold text-sm uppercase tracking-wide hover:text-brand transition-colors py-2"
        >
          <Home className="w-4 h-4" />
          Voltar para a Home
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  // Efeito de Confete CSS (Injetado via style tag para performance)
  return (
    <main className="min-h-screen bg-brand-light flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Estilos da Animação (CSS-in-JS leve) */}
      <style jsx global>{`
        @keyframes pop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-pop {
          animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-bounce-slow {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Elementos Decorativos de Fundo (Donuts flutuantes abstratos) */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-brand rounded-full border-3 border-black opacity-20 animate-bounce-slow" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary rounded-full border-3 border-black opacity-20 animate-bounce-slow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-[-50px] w-40 h-40 bg-white rounded-full border-3 border-black opacity-30" />

      {/* Suspense é necessário ao usar useSearchParams no Next.js App Router */}
      <Suspense fallback={<div className="font-display text-2xl animate-pulse">Carregando confirmação...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
