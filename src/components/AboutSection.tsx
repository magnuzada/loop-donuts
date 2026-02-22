"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Users, Star, Coffee, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Mão na Massa",
    desc: "Zero processos industriais. Cada Loop é sovadinho à mão, com calma e alma."
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Ingredientes Reais",
    desc: "Chocolate de verdade e frutas frescas. Sem conservantes, apenas sabor puro."
  },
  {
    icon: <Coffee className="w-6 h-6" />,
    title: "Momento Loop",
    desc: "Criado para ser o ponto alto do seu dia. Um presente em forma de donut."
  }
];

export function AboutSection() {
  return (
    <section className="py-24 bg-white overflow-hidden font-body">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* COLUNA DA IMAGEM */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full bg-secondary rounded-2xl border-2 border-black -z-10" />
            <div className="relative aspect-square w-full border-4 border-black rounded-2xl overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <Image
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2000"
                alt="Família unida na cozinha preparando donuts"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-brand text-white p-6 rounded-full border-4 border-black rotate-12 hidden md:block">
              <Heart className="w-8 h-8 fill-white" />
            </div>
          </div>

          {/* COLUNA DO TEXTO */}
          <div className="flex flex-col gap-8">
            <div className="inline-block self-start bg-secondary px-4 py-1 border-2 border-black font-mono font-bold uppercase text-sm transform -rotate-1">
              Nossa Essência
            </div>
            
            <h2 className="font-display text-5xl md:text-6xl text-black uppercase leading-none tracking-tighter">
              NÃO É SÓ <br />
              <span className="text-brand">FARINHA E AÇÚCAR.</span>
            </h2>

            <p className="text-xl text-gray-700 leading-relaxed italic border-l-4 border-brand pl-4">
              "A Loop Donuts nasceu para transformar momentos simples em memórias inesquecíveis. Cada donut carrega o carinho de uma receita de família."
            </p>

            {/* BOXES REATIVOS */}
            <div className="grid grid-cols-1 gap-4">
              {FEATURES.map((item, index) => (
                <div 
                  key={index}
                  className="group flex items-center gap-5 p-5 bg-brand-light border-2 border-black rounded-2xl transition-all duration-300 hover:bg-brand hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="p-3 bg-white border-2 border-black rounded-xl group-hover:bg-secondary transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-display text-lg uppercase group-hover:text-white transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* BOTÃO REINSTALADO */}
            <div className="mt-4">
              <Link 
                href="/sobre-nos"
                className="inline-flex items-center gap-2 bg-secondary border-2 border-black px-8 py-4 font-bold uppercase tracking-wider shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all group-button"
              >
                Conheça nossa História
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}