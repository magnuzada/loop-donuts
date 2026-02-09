"use client";

import { useState } from "react";

export default function Shop({ products }: { products: any[] }) {
  const [cart, setCart] = useState<any[]>([]);

  // 👇 SUA FUNÇÃO NOVA (Perfeita!)
  const clearCart = () => {
    setCart([]); 
  };

  // 👇 Lógica de Adicionar (Garantindo que funcione)
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

  // Cálculo do Total
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Checkout
  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Seu carrinho está vazio!");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          // 👇 AQUI ESTAVA O ERRO! Adicionei os campos obrigatórios:
          customer: { 
            name: "Cliente Teste", 
            email: "teste@loop.com",
            phone: "32999999999",         // <--- Adicionado
            address: "Rua de Teste, 123", // <--- Adicionado
            neighborhood: "Centro"        // <--- Adicionado (O Banco exige!)
          }
        }),
      });

      const data = await res.json();

      if (data.qr_code) {
        console.log("💰 PIX GERADO:", data.qr_code);
        alert(`Pedido #${data.orderId} criado! Pague com o Pix no Console (F12).`);
        clearCart(); // Limpa o carrinho
      } else {
        console.error("Erro no checkout:", data);
        alert("Erro ao gerar Pix. Veja o console.");
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      alert("Erro de conexão.");
    }
  };

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Cabeçalho */}
      <header className="bg-pink-600 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🍩 Loop Donuts</h1>
          <div className="bg-white text-pink-600 px-4 py-2 rounded-full font-bold shadow-sm">
            🛒 {cart.reduce((acc, item) => acc + item.quantity, 0)} itens | R$ {total.toFixed(2)}
          </div>
        </div>
      </header>

      {/* Vitrine */}
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Cardápio Fresquinho
        </h2>

        {products.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 bg-white p-8 rounded-xl shadow-sm">
            <p className="text-xl font-bold mb-2">A vitrine está vazia... 😢</p>
            <p>Cadastre produtos em <code className="bg-gray-100 px-2 py-1 rounded text-pink-600 font-mono">/admin/produtos</code></p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="h-48 overflow-hidden bg-gray-100 relative">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-4xl">🍩</div>
                  )}
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold tracking-widest backdrop-blur-sm">
                      ESGOTADO
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">Disponível: {product.stock}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-pink-600">
                      R$ {product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock <= 0}
                      className={`px-4 py-2 rounded-lg font-bold text-white transition-all active:scale-95 ${
                        product.stock > 0 
                          ? "bg-pink-500 hover:bg-pink-600 shadow-md hover:shadow-lg" 
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {product.stock > 0 ? "Adicionar +" : "Indisponível"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botão Flutuante */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <button 
              onClick={handleCheckout}
              className="bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-4 px-8 rounded-full shadow-2xl animate-bounce hover:animate-none transition-transform hover:scale-105 flex items-center gap-2"
            >
              <span>Finalizar</span>
              <span className="bg-green-700 px-2 py-0.5 rounded text-sm">R$ {total.toFixed(2)}</span>
              <span>🚀</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}