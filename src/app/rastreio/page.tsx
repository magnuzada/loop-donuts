"use client";

import { useState } from "react";
import { NavBar } from "@/components/NavBar"; 
import { Search, Clock, CreditCard, ChefHat, Truck, CheckCircle, AlertCircle } from "lucide-react";

interface TrackedOrder {
  id: string;
  status: "pending" | "paid" | "preparing" | "delivering" | "completed" | "canceled";
  total: number;
  items: { name: string; quantity: number }[];
  createdAt: string;
}

export default function RastreioPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Pedido não encontrado.");
      } else {
        setOrder(data);
      }
    } catch (err) {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: "pending", label: "Aguardando", icon: Clock },
    { id: "paid", label: "Aprovado", icon: CreditCard },
    { id: "preparing", label: "Preparando", icon: ChefHat },
    { id: "delivering", label: "A Caminho", icon: Truck },
    { id: "completed", label: "Entregue", icon: CheckCircle },
  ];

  const getStepIndex = (status: string) => {
    if (status === "canceled") return -1;
    return steps.findIndex((s) => s.id === status);
  };

  const currentIndex = order ? getStepIndex(order.status) : -1;

  return (
    <main className="min-h-screen bg-pink-50 flex flex-col">
      <NavBar />
      
      <div className="flex-1 max-w-2xl w-full mx-auto p-4 md:py-12">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-pink-100">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Cadê meu Donut? 🍩</h1>
            <p className="text-gray-500">Acompanhe seu pedido em tempo real.</p>
          </div>

          <form onSubmit={handleTrack} className="flex gap-3 mb-8">
            <div className="relative flex-1">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Seu WhatsApp (Ex: 32 99999-9999)"
                className="w-full pl-4 pr-12 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-pink-500 focus:ring-0 outline-none transition-all font-medium text-gray-700"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <button
              type="submit"
              disabled={loading || !phone}
              className="px-6 md:px-8 py-4 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all shadow-sm active:translate-y-1"
            >
              {loading ? "Buscando..." : "Rastrear"}
            </button>
          </form>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle size={20} />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {order && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="relative pt-8 pb-12">
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gray-100 md:-translate-x-1/2 rounded-full"></div>
                
                {order.status === "canceled" ? (
                  <div className="relative z-10 flex flex-col items-center text-center p-6 bg-red-50 rounded-2xl border border-red-100">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
                    <h3 className="font-bold text-red-700 text-lg">Pedido Cancelado</h3>
                    <p className="text-red-500 text-sm">Entre em contato com o suporte.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {steps.map((step, index) => {
                      const Icon = step.icon;
                      const isPast = index < currentIndex;
                      const isCurrent = index === currentIndex;
                      
                      let colorClass = "bg-white border-2 border-gray-200 text-gray-400"; 
                      if (isPast) colorClass = "bg-green-500 border-2 border-green-500 text-white"; 
                      if (isCurrent) colorClass = "bg-pink-500 border-2 border-pink-500 text-white ring-4 ring-pink-100"; 

                      return (
                        <div key={step.id} className="relative z-10 flex items-center gap-6 md:justify-center">
                          <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 ${colorClass}`}>
                            <Icon size={24} />
                          </div>
                          <div className="md:absolute md:left-1/2 md:ml-12 md:w-48 text-left">
                            <p className={`font-bold text-lg ${isCurrent ? 'text-pink-600' : isPast ? 'text-gray-900' : 'text-gray-400'}`}>
                              {step.label}
                            </p>
                            {isCurrent && <p className="text-xs text-gray-500">Status atual do seu pedido</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-6 border-t-2 border-dashed border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                  <span>Resumo do Pedido</span>
                  <span className="text-sm font-normal text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </h3>
                <ul className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="w-6 h-6 bg-pink-100 text-pink-700 rounded-md flex items-center justify-center font-bold text-xs">
                        {item.quantity}
                      </span>
                      {item.name}
                    </li>
                  ))}
                </ul>
                <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center border border-gray-100">
                  <span className="text-gray-600 font-medium">Total</span>
                  <span className="text-xl font-black text-gray-900">
                    R$ {order.total.toFixed(2)}
                  </span>
                </div>
              </div>
              
            </div>
          )}

        </div>
      </div>
    </main>
  );
}