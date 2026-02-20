import { ArrowRight, Instagram, Facebook, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-20 border-t-2 border-black">
      
      {/* --- SEÇÃO DE NEWSLETTER (Amarelo Vibrante) --- */}
      <div className="bg-cta py-16 px-6 border-b-2 border-black">
        <div className="container mx-auto max-w-4xl text-center">
          
          <h2 className="font-display text-4xl md:text-5xl text-black mb-4 drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">
            FIQUE NO LOOP!
          </h2>
          <p className="font-body text-xl text-black mb-8 max-w-lg mx-auto">
            Receba promoções secretas, sabores novos e cupom de aniversário direto no seu e-mail.
          </p>

          {/* Formulário de Cadastro */}
          <form className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <input 
              type="email" 
              placeholder="seu@email.com" 
              className="w-full md:w-96 px-6 py-4 rounded-pill border-2 border-black bg-white placeholder:text-gray-500 font-body text-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
            />
            <button className="group relative inline-flex items-center gap-2 bg-black text-white hover:bg-white hover:text-black font-display text-xl px-8 py-4 rounded-pill border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all w-full md:w-auto justify-center">
              CADASTRAR
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
          
          <p className="text-xs font-mono mt-4 text-black/60">
            *Prometemos zero spam. Só donuts e alegria.
          </p>
        </div>
      </div>

      {/* --- MAPA DO SITE (Fundo Preto) --- */}
      <div className="bg-black text-white pt-16 pb-8 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Coluna 1: Marca (Logo + Social) */}
          <div className="flex flex-col items-start gap-6">
            <Link href="/">
              <img 
                src="/logo.png" 
                alt="Loop Donuts Logo" 
                className="w-40 md:w-48 h-auto object-contain cursor-pointer"
              />
            </Link>
            {/* Redes Sociais */}
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/loop.donuts.jf/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-cta transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              {/* Deixei Facebook e Twitter comentados para o futuro
              <a href="#" className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-cta transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-cta transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              */}
            </div>
          </div>

          {/* Coluna 2: Cardápio */}
          <div>
            <h4 className="font-display text-xl mb-6 text-brand">SABORES</h4>
            <ul className="space-y-3 font-body text-gray-300">
              <li><Link href="/menu" className="hover:text-cta transition-colors">Clássicos</Link></li>
              <li><Link href="/menu" className="hover:text-cta transition-colors">Recheados</Link></li>
              <li><Link href="/menu" className="hover:text-cta transition-colors">Veganos</Link></li>
              <li><Link href="/menu" className="hover:text-cta transition-colors">Sazonais</Link></li>
              <li><Link href="/menu" className="hover:text-cta transition-colors">Cafés & Bebidas</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Institucional */}
          <div>
            <h4 className="font-display text-xl mb-6 text-brand">A LOOP</h4>
            <ul className="space-y-3 font-body text-gray-300">
              <li><Link href="/menu" className="hover:text-cta transition-colors">Cardápio</Link></li>
              <li><Link href="/sobre-nos" className="hover:text-cta transition-colors">Nossa História</Link></li>
              <li><Link href="/contato" className="hover:text-cta transition-colors">Fale Conosco</Link></li>
            </ul>
          </div>

          {/* Coluna 4: Suporte/Ajuda */}
          <div>
            <h4 className="font-display text-xl mb-6 text-brand">SUPORTE</h4>
            <ul className="space-y-3 font-body text-gray-300">
              <li><Link href="/ajuda" className="hover:text-cta transition-colors">Central de Ajuda</Link></li>
              <li><Link href="/termos" className="hover:text-cta transition-colors">Termos de Uso</Link></li>
              <li><Link href="/privacidade" className="hover:text-cta transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>

        </div>

        {/* Linha Final: Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-sm text-gray-500">
            © {new Date().getFullYear()} Loop Donuts Ltda. Todos os direitos reservados.
          </p>
          <p className="font-mono text-sm text-gray-600">
            Desenvolvido com amor e código.
          </p>
        </div>
      </div>
    </footer>
  );
}