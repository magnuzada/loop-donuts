"use client";

import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { menuItems } from "@/data/menuData";
import { Filter } from "lucide-react";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("todos");

  // Categorias para o filtro
  const categories = [
    { id: "todos", label: "Tudo" },
    { id: "classicos", label: "Clássicos" },
    { id: "recheados", label: "Recheados" },
    { id: "gourmet", label: "Gourmet" },
    { id: "vegan", label: "Vegan 🌱" },
  ];

  // Filtra os itens com base na categoria
  const filteredItems = activeCategory === "todos" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  // Função para mudar categoria e rolar a tela suavemente
  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);
    
    const gridSection = document.getElementById("donuts-grid");
    if (gridSection) {
      // MUDAMOS AQUI: de 'center' para 'start'
      // Isso força o scroll a ir para o COMEÇO da lista, evitando pular para o rodapé
      gridSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="min-h-screen bg-cream">
      <NavBar />

      {/* Espaçamento superior para compensar a NavBar fixa 
        e posicionar os filtros logo de cara 
      */}
      <div className="pt-32 pb-8"></div>

      {/* --- ÁREA DE FILTROS (STICKY) --- */}
      {/* Fica grudado no topo ao rolar, logo abaixo da NavBar */}
      {/* --- ÁREA DE FILTROS (MUDANÇA: Agora é estático) --- */}
      {/* Removemos o 'sticky' para ele ficar parado no lugar dele na página */}
      <section className="py-8 px-4 bg-cream border-b-2 border-black/10">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`
                  font-display text-sm md:text-lg px-6 py-2 md:py-3 rounded-pill border-2 border-black transition-all duration-300
                  ${activeCategory === cat.id 
                    ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(254,97,0,1)] -translate-y-1" // Selecionado
                    : "bg-cta text-black hover:bg-cta-hover hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1" // Padrão Amarelo
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- GRID DE PRODUTOS --- */}
      {/* ID usado para o scroll automático */}
      <section id="donuts-grid" className="py-12 px-6 container mx-auto min-h-[60vh]">
        
        {/* Contador discreto */}
        <div className="flex justify-center items-center gap-2 mb-8 font-mono text-gray-500 opacity-60">
          <Filter className="w-4 h-4" />
          <span>{filteredItems.length} opções encontradas</span>
        </div>

        {/* Grid Responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 justify-items-center">
          {filteredItems.map((item) => (
            <div key={item.id} className="w-full max-w-[350px]">
              <ProductCard 
                id={item.id} // <--- ADICIONE ESTA LINHA
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            </div>
          ))}
        </div>

        {/* Estado Vazio (Caso não tenha itens) */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 animate-pulse">
            <p className="font-display text-2xl text-gray-400">
              Ops! Nossos padeiros ainda estão trabalhando nessa categoria. 🍩
            </p>
          </div>
        )}

      </section>

      <Footer />
    </main>
  );
}