"use client";

import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { HeartHandshake, MessageCircle, Star, Send } from "lucide-react";
import { useState } from "react";

export default function ContatoPage() {
  const [reviewSent, setReviewSent] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui no futuro podemos conectar com o banco de dados
    setReviewSent(true);
    setTimeout(() => setReviewSent(false), 5000); // Reseta após 5 segundos
  };

  return (
    <main className="min-h-screen bg-cream flex flex-col font-body selection:bg-black selection:text-white">
      <NavBar />

      <div className="flex-grow pt-32 pb-24">
        
        {/* HERO SECTION */}
        <section className="container mx-auto px-6 max-w-5xl mb-16 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-black text-black uppercase leading-[0.9] tracking-tighter mb-6 drop-shadow-[3px_3px_0px_rgba(255,204,0,1)]">
            FALA COM A GENTE.
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto font-medium">
            Por trás dessa tela existem pessoas reais apaixonadas por fazer o seu dia mais doce. Como podemos te ajudar hoje?
          </p>
        </section>

        {/* COLUNAS DE CONTATO E REVIEW */}
        <section className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            
            {/* ------------------------------------------------- */}
            {/* COLUNA 1: SUPORTE PRIVADO (FALE CONOSCO)          */}
            {/* ------------------------------------------------- */}
            <div className="flex flex-col h-full">
              <div className="mb-4 inline-flex items-center gap-2 bg-black text-white px-4 py-1 self-start transform -rotate-1 border-2 border-black">
                <HeartHandshake size={18} />
                <span className="font-bold text-sm tracking-widest uppercase">Preciso de Ajuda</span>
              </div>
              
              <div className="flex-grow bg-white border-4 border-black p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl">
                <h2 className="font-display text-3xl font-black uppercase mb-4">Deu algum problema?</h2>
                <p className="text-gray-600 mb-8 font-medium text-lg leading-relaxed">
                  Seu pedido atrasou? Veio o donut errado? Ou você só tem uma dúvida antes de comprar? 
                  <br/><br/>
                  Fica tranquilo(a). Nosso suporte é humano, compreensivo e focado em resolver tudo para você não perder a sua paz (nem a sua fome).
                </p>

                <div className="space-y-4">
                  <a 
                    href="https://wa.me/5500000000000" // Coloque seu WhatsApp aqui
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-display text-xl px-8 py-5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    <MessageCircle size={24} />
                    CHAMAR NO WHATSAPP
                  </a>
                  <p className="text-center text-sm text-gray-500 font-medium">
                    Respondemos rápido. Prometemos.
                  </p>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------- */}
            {/* COLUNA 2: REVIEW PÚBLICO (AVALIAÇÃO)              */}
            {/* ------------------------------------------------- */}
            <div className="flex flex-col h-full">
              <div className="mb-4 inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-1 self-start transform rotate-1 border-2 border-black">
                <Star size={18} fill="currentColor" />
                <span className="font-bold text-sm tracking-widest uppercase">Deixar um Elogio</span>
              </div>
              
              <div className="flex-grow bg-yellow-400 border-4 border-black p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl">
                <h2 className="font-display text-3xl font-black uppercase mb-4">Gostou da experiência?</h2>
                <p className="text-gray-800 mb-8 font-medium text-lg leading-relaxed">
                  Acabou de devorar o seu pedido e amou? Conta pra gente! Seu carinho é o combustível da nossa cozinha e ajuda novos clientes a confiarem na Loop.
                </p>

                {reviewSent ? (
                  <div className="bg-white border-2 border-black p-8 rounded-xl text-center shadow-inner h-[300px] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                    <HeartHandshake className="w-16 h-16 text-red-500 mb-4" />
                    <h3 className="font-display text-2xl font-black uppercase mb-2">Recebemos seu carinho!</h3>
                    <p className="text-gray-600 font-medium">Muito obrigado por tirar um tempinho para nos avaliar. Você é incrível!</p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4 bg-white p-6 rounded-xl border-2 border-black h-[300px] flex flex-col">
                    <div>
                      <input 
                        type="text" 
                        required
                        placeholder="Seu Nome (ou Apelido)" 
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-black outline-none font-medium"
                      />
                    </div>
                    <div className="flex-grow">
                      <textarea 
                        required
                        placeholder="O que você achou dos nossos donuts?" 
                        className="w-full h-full p-3 border-2 border-gray-200 rounded-lg focus:border-black outline-none resize-none font-medium"
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-display text-lg px-6 py-3 rounded-lg transition-all"
                    >
                      <Send size={18} />
                      ENVIAR MEU REVIEW
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </section>

      </div>

      <Footer />
    </main>
  );
}