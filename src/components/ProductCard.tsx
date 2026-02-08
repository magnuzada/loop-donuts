import Image from "next/image";

// Definimos exatamente o que o card espera receber
interface ProductCardProps {
  id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductCard({ name, description, price, image }: ProductCardProps) {
  
  const formatMoney = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="bg-white rounded-card shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="relative w-full h-48 bg-gray-50">
        <Image
          src={image || "/placeholder.png"} // Fallback caso não tenha imagem
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{name}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
          {description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-brand">
            {formatMoney(price)}
          </span>
          <button className="bg-brand text-white px-4 py-2 rounded-btn text-sm font-semibold hover:bg-orange-600 transition-colors">
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}