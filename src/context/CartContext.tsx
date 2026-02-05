"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Tipagem do Item
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// O que o Contexto oferece para o site
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  total: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 1. Carregar carrinho salvo ao abrir o site
  useEffect(() => {
    const savedCart = localStorage.getItem("loop-cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // 2. Salvar carrinho sempre que mudar
  useEffect(() => {
    localStorage.setItem("loop-cart", JSON.stringify(cart));
  }, [cart]);

  // Função de Adicionar
  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Função de Remover
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  // Cálculos automáticos
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook para usar o carrinho em qualquer lugar
export const useCart = () => useContext(CartContext);