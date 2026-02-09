"use client";

import { useCart } from "@/context/CartContext";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Trash2, ArrowRight, Copy, CheckCircle, CreditCard, Banknote } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [pixCode, setPixCode] = useState("");
  const [qrCodeImage, setQrCodeImage] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "", phone: "", address: "", neighborhood: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    alert("Código Pix copiado! 📋");
  };

  const handleCheckout = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Preencha os dados de entrega! 🚚");
      return;
    }
    if (paymentMethod !== "pix") {
      alert("Apenas Pix disponível para teste! 🍩");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, customer: formData }),
      });
      const data = await res.json();
      if (data.qr_code_base64) {
        setPixCode(data.qr_code);
        setQrCodeImage(data.qr_code_base64);
        setOrderSuccess(true);
        clearCart();
      } else {
        alert("Erro no Mercado Pago.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao processar.");
    } finally {
      setLoading(false);
    }
  };

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
            
            {/* ESQUERDA */}
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
                          {/* LISTAGEM PRINCIPAL */}
                          <p className="text-sm text-gray-500">{item.quantity}x R$ {item.price.toFixed(2)}</p>
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

              <div className="bg-white rounded-3xl p-6 border-2 border-black shadow-card">
                <h2 className="font-black text-xl mb-4 uppercase">Entrega</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="name" onChange={handleChange} placeholder="Seu Nome" className="p-3 border-2 border-gray-200 rounded-xl focus:border-black outline-none" />
                  <input name="phone" onChange={handleChange} placeholder="WhatsApp" className="p-3 border-2 border-gray-200 rounded-xl focus:border-black outline-none" />
                  <input name="address" onChange={handleChange} placeholder="Endereço" className="md:col-span-2 p-3 border-2 border-gray-200 rounded-xl focus:border-black outline-none" />
                  <input name="neighborhood" onChange={handleChange} placeholder="Bairro" className="md:col-span-2 p-3 border-2 border-gray-200 rounded-xl focus:border-black outline-none" />
                </div>
              </div>
            </div>

            {/* DIREITA - RESUMO ORGANIZADO */}
            <div className="w-full lg:w-96 h-fit sticky top-32">
              <div className="bg-white rounded-3xl p-6 border-2 border-black shadow-card">
                <h2 className="font-black text-xl mb-6 uppercase">Pagamento</h2>
                
                <div className="flex gap-2 mb-6">
                  <button className="flex-1 py-3 rounded-xl border-2 border-black bg-yellow-400 font-bold text-sm">PIX</button>
                  <button disabled className="flex-1 py-3 rounded-xl border-2 border-gray-100 text-gray-300 font-bold text-[10px]">CRÉDITO</button>
                </div>

                {/* --- AQUI ESTÁ A LISTA QUE VOCÊ QUERIA --- */}
                <div className="mb-6 border-t-2 border-dashed border-gray-200 pt-4 bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Resumo do Pedido</p>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {cart.map((item) => (
                      <div key={item.id || item._id} className="flex justify-between text-sm border-b border-gray-100 pb-1 last:border-0">
                        <span className="text-gray-600 truncate max-w-[180px]">
                          <span className="font-bold text-blue-600 mr-2">{item.quantity}x</span> 
                          {item.name}
                        </span>
                        <span className="font-mono text-gray-500 whitespace-nowrap">
                          R$ {(item.price * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t-2 border-black pt-4 mb-6">
                  <div className="flex justify-between text-2xl font-black">
                    <span>TOTAL</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <button onClick={handleCheckout} disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl border-2 border-black shadow-button active:translate-y-1 active:shadow-none transition-all disabled:opacity-50">
                  {loading ? "PROCESSANDO..." : "FINALIZAR PEDIDO"}
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