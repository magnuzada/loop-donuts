"use client";

import { useEffect, useState } from "react";
import { Trash2, Edit, RefreshCw } from "lucide-react"; // Ícones

export function AdminProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca os produtos ao carregar a tela
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      alert("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Função de Excluir
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja EXCLUIR este produto? Essa ação não tem volta.")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      
      if (data.success) {
        alert("Produto apagado com sucesso! 🗑️");
        fetchProducts(); // Recarrega a lista
      } else {
        alert("Erro ao apagar: " + data.message);
      }
    } catch (error) {
      alert("Erro de conexão.");
    }
  };

  if (loading) return <div className="p-10 text-center">Carregando lista... ⏳</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📋 Lista de Produtos ({products.length})</h2>
        <button onClick={fetchProducts} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200" title="Atualizar">
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
              <th className="p-3">Imagem</th>
              <th className="p-3">Nome</th>
              <th className="p-3">Categoria</th>
              <th className="p-3">Preço</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-12 h-12 rounded-md object-cover border border-gray-200"
                  />
                </td>
                <td className="p-3 font-medium text-gray-900">{product.name}</td>
                <td className="p-3 text-sm text-gray-500">{product.category}</td>
                <td className="p-3 font-bold text-green-600">
                  R$ {product.price?.toFixed(2)}
                </td>
                <td className="p-3">
                  {/* Lógica para suportar status antigo e novo */}
                  {product.status === 'active' || product.isActive ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">Ativo</span>
                  ) : (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-bold">Inativo</span>
                  )}
                </td>
                <td className="p-3 text-right flex justify-end gap-2">
                  <button 
                    onClick={() => handleDelete(product._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-10 text-gray-400">Nenhum produto encontrado.</div>
        )}
      </div>
    </div>
  );
}