"use client";

import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca os pedidos
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
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

  // Função que chama a API para mudar o status
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // 1. Atualiza visualmente na hora (Feedback rápido)
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );

    // 2. Salva no Banco de Dados
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Falha ao atualizar");
      
    } catch (error) {
      alert("Erro ao atualizar. O status voltou ao anterior.");
      fetchOrders(); // Reverte se der erro
    }
  };

  // Cores para cada fase do pedido
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800 border-green-200";
      case "preparing": return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivering": return "bg-purple-100 text-purple-800 border-purple-200";
      case "completed": return "bg-gray-100 text-gray-800 border-gray-200";
      case "canceled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-yellow-100 text-yellow-800 border-yellow-200"; // pending
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciador de Pedidos</h1>
          <button 
            onClick={fetchOrders} 
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            🔄 Atualizar
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Carregando pedidos...</p>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order._id} className="p-4 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    
                    {/* Informações do Cliente e Pedido */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {order.customer?.name || "Cliente sem nome"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>📍 {order.customer?.neighborhood} - {order.customer?.address}</p>
                        <p>📞 {order.customer?.phone}</p>
                      </div>
                      <div className="mt-2">
                        {order.items?.map((item: any, idx: number) => (
                          <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Painel de Controle (Status e Valor) */}
                    <div className="flex flex-col items-end gap-2 min-w-[150px]">
                      <span className="text-lg font-bold text-gray-900">
                        R$ {order.total?.toFixed(2)}
                      </span>
                      
                      {/* O MENU MÁGICO QUE FALTAVA 👇 */}
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">🟡 Pendente</option>
                        <option value="paid">🟢 Pago</option>
                        <option value="preparing">👨‍🍳 Preparando</option>
                        <option value="delivering">🛵 Saiu Entrega</option>
                        <option value="completed">✅ Entregue</option>
                        <option value="canceled">❌ Cancelado</option>
                      </select>
                    </div>

                  </div>
                </li>
              ))}
            </ul>
            
            {orders.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Nenhum pedido encontrado.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}