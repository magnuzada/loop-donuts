import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col font-body selection:bg-black selection:text-white">
      <NavBar />
      <div className="flex-grow pt-32 pb-24 container mx-auto px-6 max-w-3xl">
        <h1 className="font-display text-5xl font-black text-black uppercase tracking-tighter mb-12">
          Política de Privacidade
        </h1>
        <div className="space-y-8 text-lg text-gray-700 leading-relaxed font-medium">
          <section>
            <h2 className="font-bold text-2xl text-black mb-4">1. Seus Dados Estão Seguros</h2>
            <p>A Loop Donuts respeita a sua privacidade. Solicitamos informações pessoais (nome, endereço, telefone) apenas quando realmente precisamos delas para entregar o seu pedido.</p>
          </section>
          <section>
            <h2 className="font-bold text-2xl text-black mb-4">2. Retenção de Dados</h2>
            <p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado (entregar seus donuts). Não armazenamos dados de cartão de crédito; tudo é processado de forma criptografada pelo gateway de pagamento.</p>
          </section>
          <section>
            <h2 className="font-bold text-2xl text-black mb-4">3. Compartilhamento</h2>
            <p>Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei ou com a transportadora terceirizada para fins exclusivos de entrega.</p>
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