"use client";

import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
// TROQUE A LINHA 6 POR ESTA:
import { Trash2, ShoppingBag, Plus, Minus, X, Copy, CheckCircle, User, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react"; 

export default function CartPage() {
  const { items, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = useCart();
  
  // --- ESTADOS DO FORMULÁRIO ---
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para guardar o Sucesso
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    neighborhood: "",
    payment: "Pix"
  });

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // --- FUNÇÃO DE ENVIAR PEDIDO ---
  const handleFinalize = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: items, 
          customer: customer, 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // SUCESSO!
        clearCart(); // Limpa o carrinho
        setOrderSuccess(data); // Guarda os dados do Pix para mostrar na tela
        window.scrollTo(0, 0); // Sobe a tela
      } else {
        alert("Erro: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- TELA DE SUCESSO (Renderização Condicional) ---
  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-4 border-green-100">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <h1 className="text-3xl font-display text-deep-brown mb-2">Pedido Recebido!</h1>
          <p className="text-gray-600 mb-6">
            Seu pedido <strong>#{orderSuccess.orderId.slice(-6)}</strong> foi gerado com sucesso.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 mb-6">
            <p className="text-sm text-gray-500 mb-2 font-bold">Copie e cole no seu banco:</p>
            <textarea 
              readOnly 
              value={orderSuccess.pix.qrCode} 
              className="w-full h-24 text-xs bg-white p-2 border rounded resize-none text-gray-600 font-mono"
            />
            <button 
              onClick={() => {
                navigator.clipboard.writeText(orderSuccess.pix.qrCode);
                alert("Código Pix copiado!");
              }}
              className="mt-2 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-bold"
            >
              <Copy size={18} />
              Copiar Código Pix
            </button>
          </div>

          <div className="text-xs text-gray-400 mb-6">
            *Como é um ambiente de teste, o pagamento será aprovado automaticamente.
          </div>

          <Link 
            href="/" 
            className="block w-full bg-deep-brown text-white py-3 rounded-full font-bold hover:bg-brown-700 transition"
          >
            Voltar para Loja
          </Link>
        </div>
      </main>
    );
  }

  // --- TELA DO CARRINHO (Normal) ---
  return (
    <main className="min-h-screen bg-cream flex flex-col">
      <NavBar />
      
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-display text-deep-brown mb-8 text-center">Seu Carrinho 🍩</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-6">Seu carrinho está vazio :(</p>
            <Link href="/" className="bg-brand-pink text-white px-8 py-3 rounded-full font-bold hover:bg-pink-600 transition">
              Ver Donuts
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Lista de Itens */}
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                  <div className="bg-pink-100 p-2 rounded-lg">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-deep-brown">{item.name}</h3>
                    <p className="text-brand-pink font-bold">R$ {item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
                    <button onClick={() => decreaseQuantity(item.id)} className="p-1 hover:text-red-500">
                      <Minus size={14} />
                    </button>
                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)} className="p-1 hover:text-green-500">
                      <Plus size={14} />
                    </button>
                  </div>

                  <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 p-2">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Resumo do Pedido */}
            <div className="bg-white p-6 rounded-2xl shadow-lg h-fit">
              <h2 className="text-xl font-bold text-deep-brown mb-4">Resumo</h2>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Subtotal</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-6 text-gray-600">
                <span>Entrega</span>
                <span className="text-green-600 font-bold">Grátis</span>
              </div>
              <div className="border-t border-dashed border-gray-200 my-4"></div>
              <div className="flex justify-between text-2xl font-bold text-deep-brown mb-6">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>

              <button 
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL DE CHECKOUT --- */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-display text-deep-brown mb-6">Finalizar Pedido</h2>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleFinalize(); }}>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Seu Nome</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: Homer Simpson"
                    className="w-full pl-10 p-3 bg-gray-50 rounded-lg border focus:border-brand-pink focus:ring-2 focus:ring-pink-200 outline-none transition"
                    onChange={(e) => setCustomer({...customer, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">WhatsApp</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="(00) 00000-0000"
                    className="w-full p-3 bg-gray-50 rounded-lg border focus:border-brand-pink outline-none"
                    onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Bairro</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Centro"
                    className="w-full p-3 bg-gray-50 rounded-lg border focus:border-brand-pink outline-none"
                    onChange={(e) => setCustomer({...customer, neighborhood: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Endereço Completo</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    required
                    type="text" 
                    placeholder="Rua, Número e Complemento"
                    className="w-full pl-10 p-3 bg-gray-50 rounded-lg border focus:border-brand-pink outline-none"
                    onChange={(e) => setCustomer({...customer, address: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-pink text-white py-4 rounded-xl font-bold text-lg hover:bg-pink-600 transition mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processando..." : `Pagar R$ ${total.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}