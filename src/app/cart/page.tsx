"use client";

import { useCart } from "@/context/CartContext";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Trash2, ArrowRight, Copy, CheckCircle, CreditCard, Banknote } from "lucide-react"; // Novos ícones
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  
  // Estados novos
  const [paymentMethod, setPaymentMethod] = useState("pix"); // pix | credit | debit
  const [pixCode, setPixCode] = useState(""); // Guarda o código Copia e Cola
  const [qrCodeImage, setQrCodeImage] = useState(""); // Guarda a imagem do QR
  const [orderSuccess, setOrderSuccess] = useState(false); // Controla se mostra a tela final

  const [formData, setFormData] = useState({
    name: "", phone: "", address: "", neighborhood: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para copiar o código Pix
  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    alert("Código Pix copiado! 📋");
  };

  const handleCheckout = async () => {
    // Validação
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Precisamos do seu nome e endereço para a entrega! 🚚");
      return;
    }

    if (paymentMethod !== "pix") {
      alert("No momento, apenas Pagamento via Pix está disponível para teste automático! 🍩");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          cart, 
          customer: formData
        }),
      });

      const data = await res.json();

      if (data.qr_code_base64) {
        // SUCESSO! Guardamos os dados e mudamos a tela
        setPixCode(data.qr_code); 
        setQrCodeImage(data.qr_code_base64);
        setOrderSuccess(true);
        clearCart(); // Limpa o carrinho do contexto
      } else {
        alert("Erro ao gerar Pix no Mercado Pago.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao processar.");
    } finally {
      setLoading(false);
    }
  };

  // --- TELA DE SUCESSO (SIMULAÇÃO PIX) ---
  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-cream flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center pt-32 pb-20 px-6">
          <div className="bg-white max-w-md w-full rounded-3xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 text-center animate-in fade-in zoom-in duration-300">
            
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            
            <h1 className="font-display text-3xl mb-2">Pedido Recebido!</h1>
            <p className="text-gray-600 mb-8">Agora é só pagar para liberar a entrega.</p>

            {/* Área do QR Code */}
            <div className="bg-gray-100 p-4 rounded-xl border-2 border-dashed border-gray-300 mb-6 flex flex-col items-center">
              <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Escaneie o QR Code</p>
              {/* Imagem do QR Code Base64 vinda do Mercado Pago */}
              <img 
                src={`data:image/png;base64,${qrCodeImage}`} 
                alt="QR Code Pix" 
                className="w-48 h-48 mix-blend-multiply"
              />
            </div>

            {/* Área do Copia e Cola */}
            <div className="relative mb-8">
              <label className="text-xs font-bold text-gray-500 mb-1 block text-left">PIX COPIA E COLA</label>
              <div className="flex">
                <input 
                  value={pixCode} 
                  readOnly 
                  className="w-full bg-gray-50 border-2 border-r-0 border-gray-300 rounded-l-lg p-3 text-xs text-gray-600 font-mono truncate"
                />
                <button 
                  onClick={handleCopyPix}
                  className="bg-cta border-2 border-black rounded-r-lg px-4 hover:bg-cta-hover transition-colors"
                  title="Copiar"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>

            <Link href="/menu">
              <button className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all">
                JÁ PAGUEI! VOLTAR AO CARDÁPIO
              </button>
            </Link>

          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // --- TELA DO CARRINHO (CHECKOUT) ---
  return (
    <main className="min-h-screen bg-cream flex flex-col">
      <NavBar />

      <div className="flex-grow container mx-auto px-6 pt-32 pb-20 max-w-5xl">
        <h1 className="font-display text-4xl md:text-5xl text-center mb-12">
          CHECKOUT 🍩
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl font-bold mb-6">Sua caixa está vazia... 😢</p>
            <Link href="/menu" className="inline-block bg-cta hover:bg-cta-hover text-black font-bold py-3 px-8 rounded-full border-2 border-black transition-all hover:-translate-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              VOLTAR PARA O MENU
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* ESQUERDA: LISTA DE PRODUTOS + FORMULÁRIO */}
            <div className="flex-1 space-y-6">
              
              {/* Lista */}
              <div className="bg-white rounded-3xl p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="font-display text-2xl mb-4">SEUS DONUTS</h2>
                <ul className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <li key={item.id} className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden border border-black">
                          {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : "🍩"}
                        </div>
                        <div>
                          <h3 className="font-bold leading-tight">{item.name}</h3>
                          <p className="text-xs text-gray-500">{item.quantity}x R$ {item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Formulário (Mais limpo agora) */}
              <div className="bg-white rounded-3xl p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="font-display text-2xl mb-4">DADOS DE ENTREGA</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="name" onChange={handleChange} placeholder="Seu Nome" className="p-3 border-2 border-gray-300 rounded-lg focus:border-black outline-none transition-colors" />
                  <input name="phone" onChange={handleChange} placeholder="WhatsApp" className="p-3 border-2 border-gray-300 rounded-lg focus:border-black outline-none transition-colors" />
                  <input name="address" onChange={handleChange} placeholder="Endereço Completo" className="md:col-span-2 p-3 border-2 border-gray-300 rounded-lg focus:border-black outline-none transition-colors" />
                  <input name="neighborhood" onChange={handleChange} placeholder="Bairro" className="md:col-span-2 p-3 border-2 border-gray-300 rounded-lg focus:border-black outline-none transition-colors" />
                </div>
              </div>
            </div>

            {/* DIREITA: RESUMO + PAGAMENTO */}
            <div className="w-full lg:w-96 h-fit sticky top-32">
              <div className="bg-white rounded-3xl p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="font-display text-2xl mb-6">PAGAMENTO</h2>
                
                {/* Seletor de Pagamento */}
                <div className="flex gap-2 mb-6">
                  <button 
                    onClick={() => setPaymentMethod("pix")}
                    className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all ${
                      paymentMethod === "pix" ? "border-black bg-cta text-black" : "border-gray-200 text-gray-400 hover:border-gray-400"
                    }`}
                  >
                    <span className="font-bold text-sm">PIX</span>
                  </button>
                  
                  <button 
                    onClick={() => setPaymentMethod("credit")}
                    className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all ${
                      paymentMethod === "credit" ? "border-black bg-cta text-black" : "border-gray-200 text-gray-400 hover:border-gray-400"
                    }`}
                  >
                    <CreditCard size={20} className="mb-1" />
                    <span className="text-[10px] font-bold">CRÉDITO</span>
                  </button>

                  <button 
                    onClick={() => setPaymentMethod("debit")}
                    className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all ${
                      paymentMethod === "debit" ? "border-black bg-cta text-black" : "border-gray-200 text-gray-400 hover:border-gray-400"
                    }`}
                  >
                    <Banknote size={20} className="mb-1" />
                    <span className="text-[10px] font-bold">DÉBITO</span>
                  </button>
                </div>

                <div className="border-t-2 border-dashed border-gray-300 pt-4 mb-6">
                  <div className="flex justify-between text-xl font-bold text-black">
                    <span>TOTAL</span>
                    <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full group flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "GERANDO PIX..." : "FINALIZAR PEDIDO"}
                  {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>
                
                <p className="text-[10px] text-center mt-4 text-gray-400 uppercase tracking-widest">
                  Ambiente Seguro 🔒
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}