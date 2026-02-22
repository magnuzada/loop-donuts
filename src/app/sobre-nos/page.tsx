"use client";

import Image from "next/image";
import { Clock, ShieldCheck, Sparkles, Heart } from "lucide-react";

const PILARES = [
  {
    icon: <Clock className="w-8 h-8" />,
    title: "O Segredo está no Tempo",
    desc: "Nossa massa descansa o tempo necessário para atingir a leveza ideal. A paciência é o que garante a textura que você só encontra aqui."
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Seleção Rigorosa",
    desc: "Escolhemos cada ingrediente pela sua pureza e frescor. Se não agrega um sabor extraordinário, não entra no nosso processo."
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Feito para Compartilhar",
    desc: "Criamos donuts que iniciam conversas e aproximam pessoas. Um detalhe artesanal pensado para transformar qualquer café em uma celebração."
  }
];

export default function SobreNosPage() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-6">
        
        {/* CABEÇALHO DA PÁGINA */}
        <div className="max-w-4xl mb-20">
          <div className="inline-block bg-secondary px-4 py-1 border-2 border-black font-mono font-bold uppercase text-sm mb-6 transform -rotate-1">
            Nossa História
          </div>
          <h1 className="font-display text-6xl md:text-8xl text-black uppercase leading-none tracking-tighter mb-8">
            DE NOSSA COZINHA, <br />
            <span className="text-brand text-5xl md:text-7xl">PARA O SEU MOMENTO.</span>
          </h1>
          <p className="font-body text-2xl text-gray-700 leading-relaxed max-w-3xl border-l-4 border-brand pl-6 italic">
            "Na Loop, não acreditamos em produção em massa. Acreditamos em mãos que moldam, olhos que cuidam e corações que celebram a cada fornada."
          </p>
        </div>

        {/* SEÇÃO DA IMAGEM E TEXTO DE APOIO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full bg-brand rounded-2xl border-2 border-black -z-10" />
            <div className="relative aspect-video w-full border-4 border-black rounded-2xl overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <Image
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2000"
                alt="Nossa família preparando donuts"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-xl text-gray-800 leading-relaxed">
              Nossa jornada começou em uma cozinha de família e hoje continua em cada detalhe que chega até você. 
              O que começou como um hobby de domingo transformou-se na nossa paixão diária: 
              redescobrir a confeitaria artesanal.
            </p>
            <p className="text-xl text-gray-800 leading-relaxed">
              Cada donut é um ciclo de carinho — do momento em que selecionamos a farinha até o 
              instante em que você abre a nossa caixa.
            </p>
          </div>
        </div>

        {/* GRID DOS PILARES (BOXES REATIVOS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILARES.map((pilar, index) => (
            <div 
              key={index}
              className="group p-8 bg-brand-light border-2 border-black rounded-2xl transition-all duration-300 hover:bg-brand hover:-translate-y-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="w-16 h-16 bg-white border-2 border-black rounded-xl flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors group-hover:rotate-6">
                {pilar.icon}
              </div>
              <h3 className="font-display text-2xl uppercase mb-4 group-hover:text-white transition-colors">
                {pilar.title}
              </h3>
              <p className="text-gray-700 group-hover:text-white/90 transition-colors leading-relaxed">
                {pilar.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}