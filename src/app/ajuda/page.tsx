import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { LifeBuoy } from "lucide-react";

export default function AjudaPage() {
  const faqs = [
    {
      pergunta: "Como funciona a entrega?",
      resposta: "Nós calculamos a taxa de entrega baseada no seu bairro na hora do checkout. Se o seu bairro não estiver na lista, infelizmente ainda não entregamos aí (mas estamos expandindo!)."
    },
    {
      pergunta: "Quanto tempo dura um donut da Loop?",
      resposta: "Nossos donuts são 100% artesanais e sem conservantes. O ideal é devorar no mesmo dia! Se sobrar (duvidamos), guarde em um recipiente fechado em temperatura ambiente por até 2 dias. Não coloque na geladeira, senão a massa resseca."
    },
    {
      pergunta: "Vocês aceitam vale-refeição?",
      resposta: "No momento aceitamos apenas PIX e Cartão de Crédito através da nossa plataforma segura de pagamentos."
    },
    {
      pergunta: "Fiz um pedido, como sei que deu certo?",
      resposta: "Assim que o pagamento for aprovado, seu pedido entra na nossa esteira de produção. Você pode acompanhar o status na tela de sucesso ou chamar a gente no WhatsApp informando o nome do pedido."
    }
  ];

  return (
    <main className="min-h-screen bg-cream flex flex-col font-body selection:bg-black selection:text-white">
      <NavBar />
      <div className="flex-grow pt-32 pb-24 container mx-auto px-6 max-w-4xl">
        <div className="mb-12 text-center">
          <LifeBuoy className="w-16 h-16 mx-auto mb-6 text-yellow-500" />
          <h1 className="font-display text-5xl font-black text-black uppercase tracking-tighter mb-4 drop-shadow-[2px_2px_0px_rgba(255,204,0,1)]">
            Central de Ajuda
          </h1>
          <p className="text-xl text-gray-600 font-medium">Tire suas dúvidas antes de dar a primeira mordida.</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <details key={index} className="group border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="font-display text-xl font-bold p-6 cursor-pointer bg-white group-open:bg-yellow-400 transition-colors flex justify-between items-center outline-none">
                {faq.pergunta}
                <span className="text-2xl font-black group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="p-6 text-gray-800 font-medium text-lg bg-white border-t-4 border-black leading-relaxed">
                {faq.resposta}
              </div>
            </details>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}