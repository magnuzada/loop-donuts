"use client"; // Isso diz que aqui tem interatividade (botões, state)

import { useState } from "react";

export default function Shop({ products }: { products: any[] }) {
  const [cart, setCart] = useState<any[]>([]);

  // Adicionar ao Carrinho
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

  // Funções do Checkout (simplificadas para o exemplo)
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Seu carrinho está vazio!");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          customer: { name: "Cliente Teste", email: "teste@loop.com" } // Dados fixos para teste
        }),
      });

      const data = await res.json();

      if (data.qr_code) {
        console.log("💰 PIX GERADO COM SUCESSO:", data.qr_code);
        console.log("COPIA E COLA:", data.qr_code_base64);
        alert(`Pedido #${data.orderId} criado! Abra o Console (F12) para pegar o código Pix.`);
        clearCart(); // Limpa o carrinho após sucesso
      } else {
        console.error("Erro no checkout:", data);
        alert("Erro ao gerar Pix. Verifique o console.");
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Cabeçalho */}
      <header className="bg-pink-600 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🍩 Loop Donuts</h1>
          <div className="bg-white text-pink-600 px-4 py-2 rounded-full font-bold">
            🛒 {cart.length} itens | R$ {total.toFixed(2)}
          </div>
        </div>
      </header>

      {/* Vitrine de Produtos */}
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Cardápio Fresquinho
        </h2>

        {products.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-xl">Nenhum donut cadastrado ainda... 😢</p>
            <p>Vá em <code className="bg-gray-200 p-1 rounded">/admin/produtos</code> para adicionar!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 overflow-hidden bg-gray-200 relative">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-4xl">🍩</div>
                  )}
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">
                      ESGOTADO
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">Estoque: {product.stock}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-pink-600">
                      R$ {product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock <= 0}
                      className={`px-4 py-2 rounded-lg font-bold text-white transition-colors ${
                        product.stock > 0 
                          ? "bg-pink-500 hover:bg-pink-600" 
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {product.stock > 0 ? "Adicionar +" : "Sem Estoque"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botão Flutuante de Checkout */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6">
            <button 
              onClick={handleCheckout}
              className="bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-4 px-8 rounded-full shadow-2xl animate-bounce"
            >
              Finalizar Pedido (R$ {total.toFixed(2)}) 🚀
            </button>
          </div>
        )}
      </main>
    </div>
  );
}