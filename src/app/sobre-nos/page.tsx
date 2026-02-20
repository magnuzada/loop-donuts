"use client";

import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { ArrowRight, Sparkles, Zap, Flame } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col font-body selection:bg-black selection:text-white">
      <NavBar />

      <div className="flex-grow pt-32 pb-20">
        
        {/* HERO SECTION (O Gancho) */}
        <section className="container mx-auto px-6 max-w-5xl mb-24 text-center">
          <div className="inline-block bg-yellow-400 border-2 border-black px-4 py-1 mb-6 transform -rotate-2">
            <span className="font-bold text-sm tracking-widest uppercase">Arquivos Confidenciais</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-black uppercase leading-[0.9] tracking-tighter mb-8 drop-shadow-[4px_4px_0px_rgba(200,200,200,1)]">
            COMEÇOU COMO UM MOTIM.
            <br />
            <span className="text-yellow-400 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">OU UM EXPERIMENTO.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 max-w-2xl mx-auto font-medium">
            Nossa história de origem tem cheiro de óleo quente, muito açúcar e pura glória.
          </p>
        </section>

        {/* STORY BOCKS (O Storytelling em 3 Atos) */}
        <section className="container mx-auto px-6 max-w-5xl mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Ato 1: A Origem */}
            <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 rounded-2xl hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
              <Flame className="w-10 h-10 text-yellow-500 mb-6" />
              <h3 className="font-display text-2xl font-black uppercase mb-4">A Semente da Rebeldia</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                Tudo começou numa cozinha apertada com a missão de salvar a cidade dos lanches sem graça. Plantamos a semente da rebeldia açucarada muito antes disso virar hype.
              </p>
            </div>

            {/* Ato 2: O Manifesto */}
            <div className="bg-yellow-400 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 rounded-2xl hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all transform md:-translate-y-6">
              <Zap className="w-10 h-10 text-black mb-6" />
              <h3 className="font-display text-2xl font-black uppercase mb-4">Radicais & Inovadores</h3>
              <p className="text-black font-medium leading-relaxed">
                Pode nos chamar de radicais, revolucionários... Ou apenas os inventores da sua nova obsessão. (Ok, não inventamos o donut. Mas definitivamente deixamos ele muito mais foda).
              </p>
            </div>

            {/* Ato 3: O Presente */}
            <div className="bg-black text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(255,204,0,1)] p-8 rounded-2xl hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(255,204,0,1)] transition-all">
              <Sparkles className="w-10 h-10 text-yellow-400 mb-6" />
              <h3 className="font-display text-2xl font-black uppercase mb-4 text-yellow-400">A Vida Boa</h3>
              <p className="text-gray-300 font-medium leading-relaxed">
                Hoje continuamos na mesma vibe: entregando a dose perfeita de endorfina em formato de argola. Sem frescura, zero arrependimentos, mordidas agressivas. Dias felizes.
              </p>
            </div>

          </div>
        </section>

        {/* PHOTO GALLERY (Sua Cozinha e Bastidores) */}
        <section className="container mx-auto px-6 max-w-6xl mb-24">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tighter">
              VISUAL DA COZINHA
            </h2>
            <p className="font-mono text-sm text-gray-500 md:max-w-xs md:text-right mt-4 md:mt-0">
              *Registros (quase) não confidenciais da nossa linha de produção.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Foto 1 - Vertical (Ex: Alguém sovando a massa) */}
            <div className="md:col-span-2 md:row-span-2 bg-gray-200 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl overflow-hidden group relative aspect-square md:aspect-auto">
              {/* Troque o link do src depois pela sua foto real */}
              <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop" alt="Bastidores Cozinha" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-yellow-400 text-black font-bold px-4 py-2 border-2 border-black transform -rotate-3 uppercase">Mão na Massa</span>
              </div>
            </div>

            {/* Foto 2 - Horizontal (Ex: Uma fornada pronta) */}
            <div className="md:col-span-2 bg-gray-200 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl overflow-hidden group relative aspect-[16/9]">
              <img src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=1000&auto=format&fit=crop" alt="Donuts Frescos" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
            </div>

            {/* Quadro de Texto */}
            <div className="md:col-span-1 bg-yellow-400 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl flex items-center justify-center p-8 text-center aspect-square">
               <h3 className="font-black text-2xl uppercase leading-tight">Feito<br/>para<br/>devorar.</h3>
            </div>

            {/* Foto 3 - Quadrada (Ex: Detalhe do recheio) */}
            <div className="md:col-span-1 bg-gray-200 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl overflow-hidden group relative aspect-square">
              <img src="https://images.unsplash.com/photo-1626094309830-abbb0c99da4a?q=80&w=1000&auto=format&fit=crop" alt="Detalhe do Donut" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
            </div>

          </div>
        </section>

        {/* CTA FINAL */}
        <section className="container mx-auto px-6 max-w-4xl text-center">
          <div className="bg-white border-4 border-black p-12 shadow-[12px_12px_0px_0px_rgba(255,204,0,1)] rounded-3xl">
            <h2 className="font-display text-4xl md:text-5xl font-black uppercase mb-6">
              Chega de ler.
              <br />
              Vá comer.
            </h2>
            <Link href="/menu">
              <button className="inline-flex items-center gap-2 bg-black text-white hover:bg-yellow-400 hover:text-black font-display text-xl px-10 py-5 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all">
                IR PARA O CARDÁPIO
                <ArrowRight className="w-6 h-6" />
              </button>
            </Link>
          </div>
        </section>

      </div>

      <Footer />
    </main>
  );
}