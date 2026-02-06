import { AdminProductForm } from "@/components/AdminProductForm";
import { NavBar } from "@/components/NavBar";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="container mx-auto px-6 pt-32 pb-10">
        <div className="flex flex-col items-center mb-10 text-center">
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic">
            Painel de Controle 🍩
          </h1>
          <p className="text-gray-500 mt-2">
            Cadastre novos produtos com a estrutura completa (Preços, Estoque e Categorias).
          </p>
        </div>

        {/* O Super Formulário que criamos anteriormente */}
        <AdminProductForm />
        
      </div>
    </main>
  );
}