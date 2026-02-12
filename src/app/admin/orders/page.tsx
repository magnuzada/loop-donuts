"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { DollarSign, ShoppingBag, TrendingUp } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  // Refs para guardar o estado anterior sem renderizar de novo
  const prevOrdersRef = useRef<any[]>([]);
  const isFirstLoad = useRef(true);

  // 1. Função de busca (O Polling)
  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders", { 
        cache: "no-store", 
        headers: { "Pragma": "no-cache" } 
      });
      const data = await res.json();

      // 2. Lógica do "Ding!" (Comparar lista nova com a velha)
      if (!isFirstLoad.current && soundEnabled) {
        const hasNewPaid = data.some((newOrder: any) => {
          // Só nos importamos com pedidos PAGOS
          if (newOrder.status !== "paid") return false;

          // Procura esse pedido na lista antiga
          const oldOrder = prevOrdersRef.current.find((o) => o._id === newOrder._id);

          // Toca o som se: O pedido não existia antes (novo) OU O status mudou para pago agora
          return !oldOrder || oldOrder.status !== "paid";
        });

        if (hasNewPaid) {
          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
          audio.play().catch((e) => console.log("Áudio bloqueado pelo navegador"));
        }
      }

      setOrders(data);
      prevOrdersRef.current = data;
      isFirstLoad.current = false;

    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
    } finally {
      setLoading(false);
    }
  }, [soundEnabled]);

  // 3. Efeito do Intervalo (Roda a cada 15 segundos)
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // 4. Lógica do Dashboard (KPIs) com useMemo
  const stats = useMemo(() => {
    // Consideramos receita apenas o que foi PAGO ou ENTREGUE
    const paidOrders = orders.filter((o) => o.status === "paid" || o.status === "completed" || o.status === "delivering" || o.status === "preparing");
    
    // Total Vendido
    const totalRevenue = paidOrders.reduce((acc, order) => acc + (order.total || 0), 0);
    
    // Pedidos nas últimas 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const ordersToday = orders.filter((o) => new Date(o.createdAt) >= oneDayAgo).length;
    
    // Ticket Médio
    const averageTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

    return { totalRevenue, ordersToday, averageTicket };
  }, [orders]);


  // 5. Função de mudar status (Manual)
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );

    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders(); // Sincroniza
    } catch (error) {
      alert("Erro ao atualizar.");
      fetchOrders(); // Reverte
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800 border-green-200";
      case "preparing": return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivering": return "bg-purple-100 text-purple-800 border-purple-200";
      case "completed": return "bg-gray-100 text-gray-800 border-gray-200";
      case "canceled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerencial Loop Donuts</h1>
            <p className="text-sm text-green-600 mt-1 flex items-center gap-2 font-medium">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Monitorando em tempo real
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-all ${
                soundEnabled
                  ? "bg-green-100 border-green-300 text-green-800"
                  : "bg-white border-gray-300 text-gray-500"
              }`}
            >
              {soundEnabled ? "🔊 Som Ativo" : "🔇 Som Desativado"}
            </button>
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              🔄 Atualizar
            </button>
          </div>
        </div>

        {/* 📊 DASHBOARD FINANCEIRO (KPIs) */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Card 1: Faturamento */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <DollarSign className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Faturamento Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.totalRevenue)}
                </p>
              </div>
            </div>

            {/* Card 2: Pedidos Hoje */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Pedidos (24h)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.ordersToday}</p>
              </div>
            </div>

            {/* Card 3: Ticket Médio */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Ticket Médio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.averageTicket)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Pedidos */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-lg font-bold text-indigo-700">
                          {order.customer?.name || "Cliente sem nome"}
                        </p>
                        <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                          {new Date(order.createdAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <div className="mt-1 text-sm text-gray-600 space-y-1">
                        <p>📍 {order.customer?.neighborhood} - {order.customer?.address}</p>
                        <p>📞 {order.customer?.phone}</p>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {order.items?.map((item: any, idx: number) => (
                          <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 min-w-[160px]">
                      <span className="text-2xl font-bold text-gray-900">
                        R$ {order.total?.toFixed(2)}
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`block w-full pl-3 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md font-bold cursor-pointer transition-colors ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">🟡 Pendente</option>
                        <option value="paid">🟢 Pago</option>
                        <option value="preparing">👨‍🍳 Preparando</option>
                        <option value="delivering">🛵 Saiu Entrega</option>
                        <option value="completed">✅ Entregue</option>
                        <option value="canceled">❌ Cancelado</option>
                      </select>
                      {order.paymentId && <span className="text-[10px] text-gray-400 font-mono">ID: {order.paymentId}</span>}
                    </div>
                  </div>
                </li>
              ))}
              {orders.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <p className="text-xl">Nenhum pedido encontrado.</p>
                </div>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}