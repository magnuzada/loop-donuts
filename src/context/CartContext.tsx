"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Definição do tipo do item
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Carregar do LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("loop-cart");
      if (savedCart) {
        try { setItems(JSON.parse(savedCart)); } catch (e) { console.error(e); }
      }
    }
  }, []);

  // Salvar no LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("loop-cart", JSON.stringify(items));
    }
  }, [items]);

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

// A EXPORTAÇÃO QUE O ERRO ESTÁ PEDINDO 👇
export const useCart = () => useContext(CartContext);