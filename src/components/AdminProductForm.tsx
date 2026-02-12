"use client";

import { useState } from "react";

export function AdminProductForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    sku: "",
    status: "active",
    stock: 0,
    minStock: 5,
    price: "",
    discountPrice: "",
    discountStart: "",
    discountEnd: "",
    category: "",
    subcategory: "",
    subSubCategory: "",
    tags: "", // Recebe texto separado por vírgula e converte depois
    isFeatured: false,
    isPromo: false,
    isNewArrival: false, // ✅ CORRIGIDO AQUI (Era isNew)
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    // Tratamento de dados antes de enviar
    const payload = {
      ...formData,
      price: parseFloat(formData.price.toString()),
      stock: parseInt(formData.stock.toString()),
      minStock: parseInt(formData.minStock.toString()),
      // Converte tags (string "a, b, c") em Array ["a", "b", "c"]
      tags: formData.tags.split(",").map((t) => t.trim()).filter((t) => t !== ""),
      // Só envia campos de desconto se tiver valor
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice.toString()) : null,
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Produto salvo com sucesso! 💾");
        window.location.reload(); // Limpa e atualiza
      } else {
        const error = await res.json();
        alert(`Erro: ${error.message}`);
      }
    } catch (err) {
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* BLOCO 1: Identificação */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">📦 Informações Básicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
            <input name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded-md" placeholder="Ex: Donut Homer Simpson" />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Descrição Detalhada</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-2 border rounded-md" placeholder="Ingredientes, sabor, detalhes..." />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">SKU (Código Interno)</label>
            <input name="sku" value={formData.sku} onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="Ex: DON-001" />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded-md bg-white">
              <option value="active">🟢 Ativo (Visível)</option>
              <option value="draft">🟡 Rascunho (Escondido)</option>
              <option value="inactive">🔴 Inativo (Arquivado)</option>
            </select>
          </div>
        </div>
      </div>

      {/* BLOCO 2: Mídia */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">📸 Imagem</h3>
        <label className="block text-sm font-medium text-gray-700">URL da Imagem (Capa)</label>
        <input name="image" value={formData.image} onChange={handleChange} required className="w-full p-2 border rounded-md" placeholder="https://..." />
        {formData.image && (
          <div className="mt-4">
            <span className="block text-xs text-gray-500 mb-1">Prévia:</span>
            <img 
              src={formData.image} 
              alt="Preview" 
              className="h-32 w-32 object-cover rounded-md border border-gray-300 shadow-sm" 
              onError={(e) => (e.currentTarget.style.display = 'none')} // Esconde se o link for inválido
            />
          </div>
        )}
      </div>

      {/* BLOCO 3: Preços & Promoção */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">💰 Preço e Ofertas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Preço Base (R$)</label>
            <input name="price" value={formData.price} type="number" step="0.01" onChange={handleChange} required className="w-full p-2 border rounded-md" placeholder="0.00" />
          </div>
          
          <div className="md:col-span-2 bg-yellow-50 p-4 rounded-md border border-yellow-200">
             <h4 className="text-sm font-bold text-yellow-800 mb-2">🏷️ Área de Promoção (Opcional)</h4>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input name="discountPrice" value={formData.discountPrice} type="number" step="0.01" onChange={handleChange} className="w-full p-2 border rounded-md text-sm" placeholder="Preço Promo" />
                <input name="discountStart" value={formData.discountStart} type="date" onChange={handleChange} className="w-full p-2 border rounded-md text-sm" />
                <input name="discountEnd" value={formData.discountEnd} type="date" onChange={handleChange} className="w-full p-2 border rounded-md text-sm" />
             </div>
          </div>
        </div>
      </div>

      {/* BLOCO 4: Categorização Hierárquica */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">🗂️ Categorização (3 Níveis)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">1. Categoria</label>
            <input name="category" value={formData.category} onChange={handleChange} required className="w-full p-2 border rounded-md" placeholder="Ex: Bebidas" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">2. Subcategoria</label>
            <input name="subcategory" value={formData.subcategory} onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="Ex: Café" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">3. Sub-subcategoria</label>
            <input name="subSubCategory" value={formData.subSubCategory} onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="Ex: Expresso" />
          </div>
          <div className="md:col-span-3">
             <label className="block text-sm font-medium text-gray-700">Tags Flexíveis (Separe por vírgula)</label>
             <input name="tags" value={formData.tags} onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="Ex: Sem açúcar, Vegano, Gelado" />
          </div>
        </div>
      </div>

      {/* BLOCO 5: Estoque */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">📦 Estoque</h3>
        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-sm font-medium text-gray-700">Qtd Atual</label>
            <input name="stock" value={formData.stock} type="number" onChange={handleChange} required className="w-full p-2 border rounded-md" />
           </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Qtd Mínima (Alerta)</label>
            <input name="minStock" value={formData.minStock} type="number" onChange={handleChange} className="w-full p-2 border rounded-md" />
           </div>
        </div>
      </div>

      {/* BLOCO 6: Destaques (Flags) */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">⭐ Visibilidade</h3>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input name="isFeatured" checked={formData.isFeatured} type="checkbox" onChange={handleChange} className="w-5 h-5 accent-brand-500" />
            <span className="text-gray-700 font-medium">Exibir no Carrossel Principal?</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input name="isPromo" checked={formData.isPromo} type="checkbox" onChange={handleChange} className="w-5 h-5 accent-brand-500" />
            <span className="text-gray-700 font-medium">Exibir na Seção de Promoções?</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            {/* ✅ CORRIGIDO AQUI TAMBÉM (name="isNewArrival") */}
            <input name="isNewArrival" checked={formData.isNewArrival} type="checkbox" onChange={handleChange} className="w-5 h-5 accent-brand-500" />
            <span className="text-gray-700 font-medium">Marcar com etiqueta "NOVIDADE"?</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-xl shadow-lg transition-transform active:scale-95"
      >
        {loading ? "Salvando..." : "💾 Salvar Produto Completo"}
      </button>

    </form>
  );
}
