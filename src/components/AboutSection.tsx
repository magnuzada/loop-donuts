import { ArrowRight } from "lucide-react";
import Link from "next/link"; // <-- Importação adicionada aqui!

export function AboutSection() {
  return (
    <section className="py-24 bg-white border-t-2 border-black relative z-20">
      <div className="container mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* --- COLUNA DA ESQUERDA: FOTO + BOTÃO --- */}
          <div className="flex flex-col items-center md:items-start gap-8">
            
            {/* Container da Imagem (Polaroid Estilizada) */}
            <div className="relative w-full max-w-md aspect-square bg-brand-light rounded-card border-3 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              {/* Placeholder: Substitua 'about-image.png' pela sua foto real */}
              <img 
                src="/about-image.png" 
                alt="Nossa Cozinha" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Botão Abaixo da Imagem (Padrão do Site) */}
            <div className="w-full max-w-md flex justify-center md:justify-start">
              {/* <-- AQUI ESTÁ A MÁGICA: O button virou Link --> */}
              <Link href="/sobre-nos" className="group relative w-full md:w-auto inline-flex items-center justify-center gap-3 bg-cta hover:bg-cta-hover text-black font-display text-xl px-8 py-4 rounded-pill border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                CONHEÇA A COZINHA
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

          {/* --- COLUNA DA DIREITA: TEXTO --- */}
          <div className="text-center md:text-left">
            <h2 className="font-display text-4xl md:text-6xl text-black leading-tight mb-6 drop-shadow-[2px_2px_0px_rgba(254,97,0,1)]">
              NÃO É SÓ<br/>
              <span className="text-brand">FARINHA E AÇÚCAR.</span>
            </h2>

            <div className="space-y-6 font-body text-lg text-gray-700 leading-relaxed">
              <p>
                Tudo começou em uma pequena garagem e uma batedeira barulhenta. 
                Queríamos provar que donuts poderiam ser mais do que apenas "aquela rosquinha doce".
              </p>
              <p>
                Aqui na Loop, a massa descansa por <strong>24 horas</strong> (sim, ela dorme mais que a gente) 
                para garantir aquela textura de nuvem que você sente na primeira mordida.
              </p>
              <p>
                Sem pré-misturas, sem conservantes com nomes estranhos. Apenas ingredientes reais, 
                frutas frescas e chocolate de verdade.
              </p>
            </div>

            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-3 gap-4 mt-10 border-t-2 border-dashed border-gray-300 pt-8">
              <div>
                <span className="block font-display text-3xl text-black">24h</span>
                <span className="text-sm text-gray-500">Fermentação</span>
              </div>
              <div>
                <span className="block font-display text-3xl text-black">100%</span>
                <span className="text-sm text-gray-500">Artesanal</span>
              </div>
              <div>
                <span className="block font-display text-3xl text-black">∞</span>
                <span className="text-sm text-gray-500">Felicidade</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}