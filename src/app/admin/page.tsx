import { AdminProductForm } from "@/components/AdminProductForm";
import { AdminProductList } from "@/components/AdminProductList"; // 👈 Importe a lista
import { NavBar } from "@/components/NavBar";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col items-center mb-10 text-center">
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic">
            Painel de Controle 🍩
          </h1>
          <p className="text-gray-500 mt-2">
            Adicione novos itens ou gerencie o estoque existente.
          </p>
        </div>

        {/* Layout em Abas ou Colunas? Vamos colocar um embaixo do outro por enquanto */}
        
        {/* 1. Área de Cadastro */}
        <div className="mb-16">
          <h2 className="text-xl font-bold mb-4 text-gray-700 border-l-4 border-brand-500 pl-3">
            ✨ Cadastrar Novo Produto
          </h2>
          <AdminProductForm />
        </div>

        {/* 2. Área de Listagem (Gerenciamento) */}
        <div className="border-t border-gray-300 pt-10">
           <AdminProductList />
        </div>
        
      </div>
    </main>
  );
}