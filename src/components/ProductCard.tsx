import { Plus } from "lucide-react";

interface ProductCardProps {
  name: string;
  description: string;
  price: string;
  image: string;
}

export function ProductCard({ name, description, price, image }: ProductCardProps) {
  return (
    // O 'group' permite que a gente anime coisas dentro do card quando passa o mouse no card pai
    <div className="group relative min-w-[300px] md:min-w-[350px] bg-white rounded-card border-2 border-black p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer h-full snap-center">
      
      {/* Imagem com efeito de Zoom suave */}
      <div className="w-48 h-48 mb-6 relative">
        <div className="absolute inset-0 bg-brand/10 rounded-full blur-xl group-hover:bg-brand/20 transition-colors"></div>
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" 
        />
      </div>

      {/* Informações */}
      <h3 className="font-display text-2xl mb-2 text-black">{name}</h3>
      <p className="font-body text-gray-600 text-sm mb-6 line-clamp-2">{description}</p>

      {/* Footer do Card: Preço e Botão */}
      <div className="mt-auto w-full flex items-center justify-between">
        <span className="font-mono font-bold text-xl text-brand">{price}</span>
        
        <button className="bg-black text-white p-3 rounded-full hover:bg-cta hover:text-black transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}