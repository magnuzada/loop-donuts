import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ParallaxComet } from "@/components/ParallaxComet";
import { AboutSection } from "@/components/AboutSection";
import { SocialSection } from "@/components/SocialSection";
import { Footer } from "@/components/Footer";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export default async function Home() {
  await dbConnect();

  const dbDonuts = await Product.find({
    isActive: true,
    stock: { $gt: 0 },
    isFeatured: true 
  }).lean();

  const donuts = dbDonuts.map((d: any) => ({
    ...d,
    id: d._id.toString(),
    _id: d._id.toString()
  }));

  const infiniteDonuts = donuts.length > 0 
    ? [...donuts, ...donuts, ...donuts, ...donuts]
    : [];

  return (
    <main className="min-h-screen bg-cream relative">
      <NavBar />
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center z-20">
        
        {/* MENU DE LINKS (Desktop - Mantido no topo - Invisível no Mobile) */}
        <nav className="absolute top-32 left-0 right-0 z-30 hidden md:flex justify-center w-full pointer-events-none">
           <div className="flex gap-4 items-center pointer-events-auto">
            <Link 
              href="/menu" 
              className="bg-cta hover:bg-cta-hover text-black font-mono font-bold text-sm uppercase tracking-wide px-6 py-3 rounded-pill border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Cardápio
            </Link>

            <a 
              href="#" 
              className="bg-cta hover:bg-cta-hover text-black font-mono font-bold text-sm uppercase tracking-wide px-6 py-3 rounded-pill border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Monte sua Caixa
            </a>

            <a 
              href="#" 
              className="bg-cta hover:bg-cta-hover text-black font-mono font-bold text-sm uppercase tracking-wide px-6 py-3 rounded-pill border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Sobre Nós
            </a>
          </div>
        </nav>

        {/* Fundo com Imagem */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero.png" 
            alt="Donut Gigante"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand/90 via-brand/40 to-transparent"></div>
        </div>

        {/* Conteúdo Central */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16 flex flex-col items-center">
          
          {/* Título removido */}

          <p className="font-body text-xl md:text-3xl text-white font-bold max-w-lg mx-auto mb-8 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            Donuts artesanais feitos com amor
          </p>

          <Link href="/menu" className="group relative inline-flex items-center gap-3 bg-cta hover:bg-cta-hover text-black font-display text-2xl px-10 py-5 rounded-pill border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
            PEDIR AGORA
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* --- BOTÕES MOBILE (Aparecem só no celular - Classes MD:HIDDEN forçam isso) --- */}
          {/* Removi as animações para garantir que apareçam */}
          <div className="flex md:hidden flex-col gap-3 mt-6 w-full max-w-[280px]">
             <Link 
              href="/menu" 
              className="w-full bg-white hover:bg-gray-100 text-black font-mono font-bold text-sm uppercase text-center py-3 rounded-full border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all"
            >
              Cardápio
            </Link>

            <a 
              href="#" 
              className="w-full bg-white hover:bg-gray-100 text-black font-mono font-bold text-sm uppercase text-center py-3 rounded-full border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all"
            >
              Monte sua Caixa
            </a>

            <a 
              href="#" 
              className="w-full bg-white hover:bg-gray-100 text-black font-mono font-bold text-sm uppercase text-center py-3 rounded-full border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all"
            >
              Sobre Nós
            </a>
          </div>

        </div>

        {/* Faixa Marquee */}
        <div className="absolute bottom-0 left-0 right-0 bg-black py-3 overflow-hidden whitespace-nowrap border-t-2 border-black">
          <p className="text-cta font-mono font-bold text-lg animate-marquee">
            ENTREGA NO BAIRRO • FRESQUINHO • FEITO HOJE • SEM GLÚTEN • LOOP DONUTS • 
            ENTREGA NO BAIRRO • FRESQUINHO • FEITO HOJE • SEM GLÚTEN • LOOP DONUTS •
          </p>
        </div>
      </section>

      {/* --- CARROSSEL AUTOMÁTICO --- */}
      <section className="py-20 bg-cream overflow-hidden flex flex-col items-center relative z-20">
        <div className="container mx-auto px-6 mb-12 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-black drop-shadow-[2px_2px_0px_rgba(254,97,0,1)]">
            RECÉM SAÍDOS DO FORNO
          </h2>
        </div>

        <div className="w-full overflow-hidden relative">
          {infiniteDonuts.length > 0 ? (
            <div className="flex gap-8 animate-infinite-scroll px-6 pb-12">
              {infiniteDonuts.map((donut, index) => (
                <div key={`${donut.id}-${index}`} className="shrink-0 w-[300px] md:w-[350px]">
                  <ProductCard 
                    name={donut.name}
                    description={donut.description || "Deliciosamente artesanal."}
                    price={donut.price}
                    image={donut.image}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 font-mono text-gray-500">
              <p>Nenhum destaque hoje... Estamos assando! 🍩🔥</p>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Link 
            href="/menu" 
            className="group relative inline-flex items-center gap-3 bg-cta hover:bg-cta-hover text-black font-display text-2xl px-8 py-5 rounded-pill border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            PEDIR AGORA
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <ParallaxComet />
      <AboutSection />
      <SocialSection />
      <Footer />

    </main>
  );
}