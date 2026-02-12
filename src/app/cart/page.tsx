"use client";

import { useCart } from "@/context/CartContext";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer"; // Tente remover as chaves se for export default
import { Trash2, ArrowRight, Copy, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { cart, removeFromCart, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  // paymentMethod mantido apenas para visual, o backend decide as opções agora
  const [paymentMethod, setPaymentMethod] = useState("pix"); 
  const [pixCode, setPixCode] = useState("");
  const [qrCodeImage, setQrCodeImage] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(""); 

  // Estado do formulário com novos campos
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",      // Novo
    docNumber: "",  // Novo (CPF)
    address: "",
    neighborhood: "",
  });

  // 1. CARREGAR DADOS SALVOS (Memória do Cliente)
  useEffect(() => {
    const savedData = localStorage.getItem("loop_customer_data");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // 2. SALVAR ENQUANTO DIGITA (Auto-Save)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    localStorage.setItem("loop_customer_data", JSON.stringify(newData));
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    alert("Código Pix copiado! 📋");
  };

  const handleCheckout = async () => {
    // 👇 CORREÇÃO CRÍTICA: Validação do Bairro (neighborhood)
    if (!formData.name || !formData.phone || !formData.address || !formData.neighborhood) {
      alert("Por favor, preencha TODOS os dados de entrega (incluindo o Bairro)! 🚚");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          customer: formData // Envia todos os dados, incluindo email e cpf se tiver
        }),
      });

      const data = await res.json();

      if (data.url) {
        // Fluxo de redirecionamento (Cartão/Checkout Pro)
        setCheckoutUrl(data.url);
        window.location.href = data.url; // Redireciona para o Mercado Pago
        clearCart();
      } else if (data.qr_code_base64) {
        // Fluxo Pix Direto (Legado/Transparente)
        setPixCode(data.qr_code);
        setQrCodeImage(data.qr_code_base64);
        setOrderSuccess(true);
        clearCart();
      } else {
        alert("Erro ao iniciar pagamento. Tente novamente.");
        console.error("Erro MP:", data);
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão ao processar pedido.");
    } finally {
      setLoading(false);
    }
  };

  // Tela de Sucesso (Apenas para Pix Direto - Checkout Pro redireciona)
  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-orange-50 flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center pt-32 pb-20 px-6">
          <div className="bg-white w-full max-w-md rounded-3xl border-2 border-black shadow-card p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="font-black text-3xl mb-2">Pedido Recebido!</h1>
            <p className="text-gray-600 mb-6">Pague para liberar a entrega.</p>
            <div className="bg-gray-100 p-4 rounded-xl border-2 border-dashed border-gray-300 mb-6 flex flex-col items-center">
              <img src={`data:image/png;base64,${qrCodeImage}`} alt="QR Pix" className="w-48 h-48 mix-blend-multiply" />
            </div>
            <div className="flex mb-6">
              <input value={pixCode} readOnly className="w-full bg-gray-50 border-2 border-r-0 border-gray-300 rounded-l-lg p-3 text-xs font-mono truncate" />
              <button onClick={handleCopyPix} className="bg-yellow-400 border-2 border-black rounded-r-lg px-4 hover:bg-yellow-500"><Copy size={18} /></button>
            </div>
            <Link href="/menu">
              <button className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800">VOLTAR AO CARDÁPIO</button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream flex flex-col">
      <NavBar />
      <div className="flex-grow container mx-auto px-6 pt-32 pb-20 max-w-5xl">
        <h1 className="font-black text-4xl text-center mb-12 uppercase italic tracking-tighter text-gray-900">
          CHECKOUT FINAL 🍩
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-black shadow-card">
            <p className="text-xl font-bold mb-6">Sua caixa está vazia...</p>
            <Link href="/menu" className="bg-yellow-400 text-black font-bold py-3 px-8 rounded-full border-2 border-black shadow-button hover:-translate-y-1 transition-all">VOLTAR PARA O MENU</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* ESQUERDA - DADOS E ITENS */}
            <div className="flex-1 space-y-6">
              <div className="bg-white rounded-3xl p-6 border-2 border-black shadow-card">
                <h2 className="font-black text-xl mb-4 uppercase">Seus Donuts</h2>
                <ul className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <li key={item.id || item._id} className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                           {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : "🍩"}
                        </div>
                        <div>
                          <h3 className="font-bold">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.quantity}x R$ {Number(item.price).toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold">R$ {(item.price * (item.quantity || 1)).toFixed(2)}</span>
                        <button onClick={() => removeFromCart(item.id || item._id || "")} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* FORMULÁRIO DE ENTREGA */}
              <div className="bg-white rounded-3xl p-6 border-2 border-black shadow-card">
                <h2 className="font-black text-xl mb-4 uppercase">Dados de Entrega</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2">
                      <label className="text-xs font-bold text-gray-500 ml-1">Nome Completo *</label>
                      <input name="name" value={formData.name} onChange={handleChange} placeholder="Ex: João Silva" className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-black outline-none" />
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-gray-500 ml-1">WhatsApp *</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="(00) 00000-0000" className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-black outline-none" />
                  </div>

                   {/* NOVOS CAMPOS OPCIONAIS (Mas salvos) */}
                   <div>
                    <label className="text-xs font-bold text-gray-500 ml-1">CPF (Opcional)</label>
                    <input name="docNumber" value={formData.docNumber} onChange={handleChange} placeholder="000.000.000-00" className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-black outline-none" />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 ml-1">E-mail (Opcional - Para NF)</label>
                    <input name="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-black outline-none" />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 ml-1">Endereço Completo *</label>
                    <input name="address" value={formData.address} onChange={handleChange} placeholder="Rua, Número, Complemento" className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-black outline-none" />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 ml-1">Bairro *</label>
                    <input name="neighborhood" value={formData.neighborhood} onChange={handleChange} placeholder="Ex: Centro" className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-black outline-none" />
                  </div>
                </div>
                <div className="mt-4 bg-yellow-50 p-3 rounded-lg text-xs text-yellow-800 border border-yellow-200 text-center">
                  💡 Seus dados ficam salvos automaticamente para a próxima vez!
                </div>
              </div>
            </div>

            {/* DIREITA - PAGAMENTO E RESUMO */}
            <div className="w-full lg:w-96 h-fit sticky top-32">
              <div className="bg-white rounded-3xl p-6 border-2 border-black shadow-card">
                <h2 className="font-black text-xl mb-6 uppercase">Pagamento</h2>
                
                {/* Botões visuais - O Backend controla as opções reais agora */}
                <div className="flex gap-2 mb-6 opacity-80 pointer-events-none">
                  <button className="flex-1 py-3 rounded-xl border-2 border-black bg-yellow-400 font-bold text-sm">PIX</button>
                  <button className="flex-1 py-3 rounded-xl border-2 border-black bg-gray-100 text-gray-800 font-bold text-sm">CARTÃO</button>
                </div>
                <p className="text-xs text-center text-gray-500 mb-6 -mt-4">Escolha a forma de pagamento na próxima tela.</p>

                <div className="border-t-2 border-black pt-4 mb-6">
                  <div className="flex justify-between text-2xl font-black">
                    <span>TOTAL</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout} 
                  disabled={loading} 
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl border-2 border-black shadow-button active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                      PROCESSANDO...
                    </>
                  ) : (
                    <>
                      <span>IR PARA PAGAMENTO</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}