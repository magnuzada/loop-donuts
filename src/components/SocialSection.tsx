"use client";

import { Instagram, Star, Quote } from "lucide-react";
import { LoopSlider } from "./LoopSlider";

const REVIEWS = [
  { name: "Julia M.", text: "O melhor donut de Nutella que já comi na vida! 🍩", stars: 5 },
  { name: "Ricardo T.", text: "Entrega super rápida e o donut chega quentinho.", stars: 5 },
  { name: "Ana Paula", text: "A massa é muito leve, não é enjoativo. Perfeito!", stars: 5 },
  { name: "Marcos V.", text: "O de Pistache é de outro mundo! Recomendo muito.", stars: 5 },
];

// DICA: Coloque suas fotos em public/instagram/foto1.jpg e mude os nomes aqui
const INSTAGRAM_PHOTOS = [
  "/insta-1.jpg", "/insta-2.jpg", "/insta-3.jpg", "/insta-4.jpg", "/insta-5.jpg"
];

export function SocialSection() {
  return (
    <section className="py-24 bg-brand-light overflow-hidden">
      
      {/* --- REVIEWS --- */}
      <div className="mb-20">
        <div className="container mx-auto px-6 mb-10 text-center">
          <h2 className="font-display text-4xl text-black uppercase tracking-tighter">
            Quem provou, amou!
          </h2>
        </div>

        <LoopSlider baseVelocity={-0.3}>
          {REVIEWS.map((review, i) => (
            <div key={i} className="shrink-0 w-[300px] bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-4 whitespace-normal">
              <div className="flex gap-1 mb-3">
                {[...Array(review.stars)].map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-brand/20 mb-2" />
              <p className="font-body font-bold text-gray-800 mb-4 break-words">
                {review.text}
              </p>
              <span className="font-mono text-sm text-brand font-bold">{review.name}</span>
            </div>
          ))}
        </LoopSlider>
      </div>

      {/* --- INSTAGRAM (Botão com Degradê) --- */}
      <div className="bg-black py-16">
        <div className="container mx-auto px-6 mb-10 text-center flex flex-col items-center">
          <a 
            href="https://www.instagram.com/loop.donuts.jf/" 
            target="_blank"
            /* GRADIENTE INSTAGRAM AQUI */
            className="inline-flex items-center gap-3 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white px-8 py-4 rounded-full border-2 border-white/20 shadow-lg hover:scale-105 transition-transform group"
          >
            <Instagram className="w-7 h-7 group-hover:rotate-12 transition-transform" />
            <span className="font-display text-xl uppercase tracking-widest">Siga o @loop.donuts.jf</span>
          </a>
        </div>

        <LoopSlider baseVelocity={0.4}>
          {INSTAGRAM_PHOTOS.map((photo, i) => (
            <div key={i} className="shrink-0 w-[250px] h-[250px] bg-gray-800 rounded-2xl border-2 border-white/10 overflow-hidden mx-2">
              <img src={photo} alt="Instagram" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
          ))}
        </LoopSlider>
      </div>
    </section>
  );
}