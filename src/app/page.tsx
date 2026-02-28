import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { ArrowRight, Star } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Image from "next/image"; // Importar o componente Image
import { ParallaxComet } from "@/components/ParallaxComet";
import { AboutSection } from "@/components/AboutSection";
import { LoopSlider } from "@/components/LoopSlider";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export default async function Home() {
  await connectToDatabase();
  
  // Busca TODOS os produtos ativos para a vitrine geral
  const dbDonuts = await Product.find({ status: "active", stock: { $gt: 0 } }).lean();

  const allDonuts = dbDonuts.map((d: any) => ({
    id: d._id.toString(), // Converte ObjectId em String
    name: d.name,
    description: d.description,
    price: d.price,
    category: d.category,
    image: d.image,
    stock: d.stock,
    status: d.status,
    // NÃO passamos o objeto d inteiro para evitar levar o __v ou métodos do Mongoose
  }));

  // Filtro para o carrossel de Favoritos (Especiais)
  const favoriteDonuts = allDonuts.filter(d => 
    d.category?.toLowerCase().includes('especial') || 
    d.category?.toLowerCase().includes('favorito')
  );

  return (
    <main className="min-h-screen bg-brand-light relative overflow-x-hidden -mt-32 md:-mt-36 lg:-mt-40">
      <NavBar />
      
      {/* --- HERO SECTION (Original e Intocada) --- */}
      <section className="relative h-screen w-full flex items-center justify-center z-20">
        <nav className="absolute top-28 left-0 right-0 z-30 hidden md:flex justify-center w-full pointer-events-none">
            <div className="flex justify-center pointer-events-auto">
             <Link 
               href="/menu" 
               className="bg-secondary hover:bg-secondary/90 text-black font-mono font-bold text-sm uppercase tracking-wide px-8 py-3 rounded-pill border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-none transition-all"
             >
               Ir para o Cardápio
             </Link>
           </div>
        </nav>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40" />
          <Image 
            src="/hero.png" 
            alt="Donut Gigante" 
            fill 
            priority 
            className="object-cover opacity-100" 
          /> 
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="font-display text-6xl md:text-8xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-4 transform -rotate-2">
            LOOP DONUTS
          </h1>
          <p className="font-body text-xl md:text-2xl text-white font-bold max-w-lg mx-auto mb-8 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            Donuts artesanais feitos com amor e muito recheio.
          </p>
          <Link href="/menu" className="group relative inline-flex items-center gap-3 bg-secondary hover:bg-yellow-400 text-black font-display text-2xl px-10 py-5 rounded-pill border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all">
            PEDIR AGORA
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black py-3 overflow-hidden whitespace-nowrap border-t-4 border-black z-30">
          <div className="text-secondary font-mono font-bold text-lg animate-marquee inline-block">
              ENTREGA NO BAIRRO • FRESQUINHO • FEITO HOJE • SEM GLÚTEN • LOOP DONUTS • ENTREGA NO BAIRRO • FRESQUINHO • FEITO HOJE • SEM GLÚTEN • LOOP DONUTS • ENTREGA NO BAIRRO • FRESQUINHO • FEITO HOJE • SEM GLÚTEN • LOOP DONUTS • ENTREGA NO BAIRRO • FRESQUINHO • FEITO HOJE • SEM GLÚTEN • LOOP DONUTS • 
          </div>
        </div>
      </section>

      {/* --- CARROSSEL 1: TODOS OS DONUTS (RECÉM SAÍDOS) --- */}
      <section className="py-20 bg-brand-light border-b-4 border-black/5">
        <div className="container mx-auto px-6 mb-12 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-brand drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase">
            Recém Saídos do Forno
          </h2>
        </div>

        <LoopSlider baseVelocity={-0.5}>
          {allDonuts.map((donut) => (
            <div key={donut.id} className="shrink-0 w-[300px] md:w-[350px] px-4">
              <ProductCard {...donut} />
            </div>
          ))}
        </LoopSlider>

        <div className="mt-12 flex justify-center">
          <Link href="/menu" className="group relative inline-flex items-center gap-3 bg-brand text-white font-display text-xl px-8 py-4 rounded-pill border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all">
            VER TODOS OS DONUTS
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <ParallaxComet />

      {/* --- CARROSSEL 2: FAVORITOS DA GALERA (PREMIUM) --- */}
      <section className="py-24 bg-black relative z-20 border-y-8 border-secondary shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="container mx-auto px-6 mb-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <Star className="text-secondary fill-secondary w-8 h-8" />
            <h2 className="font-display text-4xl md:text-6xl text-secondary uppercase tracking-tighter">
              Favoritos da Galera
            </h2>
            <Star className="text-secondary fill-secondary w-8 h-8" />
          </div>
          <p className="text-white/60 font-mono text-lg uppercase tracking-widest">A nata da nossa produção</p>
        </div>

        <LoopSlider baseVelocity={0.5}>
          {favoriteDonuts.length > 0 ? (
            favoriteDonuts.map((donut) => (
              <div key={`fav-${donut.id}`} className="shrink-0 w-[300px] md:w-[350px] px-4">
                <ProductCard {...donut} />
              </div>
            ))
          ) : (
            <div className="w-full text-center text-white/30 font-mono py-10 uppercase tracking-widest">
              Nenhum favorito marcado no estoque ainda...
            </div>
          )}
        </LoopSlider>

        <div className="mt-16 flex justify-center">
          <Link 
            href="/menu?categoria=especiais" 
            /* Corrigido a sombra: Removido o branco, agora usa shadow do próprio botão ou preto para manter o estilo Loop */
            className="group relative inline-flex items-center gap-3 bg-secondary hover:bg-yellow-400 text-black font-display text-2xl px-12 py-6 rounded-pill border-2 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 transition-all"
          >
            PROVAR FAVORITOS
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <AboutSection />
    </main>
  );
}