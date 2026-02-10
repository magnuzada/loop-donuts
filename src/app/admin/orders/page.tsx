"use client";

import { useEffect, useState } from "react";
import { NavBar } from "@/components/NavBar"; // Ajuste se seu NavBar for diferente ou remova

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca os pedidos assim que a tela abre
  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">📦 Gestão de Pedidos</h1>
        
        {loading ? (
          <p className="text-center text-gray-500">Carregando pedidos...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-pink-600 text-white">
                  <th className="p-4 font-bold">Data</th>
                  <th className="p-4 font-bold">Cliente</th>
                  <th className="p-4 font-bold">Itens</th>
                  <th className="p-4 font-bold">Total</th>
                  <th className="p-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-pink-50 transition-colors">
                    {/* Data Formatada */}
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString("pt-BR")}
                    </td>
                    
                    {/* Dados do Cliente */}
                    <td className="p-4">
                      <p className="font-bold text-gray-800">{order.customer?.name || "Sem Nome"}</p>
                      <p className="text-xs text-gray-500">{order.customer?.phone}</p>
                    </td>

                    {/* Resumo dos Itens */}
                    <td className="p-4 text-sm text-gray-600">
                      {order.items?.map((item: any) => (
                        <div key={item.product || item.name}>
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                    </td>

                    {/* Valor Total */}
                    <td className="p-4 font-bold text-green-600">
                      R$ {order.total?.toFixed(2)}
                    </td>

                    {/* Status Colorido */}
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        order.status === 'approved' || order.status === 'paid' 
                          ? 'bg-green-100 text-green-700' 
                          : order.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-red-100 text-red-700'
                      }`}>
                        {order.status === 'approved' ? 'PAGO ✅' : 
                         order.status === 'pending' ? 'PENDENTE ⏳' : order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
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