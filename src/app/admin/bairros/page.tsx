"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";

interface Neighborhood {
  _id: string;
  name: string;
  price: number;
  active: boolean;
}

export default function AdminBairrosPage() {
  const [bairros, setBairros] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado do formulário
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBairros();
  }, []);

  const fetchBairros = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/neighborhoods");
      const data = await res.json();
      setBairros(data);
    } catch (error) {
      console.error("Erro ao carregar bairros", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice) return;

    const payload = { name: formName, price: Number(formPrice), active: formActive };
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/admin/neighborhoods/${editingId}` : "/api/admin/neighborhoods";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      // NOVA TRAVA DE SEGURANÇA: Se a API não responder "OK", paramos tudo e avisamos!
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(`❌ Erro do Servidor: ${errorData.error || res.statusText || 'Verifique o caminho da API'}`);
        return;
      }

      // Se deu tudo certo, limpa form e recarrega
      setFormName("");
      setFormPrice("");
      setFormActive(true);
      setEditingId(null);
      fetchBairros();
    } catch (error) {
      alert("❌ Erro de Conexão: Não foi possível falar com a API.");
      console.error("Erro ao salvar", error);
    }
  };

  const handleEdit = (bairro: Neighborhood) => {
    setEditingId(bairro._id);
    setFormName(bairro.name);
    setFormPrice(bairro.price.toString());
    setFormActive(bairro.active);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja apagar este bairro?")) return;
    try {
      await fetch(`/api/admin/neighborhoods/${id}`, { method: "DELETE" });
      fetchBairros();
    } catch (error) {
      console.error("Erro ao deletar", error);
    }
  };

  const toggleActive = async (bairro: Neighborhood) => {
    try {
      await fetch(`/api/admin/neighborhoods/${bairro._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...bairro, active: !bairro.active }),
      });
      fetchBairros();
    } catch (error) {
      console.error("Erro ao alterar status", error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <MapPin className="w-8 h-8 text-pink-500" />
        <h1 className="text-3xl font-black text-gray-900">Zonas de Entrega</h1>
      </div>

      {/* Formulário */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          {editingId ? <Edit2 size={20}/> : <Plus size={20}/>}
          {editingId ? "Editar Bairro" : "Adicionar Novo Bairro"}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Bairro</label>
            <input 
              type="text" 
              value={formName} 
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-pink-500 outline-none"
              placeholder="Ex: Centro"
              required
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-bold text-gray-700 mb-1">Taxa (R$)</label>
            <input 
              type="number" 
              step="0.01"
              value={formPrice} 
              onChange={(e) => setFormPrice(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-pink-500 outline-none"
              placeholder="5.00"
              required
            />
          </div>
          <div className="flex items-center h-12 gap-2 mb-1">
            <input 
              type="checkbox" 
              id="activeCheckbox"
              checked={formActive} 
              onChange={(e) => setFormActive(e.target.checked)}
              className="w-5 h-5 text-pink-500"
            />
            <label htmlFor="activeCheckbox" className="font-bold text-gray-700 cursor-pointer">Ativo</label>
          </div>
          <button 
            type="submit" 
            className="w-full md:w-auto px-8 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-lg transition-colors h-12"
          >
            {editingId ? "Salvar" : "Adicionar"}
          </button>
          
          {editingId && (
            <button 
              type="button" 
              onClick={() => { setEditingId(null); setFormName(""); setFormPrice(""); setFormActive(true); }}
              className="w-full md:w-auto px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg h-12"
            >
              Cancelar
            </button>
          )}
        </form>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-bold animate-pulse">Carregando mapa logístico...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <th className="p-4 font-bold">Bairro</th>
                <th className="p-4 font-bold">Taxa</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {bairros.map((bairro) => (
                <tr key={bairro._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{bairro.name}</td>
                  <td className="p-4 font-mono text-gray-600">R$ {bairro.price.toFixed(2)}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleActive(bairro)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        bairro.active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {bairro.active ? <><CheckCircle size={14}/> Ativo</> : <><XCircle size={14}/> Pausado</>}
                    </button>
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <button onClick={() => handleEdit(bairro)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(bairro._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {bairros.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">Nenhum bairro cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}