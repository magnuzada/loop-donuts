"use client";

import { useState, useEffect } from "react";
import { Package, Clock, CheckCircle, XCircle, MapPin, Phone, RefreshCw } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    neighborhood: string;
  };
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Função de buscar pedidos
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Formata Data: 08/02/2026 14:30
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  // Formata Dinheiro: R$ 50,00
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  // Define a cor do Status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "rejected": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Traduz o Status
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved": return "PAGO";
      case "pending": return "PENDENTE";
      case "rejected": return "CANCELADO";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-800">Pedidos 📦</h1>
            <p className="text-gray-500">Acompanhe as vendas em tempo real</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="bg-white hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2 transition-all"
          >
            <RefreshCw size={18} /> Atualizar
          </button>
        </div>

        {/* Lista de Pedidos */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 animate-pulse">Carregando pedidos...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Nenhum pedido recebido ainda.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                
                {/* Cabeçalho do Card */}
                <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-gray-400">#{order._id.slice(-6).toUpperCase()}</span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock size={14} /> {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)} flex items-center gap-1`}>
                    {order.status === 'approved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {getStatusLabel(order.status)}
                  </div>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-8">
                  {/* Coluna 1: Cliente */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Cliente</h3>
                    <p className="font-bold text-gray-800 text-lg mb-1">{order.customer.name}</p>
                    
                    <a 
                      href={`https://wa.me/55${order.customer.phone.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 text-sm flex items-center gap-2 mb-3 font-medium"
                    >
                      <Phone size={14} /> {order.customer.phone}
                    </a>

                    <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 flex items-start gap-2">
                      <MapPin size={16} className="mt-1 shrink-0" />
                      <div>
                        <p className="font-bold">{order.customer.neighborhood}</p>
                        <p>{order.customer.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Coluna 2: Itens */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Itens do Pedido</h3>
                    <ul className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-sm text-gray-600 border-b border-gray-50 pb-2 last:border-0">
                          <span>{item.quantity}x <span className="font-medium text-gray-800">{item.name}</span></span>
                          <span>{formatCurrency(item.price * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <span className="font-bold text-gray-600">Total</span>
                      <span className="font-black text-2xl text-pink-600">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}