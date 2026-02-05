"use client";
import { useState } from "react";

export default function CadastroProduto() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
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
      alert("Produto cadastrado com sucesso! 🍩");
      setFormData({ name: "", price: "", stock: "", image: "" });
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Novo Donut 🍩</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          className="w-full p-2 border rounded" 
          placeholder="Nome do Donut"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
        />
        <input 
          className="w-full p-2 border rounded" 
          placeholder="Preço (Ex: 12.50)"
          type="number" step="0.01"
          value={formData.price}
          onChange={e => setFormData({...formData, price: e.target.value})}
        />
        <input 
          className="w-full p-2 border rounded" 
          placeholder="Estoque Inicial"
          type="number"
          value={formData.stock}
          onChange={e => setFormData({...formData, stock: e.target.value})}
        />
        <input 
          className="w-full p-2 border rounded" 
          placeholder="URL da Imagem"
          value={formData.image}
          onChange={e => setFormData({...formData, image: e.target.value})}
        />
        <button className="w-full bg-pink-500 text-white p-2 rounded font-bold">
          Salvar Produto
        </button>
      </form>
    </div>
  );
}