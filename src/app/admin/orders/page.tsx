"use client";

import { useEffect, useState } from "react";

interface OrderType {
  _id: string;
  customer: {
    name: string;
    phone: string;
    neighborhood: string;
  };
  items: any[];
  total: number;
  status: string;
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar dados
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders"); // Chama a API
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="text-xl font-bold text-orange-600 animate-bounce">🍩 Carregando Pedidos...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-orange-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">
              Torre de Controle 🗼
            </h1>
            <p className="text-gray-500">Gerencie as vendas da Loop Donuts</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-bold shadow-md transition-all active:scale-95"
          >
            🔄 Atualizar Lista
          </button>
        </div>
        
        {/* Tabela */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
          <table className="w-full text-left">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="p-4 font-bold">Data</th>
                <th className="p-4 font-bold">Cliente</th>
                <th className="p-4 font-bold">Bairro</th>
                <th className="p-4 font-bold">Pedido</th>
                <th className="p-4 font-bold">Total</th>
                <th className="p-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-orange-50 transition-colors group">
                  <td className="p-4 text-sm text-gray-600 font-mono">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    <div className="text-xs opacity-50">#{order._id.slice(-4)}</div>
                  </td>
                  <td className="p-4 font-bold text-gray-800 capitalize">
                    {order.customer?.name}
                    <div className="text-xs text-gray-400 font-normal">{order.customer?.phone}</div>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {order.customer?.neighborhood}
                  </td>
                  <td className="p-4">
                    <ul className="text-sm text-gray-600 space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          <span className="font-bold text-orange-600">{item.quantity}x</span> {item.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-4 font-black text-gray-800 text-lg">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                      order.status === 'paid' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}>
                      {order.status === 'paid' ? 'PAGO' : 'PENDENTE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {orders.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              Nenhum pedido encontrado ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}