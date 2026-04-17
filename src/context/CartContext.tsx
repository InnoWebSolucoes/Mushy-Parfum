"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem, CartState, Product, SizeOption } from "@/types";

type CartAction =
  | { type: "ADD_ITEM"; product: Product; size: SizeOption }
  | { type: "REMOVE_ITEM"; productId: string; ml: number }
  | { type: "UPDATE_QUANTITY"; productId: string; ml: number; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "LOAD_CART"; items: CartItem[] };

const initialState: CartState = { items: [], isOpen: false };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.product.id === action.product.id && i.selectedSize.ml === action.size.ml
      );
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            i.product.id === action.product.id && i.selectedSize.ml === action.size.ml
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        isOpen: true,
        items: [...state.items, { product: action.product, selectedSize: action.size, quantity: 1 }],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.product.id === action.productId && i.selectedSize.ml === action.ml)
        ),
      };
    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => !(i.product.id === action.productId && i.selectedSize.ml === action.ml)
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId && i.selectedSize.ml === action.ml
            ? { ...i, quantity: action.quantity }
            : i
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    case "LOAD_CART":
      return { ...state, items: action.items };
    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  addItem: (product: Product, size: SizeOption) => void;
  removeItem: (productId: string, ml: number) => void;
  updateQuantity: (productId: string, ml: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mushy-cart");
      if (saved) {
        dispatch({ type: "LOAD_CART", items: JSON.parse(saved) });
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("mushy-cart", JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, i) => sum + i.selectedSize.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        state,
        addItem: (product, size) => dispatch({ type: "ADD_ITEM", product, size }),
        removeItem: (productId, ml) => dispatch({ type: "REMOVE_ITEM", productId, ml }),
        updateQuantity: (productId, ml, quantity) =>
          dispatch({ type: "UPDATE_QUANTITY", productId, ml, quantity }),
        clearCart: () => dispatch({ type: "CLEAR_CART" }),
        openCart: () => dispatch({ type: "OPEN_CART" }),
        closeCart: () => dispatch({ type: "CLOSE_CART" }),
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
