import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col font-body selection:bg-black selection:text-white">
      <NavBar />
      <div className="flex-grow pt-32 pb-24 container mx-auto px-6 max-w-3xl">
        <h1 className="font-display text-5xl font-black text-black uppercase tracking-tighter mb-12">
          Termos de Uso
        </h1>
        <div className="space-y-8 text-lg text-gray-700 leading-relaxed font-medium">
          <section>
            <h2 className="font-bold text-2xl text-black mb-4">1. Aceitação dos Termos</h2>
            <p>Ao acessar e realizar pedidos no site da Loop Donuts, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis.</p>
          </section>
          <section>
            <h2 className="font-bold text-2xl text-black mb-4">2. Compras e Pagamentos</h2>
            <p>Todos os pedidos estão sujeitos à disponibilidade do nosso estoque diário. Os pagamentos são processados de forma segura via Mercado Pago. O pedido só entra em produção após a confirmação do pagamento.</p>
          </section>
          <section>
            <h2 className="font-bold text-2xl text-black mb-4">3. Política de Entrega</h2>
            <p>As entregas são realizadas nos bairros cadastrados. É responsabilidade do cliente garantir que haverá alguém para receber o pedido no endereço informado.</p>
          </section>
          <p className="text-sm text-gray-500 pt-8 border-t-2 border-dashed border-gray-300">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}