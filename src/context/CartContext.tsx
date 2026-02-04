"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// 1. Definindo o formato do Item
interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// 2. Definindo o que o Contexto oferece (Adicionei clearCart aqui)
interface CartContextType {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void; // <--- NOVO!
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Carrega do LocalStorage ao abrir
  useEffect(() => {
    const storedCart = localStorage.getItem("loop-cart");
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);

  // Salva no LocalStorage sempre que muda
  useEffect(() => {
    localStorage.setItem("loop-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product: any) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseQuantity = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // 3. A Função Nova que zera tudo
  const clearCart = () => {
    setItems([]); 
    localStorage.removeItem("loop-cart");
  };

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addToCart, 
        removeFromCart, 
        increaseQuantity, 
        decreaseQuantity, 
        clearCart // <--- NÃO ESQUEÇA DE EXPORTAR ELA AQUI
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};