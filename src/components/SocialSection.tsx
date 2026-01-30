import { ArrowRight, Instagram, Quote, Star } from "lucide-react";

// --- DADOS FALSOS (MOCK) ---
const testimonials = [
  { id: 1, name: "Ana Clara", text: "Eu nunca comi nada igual. A massa desmancha na boca!", role: "Donut Lover" },
  { id: 2, name: "Pedro H.", text: "O de limão é surreal. Virei cliente fiel na primeira mordida.", role: "Viciado em Açúcar" },
  { id: 3, name: "Marina S.", text: "Chegou quentinho em casa. A embalagem é linda demais!", role: "Designer" },
  { id: 4, name: "Lucas F.", text: "Melhor que os das franquias famosas. Apoiem o local!", role: "Dev Frontend" },
];

const instaPosts = [
  "/insta-1.png", "/insta-2.png", "/insta-3.png", "/insta-4.png", "/insta-5.png"
];

export function SocialSection() {
  const infiniteTestimonials = [...testimonials, ...testimonials, ...testimonials];
  const infiniteInsta = [...instaPosts, ...instaPosts, ...instaPosts, ...instaPosts];

  return (
    <section className="py-24 bg-brand relative z-20 border-t-2 border-black overflow-hidden">
      
      {/* --- PARTE 1: DEPOIMENTOS --- */}
      <div className="mb-20">
        <div className="container mx-auto px-6 mb-10 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            QUEM PROVOU, AMOU
          </h2>
        </div>

        {/* Carrossel de Texto */}
        <div className="w-full overflow-hidden">
          <div className="flex gap-8 animate-infinite-scroll px-6 pb-4">
            {infiniteTestimonials.map((item, idx) => (
              <div key={idx} className="shrink-0 w-[350px] md:w-[450px]">
                <div className="bg-white p-8 rounded-card border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] h-full flex flex-col relative">
                  <Quote className="absolute top-4 right-4 text-brand/20 w-10 h-10" />
                  
                  <div className="flex gap-1 mb-4 text-cta">
                    {[1,2,3,4,5].map(star => <Star key={star} fill="currentColor" className="w-5 h-5" />)}
                  </div>

                  <p className="font-body text-lg text-gray-800 mb-6 flex-grow">"{item.text}"</p>

                  <div className="flex items-center gap-3 mt-auto border-t border-gray-100 pt-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full border border-black overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`} alt="Avatar" />
                    </div>
                    <div>
                      <p className="font-display text-sm text-black">{item.name}</p>
                      <p className="text-xs text-gray-500 uppercase font-bold">{item.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botão de Depoimentos (AGORA AMARELO) */}
        <div className="flex justify-center mt-8">
           {/* Mudei aqui: de 'bg-white' para 'bg-cta' e ajustei o hover */}
           <button className="group relative inline-flex items-center gap-3 bg-cta hover:bg-cta-hover text-black font-display text-xl px-8 py-4 rounded-pill border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
             DEIXAR MEU REVIEW
             <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>


      {/* --- PARTE 2: INSTAGRAM --- */}
      <div>
        <div className="container mx-auto px-6 mb-10 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-black">
            SIGA O LOOP NO INSTA
          </h2>
        </div>

        {/* Carrossel de Imagens (REVERSO) */}
        <div className="w-full overflow-hidden">
          <div className="flex gap-6 animate-infinite-scroll-reverse px-6 pb-4">
            {infiniteInsta.map((src, idx) => (
              <div key={idx} className="shrink-0 w-[200px] h-[200px] md:w-[250px] md:h-[250px]">
                <div className="group relative w-full h-full bg-white rounded-xl border-2 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:rotate-2 transition-transform cursor-pointer">
                  <div className="w-full h-full bg-cream flex items-center justify-center text-brand/30">
                    <Instagram className="w-12 h-12" />
                  </div>
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Instagram className="text-white w-10 h-10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botão do Instagram (MANTIDO O DEGRADÊ) */}
        <div className="flex justify-center mt-8">
           <button className="group relative inline-flex items-center gap-3 bg-gradient-to-tr from-yellow-400 via-orange-500 to-purple-600 text-white font-display text-xl px-8 py-4 rounded-pill border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
             <Instagram className="w-6 h-6" />
             @LOOPDONUTS
           </button>
        </div>
      </div>

    </section>
  );
}