"use client";

import { useState, useEffect } from "react";

export default function Shop({ products }: { products: any[] }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla o Modal
  const [loading, setLoading] = useState(false);

  // 👇 ESTADO DO CLIENTE (Com memória)
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",      // Novo
    docNumber: "",  // CPF (Novo)
    address: "",
    neighborhood: ""
  });

  // 1. CARREGAR DADOS SALVOS AO ABRIR (Memória do Celular)
  useEffect(() => {
    const savedData = localStorage.getItem("loop_customer_data");
    if (savedData) {
      setCustomer(JSON.parse(savedData));
    }
  }, []);

  // 2. SALVAR DADOS ENQUANTO DIGITA (Auto-Save)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newData = { ...customer, [name]: value };
    setCustomer(newData);
    localStorage.setItem("loop_customer_data", JSON.stringify(newData));
  };

  const clearCart = () => setCart([]);

  const addToCart = (product: any) => {
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      setCart(cart.map((item) => 
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // 3. CHECKOUT REAL (Envia os dados do formulário)
  const handleCheckout = async () => {
    if (!customer.name || !customer.phone) {
      alert("Por favor, preencha pelo menos Nome e Telefone/Zap!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          customer // Envia o objeto customer completo (com email/cpf se tiver)
        }),
      });

      const data = await res.json();

      if (data.url) {
        // Redireciona para o link de pagamento do MP (Opcional, se quiser QR Code na tela avisa)
        // Se for QR Code direto (Pix Copy Paste), podemos mostrar num alert ou outro modal
        console.log("💰 Link de Pagamento:", data.url);
        window.location.href = data.url; // Manda o cliente pro Mercado Pago
        clearCart(); 
      } else if (data.qr_code) {
         // Caso sua API retorne o hash do Pix direto
         alert(`Copie e Cole o PIX no seu banco:\n\n${data.qr_code}`);
         clearCart();
         setIsModalOpen(false);
      } else {
        alert("Erro ao criar pedido. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 pb-24">
      {/* Cabeçalho */}
      <header className="bg-pink-600 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🍩 Loop Donuts</h1>
          <div className="bg-white text-pink-600 px-4 py-2 rounded-full font-bold shadow-sm text-sm">
            🛒 {cart.reduce((acc, item) => acc + item.quantity, 0)} | R$ {total.toFixed(2)}
          </div>
        </div>
      </header>

      {/* Vitrine */}
      <main className="max-w-6xl mx-auto px-4 pt-40 md:pt-32 md:px-6 md:pb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          Cardápio Fresquinho
        </h2>

        {products.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 bg-white p-8 rounded-xl shadow-sm">
            <p className="text-xl font-bold mb-2">A vitrine está vazia... 😢</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                <div className="h-48 overflow-hidden bg-gray-100 relative">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-4xl">🍩</div>
                  )}
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold tracking-widest backdrop-blur-sm">
                      ESGOTADO
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 flex-grow">{product.description || "Delicioso donut artesanal"}</p>
                  
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-xl font-bold text-pink-600">
                      R$ {Number(product.price).toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock <= 0}
                      className={`px-4 py-2 rounded-lg font-bold text-white transition-all active:scale-95 ${
                        product.stock > 0 
                          ? "bg-pink-500 hover:bg-pink-600 shadow-md" 
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {product.stock > 0 ? "Comprar +" : "Indisp."}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Botão Flutuante (Abre o Modal) */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-3 px-6 rounded-full shadow-2xl animate-bounce hover:animate-none transition-transform hover:scale-105 flex items-center gap-2"
          >
            <span>Finalizar</span>
            <span className="bg-green-700 px-2 py-0.5 rounded text-sm">R$ {total.toFixed(2)}</span>
            <span>🚀</span>
          </button>
        </div>
      )}

      {/* 👇 MODAL DE CHECKOUT (O Formulário Inteligente) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Cabeçalho do Modal */}
            <div className="bg-pink-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">📝 Dados de Entrega</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-pink-700 p-1 rounded">✖</button>
            </div>

            {/* Corpo do Modal */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Seu Nome *</label>
                <input 
                  name="name"
                  value={customer.name}
                  onChange={handleInputChange}
                  placeholder="Ex: João Silva"
                  className="w-full border-2 border-gray-200 rounded-lg p-2 focus:border-pink-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp / Telefone *</label>
                <input 
                  name="phone"
                  value={customer.phone}
                  onChange={handleInputChange}
                  placeholder="(32) 99999-9999"
                  className="w-full border-2 border-gray-200 rounded-lg p-2 focus:border-pink-500 outline-none"
                />
              </div>

              {/* Campos Opcionais (Mas salvos para NF e MP) */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">CPF (Opcional)</label>
                  <input 
                    name="docNumber"
                    value={customer.docNumber}
                    onChange={handleInputChange}
                    placeholder="123.456.789-00"
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-pink-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">E-mail (Opcional)</label>
                  <input 
                    name="email"
                    value={customer.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-pink-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Endereço de Entrega</label>
                <input 
                  name="address"
                  value={customer.address}
                  onChange={handleInputChange}
                  placeholder="Rua, Número e Complemento"
                  className="w-full border-2 border-gray-200 rounded-lg p-2 focus:border-pink-500 outline-none"
                />
              </div>

               <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Bairro</label>
                <input 
                  name="neighborhood"
                  value={customer.neighborhood}
                  onChange={handleInputChange}
                  placeholder="Ex: Centro"
                  className="w-full border-2 border-gray-200 rounded-lg p-2 focus:border-pink-500 outline-none"
                />
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg text-xs text-yellow-800 border border-yellow-200">
                💡 Seus dados ficam salvos para a próxima compra!
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
              <span className="font-bold text-lg text-gray-800">Total: R$ {total.toFixed(2)}</span>
              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? "Processando..." : "✅ Confirmar Pedido"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}