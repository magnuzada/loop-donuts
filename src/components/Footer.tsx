import { ArrowRight, Facebook, Instagram, Twitter } from "lucide-react";

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
          
          {/* Coluna 1: Marca */}
          <div className="space-y-6">
            <h3 className="font-display text-3xl text-cta">LOOP DONUTS</h3>
            <p className="font-body text-gray-400">
              Feitos à mão, com ingredientes de verdade e uma pitada de loucura. O melhor Donut da sua vida.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-cta transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-cta transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-cta transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Coluna 2: Cardápio */}
          <div>
            <h4 className="font-display text-xl mb-6 text-brand">SABORES</h4>
            <ul className="space-y-3 font-body text-gray-300">
              <li><a href="#" className="hover:text-cta transition-colors">Clássicos</a></li>
              <li><a href="#" className="hover:text-cta transition-colors">Recheados</a></li>
              <li><a href="#" className="hover:text-cta transition-colors">Veganos</a></li>
              <li><a href="#" className="hover:text-cta transition-colors">Sazonais</a></li>
              <li><a href="#" className="hover:text-cta transition-colors">Cafés & Bebidas</a></li>
            </ul>
          </div>

          {/* Coluna 3: Institucional */}
          <div>
            <h4 className="font-display text-xl mb-6 text-brand">A LOOP</h4>
            <ul className="space-y-3 font-body text-gray-300">
              <li><a href="#" className="hover:text-cta transition-colors">Nossa História</a></li>
              <li><a href="#" className="hover:text-cta transition-colors">Lojas Físicas</a></li>
              <li><a href="#" className="hover:text-cta transition-colors">Trabalhe Conosco</a></li>
              <li><a href="#" className="hover:text-cta transition-colors">Imprensa</a></li>
              <li><a href="#" className="hover:text-cta transition-colors">Seja um Franqueado</a></li>
            </ul>
          </div>

          {/* Coluna 4: Ajuda */}
          <div>
            <h4 className="font-display text-xl mb-6 text-brand">AJUDA</h4>
            <ul className="space-y-3 font-body text-gray-300">
              <li><a href="#" className="hover:text-cta transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-cta transition-colors">Entregas</a></li>
              <li><a href="#" className="hover:text-cta transition-colors">Fale Conosco</a></li>
              <li><a href="#" className="hover:text-cta transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-cta transition-colors">Política de Privacidade</a></li>
            </ul>
          </div>

        </div>

        {/* Linha Final: Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-sm text-gray-500">
            © 2026 Loop Donuts Ltda. Todos os direitos reservados.
          </p>
          <p className="font-mono text-sm text-gray-600">
            Desenvolvido com amor e código.
          </p>
        </div>
      </div>
    </footer>
  );
}