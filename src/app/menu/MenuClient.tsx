"use client";

import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { LayoutGrid, List, Search } from "lucide-react";

export default function MenuClient({ products }: { products: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Debug: Vamos ver no console do navegador se os produtos chegaram
  console.log("MenuClient recebeu:", products);

  // 1. Extrai categorias únicas (Proteção contra produtos sem categoria)
  const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category || "Outros")))];

  // 2. Filtra os itens
  const filteredItems = selectedCategory === "Todos"
    ? products
    : products.filter((item) => (item.category || "Outros") === selectedCategory);

  return (
    <main className="min-h-screen bg-cream">
      <NavBar />

      <div className="container mx-auto px-6 pt-32 md:pt-40 pb-20">
        
        {/* --- ÁREA DE DEBUG (Se aparecer 0 aqui, o banco não mandou nada) --- */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 text-xs font-mono">
          DEBUG: Recebidos {products.length} produtos. Mostrando {filteredItems.length} nesta categoria.
        </div>
        {/* ------------------------------------------------------------------ */}

        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-4xl font-black uppercase text-gray-900 italic tracking-tighter">
              Nosso Cardápio
            </h1>
            <p className="text-gray-500 mt-1">Escolha seus favoritos e monte sua caixa!</p>
          </div>

          {/* Botões de Visualização */}
          <div className="flex bg-white p-1 rounded-lg border border-gray-300 shadow-sm">
             <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid" ? "bg-brand text-white shadow-md" : "text-gray-400 hover:text-gray-600"
                }`}
                title="Grade"
             >
                <LayoutGrid size={20} />
             </button>
             <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list" ? "bg-brand text-white shadow-md" : "text-gray-400 hover:text-gray-600"
                }`}
                title="Lista"
             >
                <List size={20} />
             </button>
          </div>
        </div>

        {/* Filtros de Categoria */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full font-bold border-2 border-black transition-all uppercase text-xs tracking-wide ${
                selectedCategory === cat
                  ? "bg-black text-white -translate-y-1 shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)]"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de Produtos */}
        {filteredItems.length > 0 ? (
          <div 
            className={`
              ${viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
                : "flex flex-col gap-6 max-w-4xl mx-auto"
              }
            `}
          >
            {filteredItems.map((item) => (
              <div key={item._id || item.id} className="w-full">
                {/* --- A CORREÇÃO ESTÁ AQUI: Passando o ID --- */}
                <ProductCard 
                  id={item._id || item.id} 
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                />
                {/* ------------------------------------------- */}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 opacity-50">
             <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                <Search size={40} className="text-gray-400" />
             </div>
             <p className="text-xl font-bold text-gray-600">
               Ops! Nenhum donut encontrado em "{selectedCategory}".
             </p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}