"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Product {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  quantity?: number;
}

interface CartContextData {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  total: number;
  cartCount: number;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);

  // Carrega do LocalStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("@LoopDonuts:cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Salva no LocalStorage
  useEffect(() => {
    localStorage.setItem("@LoopDonuts:cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      // Tenta achar se esse produto JÁ existe no carrinho
      const existingItemIndex = prevCart.findIndex((item) => {
        // 1. Tenta comparar pelo ID (se existir)
        const itemId = item._id || item.id;
        const productId = product._id || product.id;
        
        if (itemId && productId && itemId === productId) {
          return true; // É o mesmo ID!
        }

        // 2. SALVA-VIDAS: Se não tiver ID, compara pelo NOME exato
        if (item.name === product.name) {
          return true; // É o mesmo Nome!
        }

        return false; // São produtos diferentes
      });

      // LÓGICA DE ADIÇÃO
      if (existingItemIndex >= 0) {
        // CENÁRIO A: Produto Repetido -> Aumenta Quantidade
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity = (newCart[existingItemIndex].quantity || 1) + 1;
        return newCart;
      } else {
        // CENÁRIO B: Produto Novo -> Adiciona na Lista
        // Gera um ID temporário se não tiver, pra evitar bugs futuros
        const safeProduct = {
          ...product,
          id: product._id || product.id || `temp-${Date.now()}`,
          quantity: 1
        };
        return [...prevCart, safeProduct];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => (item._id || item.id) !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((acc, item) => {
    return acc + item.price * (item.quantity || 1);
  }, 0);

  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);