"use client";
import { useState } from "react";

export default function CadastroProduto() {
  const [formData, setFormData] = useState({
    name: "",
    description: "", // Adicionei descrição pois é útil para o cardápio
    price: "",
    stock: "",
    image: "",
    category: "Clássicos", // Categoria padrão
    isFeatured: false, // 👈 O novo campo
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      }),
    });

    if (res.ok) {
      alert("Donut cadastrado! 🍩");
      // Limpa o form
      setFormData({ 
        name: "", description: "", price: "", stock: "", image: "", 
        category: "Clássicos", isFeatured: false 
      });
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Novo Donut 🍩</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Nome */}
        <input 
          className="w-full p-2 border rounded" 
          placeholder="Nome do Donut"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
        />

        {/* Descrição (opcional, mas bom ter) */}
         <input 
          className="w-full p-2 border rounded" 
          placeholder="Descrição curta (ex: Recheio de creme...)"
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
        />

        <div className="flex gap-4">
          {/* Preço */}
          <input 
            className="w-full p-2 border rounded" 
            placeholder="Preço (R$)"
            type="number" step="0.01"
            value={formData.price}
            onChange={e => setFormData({...formData, price: e.target.value})}
          />
          {/* Estoque */}
          <input 
            className="w-full p-2 border rounded" 
            placeholder="Qtd. Estoque"
            type="number"
            value={formData.stock}
            onChange={e => setFormData({...formData, stock: e.target.value})}
          />
        </div>

        {/* Categoria (Para os botões do Menu) */}
        <select 
          className="w-full p-2 border rounded bg-white"
          value={formData.category}
          onChange={e => setFormData({...formData, category: e.target.value})}
        >
          <option value="Clássicos">Clássicos</option>
          <option value="Gourmet">Gourmet</option>
          <option value="Recheados">Recheados</option>
          <option value="Bebidas">Bebidas</option>
        </select>

        {/* URL Imagem */}
        <input 
          className="w-full p-2 border rounded" 
          placeholder="URL da Imagem"
          value={formData.image}
          onChange={e => setFormData({...formData, image: e.target.value})}
        />

        {/* Checkbox de Favorito/Carrossel */}
        <div className="flex items-center gap-2 p-2 border rounded bg-yellow-50">
          <input 
            type="checkbox" 
            id="featured"
            checked={formData.isFeatured}
            onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
            className="w-5 h-5 accent-pink-500"
          />
          <label htmlFor="featured" className="text-gray-700 font-medium">
            Exibir no Carrossel (Favorito)? ⭐
          </label>
        </div>

        <button className="w-full bg-pink-600 hover:bg-pink-700 text-white p-3 rounded font-bold transition-colors">
          Salvar Produto
        </button>
      </form>
    </div>
  );
}