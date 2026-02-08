"use client";

import { useEffect, useState } from "react";

// Tipagem exata baseada no JSON que você me mandou
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  _id: string;
}

interface OrderType {
  _id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    neighborhood: string;
  };
  items: OrderItem[];
  total: number;
  status: string;
  paymentId: string;
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit", // Ano curto (26)
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s === "approved" || s === "pago") return "bg-green-100 text-green-800 border-green-200";
    if (s === "pending" || s === "pendente") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-gray-100 text-gray-800";
  };

  if (loading) return <div className="p-10 text-center text-brand font-bold animate-pulse">Carregando pedidos... 🍩</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-brand mb-8">📦 Gestão de Pedidos</h1>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-light text-brand font-bold text-sm uppercase tracking-wider">
                  <th className="p-4 border-b">Data / ID</th>
                  <th className="p-4 border-b">Cliente</th>
                  <th className="p-4 border-b">Itens</th>
                  <th className="p-4 border-b">Endereço</th>
                  <th className="p-4 border-b">Total</th>
                  <th className="p-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-orange-50 transition-colors">
                    
                    {/* DATA E ID */}
                    <td className="p-4 align-top">
                      <div className="text-sm font-bold text-gray-700">{formatDate(order.createdAt)}</div>
                      <div className="text-xs text-gray-400 font-mono mt-1" title={order._id}>
                        #{order._id.slice(-6).toUpperCase()}
                      </div>
                    </td>

                    {/* CLIENTE */}
                    <td className="p-4 align-top">
                      <div className="font-semibold text-gray-900">{order.customer.name}</div>
                      <div className="text-xs text-gray-500 mt-1">📞 {order.customer.phone}</div>
                    </td>

                    {/* ITENS (Resumo) */}
                    <td className="p-4 align-top">
                      <ul className="text-sm text-gray-600 space-y-1">
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            <span className="font-bold text-brand">{item.quantity}x</span> {item.name}
                          </li>
                        ))}
                      </ul>
                    </td>

                    {/* ENDEREÇO */}
                    <td className="p-4 align-top max-w-xs">
                      <div className="text-sm text-gray-600">
                        {order.customer.address === "Retirada" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            🏪 Retirada na Loja
                          </span>
                        ) : (
                          <>
                            <div>{order.customer.address}</div>
                            <div className="text-xs text-gray-400">{order.customer.neighborhood}</div>
                          </>
                        )}
                      </div>
                    </td>

                    {/* TOTAL */}
                    <td className="p-4 align-top font-bold text-gray-900">
                      {formatCurrency(order.total)}
                    </td>

                    {/* STATUS */}
                    <td className="p-4 align-top">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
                        {order.status || "Pendente"}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}