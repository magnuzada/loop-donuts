"use client";

import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Trash2, ShoppingBag, Plus, Minus, X, MapPin, User, CreditCard } from "lucide-react"; 
import Link from "next/link";
import { useState } from "react"; // <--- Importamos useState para controlar o formulário

export default function CartPage() {
  const { items, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  
  // --- ESTADOS DO FORMULÁRIO ---
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    neighborhood: "",
    payment: "Pix"
  });

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // --- FUNÇÃO PARA ENVIAR PEDIDO NO WHATSAPP ---
  const handleFinalize = () => {
    // 1. Formata os Itens
    const itemsList = items.map(item => 
      `🍩 ${item.quantity}x ${item.name}`
    ).join("%0A"); // %0A é quebra de linha no link

    // 2. Formata a Mensagem Final
    const message = 
      `*NOVO PEDIDO - LOOP DONUTS* 🍩%0A%0A` +
      `*Itens:*%0A${itemsList}%0A%0A` +
      `*Total: R$ ${total.toFixed(2).replace('.', ',')}*%0A` +
      `------------------------------%0A` +
      `*Dados de Entrega:*%0A` +
      `👤 Nome: ${customer.name}%0A` +
      `📍 Endereço: ${customer.address} - ${customer.neighborhood}%0A` +
      `📱 Telefone: ${customer.phone}%0A` +
      `💳 Pagamento: ${customer.payment}`;

    // 3. Cria o Link do Zap (Troque pelo seu número real depois)
    const phoneNumber = "5532999999999"; // Ex: 55 + DDD + Numero
    const link = `https://wa.me/${phoneNumber}?text=${message}`;

    // 4. Abre o WhatsApp
    window.open(link, "_blank");
  };

  return (
    <main className="min-h-screen bg-cream flex flex-col">
      <NavBar />

      <div className="flex-grow pt-48 md:pt-60 pb-16 px-6 container mx-auto relative">
        
        <h1 className="font-display text-5xl md:text-6xl mb-12 flex items-center gap-4 text-black drop-shadow-[3px_3px_0px_rgba(255,255,255,1)]">
          <ShoppingBag className="w-12 h-12 md:w-16 md:h-16" />
          SEU CARRINHO
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 border-2 border-black border-dashed rounded-3xl bg-white/50">
            <p className="font-display text-2xl text-gray-400 mb-6">
              Sua caixa de donuts está vazia... 🍩💨
            </p>
            <Link 
              href="/menu" 
              className="inline-block bg-cta px-8 py-3 rounded-pill border-2 border-black font-display hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
            >
              VOLTAR AO MENU
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            
            {/* --- LISTA DE PRODUTOS --- */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border-2 border-black shadow-sm transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  
                  <div className="w-24 h-24 bg-cream rounded-xl overflow-hidden border border-black/10 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-grow text-center md:text-left">
                    <h3 className="font-display text-xl">{item.name}</h3>
                    <p className="font-mono text-gray-500 text-sm">Unitário: R$ {item.price.toFixed(2).replace('.', ',')}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-cream rounded-full border-2 border-black overflow-hidden">
                      <button 
                        onClick={() => decreaseQuantity(item.id)}
                        className="p-3 hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} strokeWidth={3} />
                      </button>
                      
                      <span className="font-mono font-bold w-8 text-center">{item.quantity}</span>
                      
                      <button 
                        onClick={() => increaseQuantity(item.id)}
                        className="p-3 hover:bg-black hover:text-white transition-colors"
                      >
                        <Plus size={16} strokeWidth={3} />
                      </button>
                    </div>

                    <p className="font-mono font-bold text-lg min-w-[80px] text-right">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors ml-2"
                    title="Remover item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                </div>
              ))}
            </div>

            {/* --- RESUMO DO PEDIDO --- */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-3xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-40">
                <h2 className="font-display text-2xl mb-6 pb-4 border-b-2 border-black/10">RESUMO</h2>
                
                <div className="space-y-3 mb-6 font-mono text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entrega</span>
                    <span className="text-green-600">A Combinar</span>
                  </div>
                </div>

                <div className="flex justify-between font-display text-2xl mb-8 pt-4 border-t-2 border-black">
                  <span>TOTAL</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>

                <button 
                  onClick={() => setIsCheckoutOpen(true)} // <--- ABRE O MODAL
                  className="w-full bg-black text-white font-display text-xl py-4 rounded-xl hover:bg-cta hover:text-black border-2 border-black transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  FINALIZAR COMPRA
                </button>
                
                <Link href="/menu" className="block text-center mt-4 font-mono text-sm underline hover:text-cta">
                  Continuar comprando
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* --- MODAL DE CHECKOUT (FORMULÁRIO) --- */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 relative animate-in fade-in zoom-in duration-300">
            
            {/* Botão Fechar */}
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="font-display text-3xl mb-6 flex items-center gap-2">
              <MapPin className="text-cta fill-black" />
              ONDE ENTREGAMOS?
            </h2>

            <form className="space-y-4 font-body" onSubmit={(e) => { e.preventDefault(); handleFinalize(); }}>
              
              <div>
                <label className="block text-sm font-bold mb-1 ml-1">Seu Nome</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: João Silva"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-black focus:outline-none focus:ring-4 focus:ring-cta/50"
                    value={customer.name}
                    onChange={(e) => setCustomer({...customer, name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 ml-1">Telefone / WhatsApp</label>
                <input 
                  required
                  type="tel" 
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-3 rounded-xl border-2 border-black focus:outline-none focus:ring-4 focus:ring-cta/50"
                  value={customer.phone}
                  onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold mb-1 ml-1">Rua / Endereço</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Rua das Flores, 123"
                    className="w-full px-4 py-3 rounded-xl border-2 border-black focus:outline-none focus:ring-4 focus:ring-cta/50"
                    value={customer.address}
                    onChange={(e) => setCustomer({...customer, address: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 ml-1">Bairro</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Centro"
                    className="w-full px-4 py-3 rounded-xl border-2 border-black focus:outline-none focus:ring-4 focus:ring-cta/50"
                    value={customer.neighborhood}
                    onChange={(e) => setCustomer({...customer, neighborhood: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 ml-1">Forma de Pagamento</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <select 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-black focus:outline-none focus:ring-4 focus:ring-cta/50 appearance-none bg-white"
                    value={customer.payment}
                    onChange={(e) => setCustomer({...customer, payment: e.target.value})}
                  >
                    <option value="Pix">Pix (Chave Aleatória)</option>
                    <option value="Cartão de Crédito">Cartão de Crédito (Maquininha)</option>
                    <option value="Cartão de Débito">Cartão de Débito</option>
                    <option value="Dinheiro">Dinheiro</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-cta text-black font-display text-xl py-4 rounded-xl border-2 border-black mt-6 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                ENVIAR PEDIDO 🚀
              </button>

            </form>

          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}