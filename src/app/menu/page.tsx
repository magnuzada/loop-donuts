"use client";

import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { menuItems } from "@/data/menuData"; // Certifique-se que o caminho está certo

// Categorias para o filtro
const categories = ["Todos", "Tradicionais", "Especiais", "Veganos"];

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Filtra os itens com base na categoria
  const filteredItems = selectedCategory === "Todos"
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <main className="min-h-screen bg-cream">
      <NavBar />

      <div className="container mx-auto px-6 pt-48 md:pt-60 pb-20">
        <h1 className="font-display text-5xl md:text-6xl text-center mb-12 drop-shadow-[3px_3px_0px_rgba(255,255,255,1)]">
          NOSSO CARDÁPIO
        </h1>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-bold border-2 border-black transition-all ${
                selectedCategory === cat
                  ? "bg-cta shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 justify-items-center">
          {filteredItems.map((item) => (
            <div key={item.id} className="w-full max-w-[350px]">
              <ProductCard 
                id={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}