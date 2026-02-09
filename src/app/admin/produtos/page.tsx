"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Save, Image as ImageIcon } from "lucide-react";

interface Product {
  _id?: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  stock: number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Estado Inicial
  const [formData, setFormData] = useState<Product>({
    name: "",
    price: 0,
    stock: 0,
    category: "Tradicional",
    image: "",
    description: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing 
        ? `/api/products/${formData._id}` 
        : "/api/products";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchProducts();
        setShowForm(false);
        resetForm();
      } else {
        const err = await res.json();
        alert(`Erro: ${err.error || "Falha ao salvar"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const openNew = () => {
    resetForm();
    setIsEditing(false);
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setFormData(product);
    setIsEditing(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: "", price: 0, stock: 0, category: "Tradicional", image: "", description: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-800">Cardápio Digital 🍩</h1>
          <p className="text-gray-500">Gerencie seus produtos e preços</p>
        </div>
        <button 
          onClick={openNew}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"
        >
          <Plus size={20} /> Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 text-gray-400 font-medium text-sm">PRODUTO</th>
                <th className="text-left p-4 text-gray-400 font-medium text-sm">CATEGORIA</th>
                <th className="text-left p-4 text-gray-400 font-medium text-sm">PREÇO</th>
                <th className="text-left p-4 text-gray-400 font-medium text-sm">ESTOQUE</th>
                <th className="text-right p-4 text-gray-400 font-medium text-sm">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative">
                      {product.image ? (
                         <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-300 absolute top-3 left-3" />
                      )}
                    </div>
                    <span className="font-bold text-gray-700">{product.name}</span>
                  </td>
                  <td className="p-4"><span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase">{product.category}</span></td>
                  <td className="p-4 font-mono text-gray-600">R$ {product.price?.toFixed(2)}</td>
                  <td className="p-4 font-mono text-gray-600">{product.stock || 0} un</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(product)} className="p-2 text-gray-400 hover:text-blue-600"><Pencil size={18} /></button>
                      <button onClick={() => handleDelete(product._id!)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">{isEditing ? "Editar" : "Novo"}</h2>
              <button onClick={() => setShowForm(false)}><X size={24} className="text-gray-400" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <input 
                placeholder="Nome" required 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border rounded-xl"
              />

              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" step="0.01" placeholder="Preço" required 
                  value={formData.price || ""} 
                  onChange={e => setFormData({...formData, price: e.target.value ? parseFloat(e.target.value) : 0})}
                  className="w-full p-3 border rounded-xl"
                />
                <input 
                  type="number" placeholder="Estoque" required 
                  value={formData.stock || ""} 
                  onChange={e => setFormData({...formData, stock: e.target.value ? parseInt(e.target.value) : 0})}
                  className="w-full p-3 border rounded-xl"
                />
              </div>

              <select 
                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full p-3 border rounded-xl bg-white"
              >
                <option>Tradicional</option>
                <option>Recheado</option>
                <option>Especial</option>
                <option>Bebida</option>
              </select>

              <input 
                placeholder="URL da Imagem" 
                value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}
                className="w-full p-3 border rounded-xl"
              />

              <textarea 
                placeholder="Descrição do Produto (Opcional)"
                rows={3}
                value={formData.description || ""}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border rounded-xl"
              />

              <button type="submit" className="w-full bg-pink-600 text-white font-bold py-3 rounded-xl mt-4">
                {isEditing ? "Salvar" : "Cadastrar"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}