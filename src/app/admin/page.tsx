import Link from "next/link";
import { Package, ShoppingBag, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-black text-gray-800 mb-2 text-center">
          Painel de Controle 🍩
        </h1>
        <p className="text-gray-500 text-center mb-12">
          Bem-vindo à torre de comando da Loop Donuts.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: Pedidos */}
          <Link 
            href="/admin/orders"
            className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center"
          >
            <div className="bg-blue-100 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform">
              <ShoppingBag size={48} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedidos</h2>
            <p className="text-gray-500">
              Acompanhe vendas em tempo real e despache entregas.
            </p>
          </Link>

          {/* Card 2: Produtos */}
          <Link 
            href="/admin/produtos"
            className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center"
          >
            <div className="bg-pink-100 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform">
              <Package size={48} className="text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Produtos</h2>
            <p className="text-gray-500">
              Cadastre novos donuts, edite preços e fotos do cardápio.
            </p>
          </Link>
        </div>
        
        <div className="mt-12 text-center">
           <p className="text-xs text-gray-400">Versão 1.0.0 • Loop Donuts</p>
        </div>
      </div>
    </div>
  );
}