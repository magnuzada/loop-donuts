"use client";

import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";

export default function MenuClient({ products }: { products: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Truque de Mestre: Em vez de fixar as categorias no código, 
  // o site lê quais categorias existem nos produtos cadastrados!
  // Se você criar um Donut "Bebidas" no admin, o botão aparece sozinho aqui.
  const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category)))];

  // Filtra os itens com base na categoria
  const filteredItems = selectedCategory === "Todos"
    ? products
    : products.filter((item) => item.category === selectedCategory);

  return (
    <main className="min-h-screen bg-cream">
      <NavBar />

      {/* 👇 AJUSTE DE LAYOUT AQUI:
         Mudei de pt-48 para pt-32 (celular) e pt-40 (PC).
         Isso sobe o conteúdo mas deixa espaço para o Logo não ficar em cima.
      */}
      <div className="container mx-auto px-6 pt-32 md:pt-40 pb-20">
        
        {/* REMOVIDO: <h1 ...> NOSSO CARDÁPIO </h1> 🗑️ */}

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-bold border-2 border-black transition-all uppercase text-sm tracking-wide ${
                selectedCategory === cat
                  ? "bg-cta shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1 text-black"
                  : "bg-white hover:bg-gray-100 text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de Produtos */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 justify-items-center">
            {filteredItems.map((item) => (
              <div key={item._id} className="w-full max-w-[350px]">
                <ProductCard 
                  // Passando os dados reais do banco
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                  // id={item._id} // Caso precise no futuro
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 opacity-50">
             <p className="text-xl font-bold">Nenhum produto nesta categoria... por enquanto! 🍩</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}