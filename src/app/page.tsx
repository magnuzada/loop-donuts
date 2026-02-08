import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard"; // Import sem chaves (default)
import { ParallaxComet } from "@/components/ParallaxComet";
import { AboutSection } from "@/components/AboutSection";
import { SocialSection } from "@/components/SocialSection";
import { Footer } from "@/components/Footer";
import { connectToDatabase } from "@/lib/mongodb"; // Import padronizado
import Product from "@/models/Product";

// Força a página a ser dinâmica para sempre pegar o estoque atualizado
export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Conecta ao Banco
  await connectToDatabase();

  // 2. Busca produtos ativos e com estoque
  const dbDonuts = await Product.find({
    status: "active", // Ajustado para o enum que definimos (active/draft)
    stock: { $gt: 0 },
    // isFeatured: true // Descomente se quiser filtrar só os destaques
  }).limit(8).lean();

  // 3. Serializa o ID (MongoDB object -> String)
  const donuts = dbDonuts.map((d: any) => ({
    ...d,
    id: d._id.toString(),
    _id: d._id.toString()
  }));

  // 4. Cria o efeito "Infinito" duplicando a lista se tiver poucos itens
  const infiniteDonuts = donuts.length > 0 
    ? [...donuts, ...donuts, ...donuts, ...donuts] // Duplica 4x para garantir o scroll
    : [];

  return (
    <main className="min-h-screen bg-brand-light relative overflow-x-hidden">
      <NavBar />
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen w-full flex items-center justify-center z-20">
        
        {/* MENU DE LINKS (Desktop - Flutuante) */}
        <nav className="absolute top-28 left-0 right-0 z-30 hidden md:flex justify-center w-full pointer-events-none">
           <div className="flex gap-4 items-center pointer-events-auto">
            <Link 
              href="/menu" 
              className="bg-secondary hover:bg-secondary/90 text-black font-mono font-bold text-sm uppercase tracking-wide px-6 py-3 rounded-pill border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Cardápio
            </Link>

            <Link 
              href="/menu" 
              className="bg-secondary hover:bg-secondary/90 text-black font-mono font-bold text-sm uppercase tracking-wide px-6 py-3 rounded-pill border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Monte sua Caixa
            </Link>
          </div>
        </nav>

        {/* Fundo com Imagem */}
        <div className="absolute inset-0 z-0">
          {/* Se não tiver a imagem hero.png, ele usa um gradiente laranja */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand to-brand-light opacity-90" />
          <img 
            src="/hero.png" 
            alt="Donut Gigante"
            className="w-full h-full object-cover mix-blend-overlay opacity-40"
          />
        </div>

        {/* Conteúdo Central */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          
          <h1 className="font-display text-6xl md:text-8xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-4 transform -rotate-2">
            LOOP DONUTS
          </h1>

          <p className="font-body text-xl md:text-2xl text-white font-bold max-w-lg mx-auto mb-8 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            Donuts artesanais feitos com amor e muito recheio.
          </p>

          <Link href="/menu" className="group relative inline-flex items-center gap-3 bg-secondary hover:bg-yellow-400 text-black font-display text-2xl px-10 py-5 rounded-pill border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
            PEDIR AGORA
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* --- BOTÕES MOBILE (Visíveis apenas em telas pequenas) --- */}
          <div className="flex md:hidden flex-col gap-3 mt-8 w-full max-w-[280px]">
             <Link 
              href="/menu" 
              className="w-full bg-white hover:bg-gray-100 text-black font-mono font-bold text-sm uppercase text-center py-3 rounded-full border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all"
            >
              Ver Cardápio
            </Link>
          </div>

        </div>

        {/* Faixa Marquee (Rodapé do Hero) */}
        <div className="absolute bottom-0 left-0 right-0 bg-black py-3 overflow-hidden whitespace-nowrap border-t-4 border-black z-30">
          <div className="text-secondary font-mono font-bold text-lg animate-marquee inline-block">
             ENTREGA NO BAIRRO • FRESQUINHO • FEITO HOJE • SEM GLÚTEN • LOOP DONUTS • 
             ENTREGA NO BAIRRO • FRESQUINHO • FEITO HOJE • SEM GLÚTEN • LOOP DONUTS • 
             ENTREGA NO BAIRRO • FRESQUINHO • FEITO HOJE • SEM GLÚTEN • LOOP DONUTS •
          </div>
        </div>
      </section>

      {/* --- CARROSSEL AUTOMÁTICO --- */}
      <section className="py-20 bg-brand-light overflow-hidden flex flex-col items-center relative z-20">
        <div className="container mx-auto px-6 mb-12 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-brand drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            RECÉM SAÍDOS DO FORNO
          </h2>
        </div>

        <div className="w-full overflow-hidden relative group">
          {infiniteDonuts.length > 0 ? (
            // Container do Scroll
            <div className="flex w-max gap-8 animate-scroll hover:pause">
              {infiniteDonuts.map((donut, index) => (
                <div key={`${donut.id}-${index}`} className="shrink-0 w-[300px] md:w-[350px]">
                  {/* Passando as props corretas individualmente */}
                  <ProductCard 
                    id={donut.id}
                    name={donut.name}
                    description={donut.description || "Sabor incrível!"}
                    price={donut.price}
                    image={donut.image}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 font-mono text-gray-500 bg-white/50 rounded-xl p-8 mx-4">
              <p className="text-xl">🍩 Estamos abastecendo a vitrine...</p>
            </div>
          )}
        </div>

        <div className="mt-12">
          <Link 
            href="/menu" 
            className="group relative inline-flex items-center gap-3 bg-brand hover:bg-orange-600 text-white font-display text-xl px-8 py-4 rounded-pill border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            VER TODOS OS DONUTS
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Componentes Decorativos e Rodapé */}
      <ParallaxComet />
      <AboutSection />
      <SocialSection />
      <Footer />

    </main>
  );
}