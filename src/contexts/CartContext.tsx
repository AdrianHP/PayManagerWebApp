import React, { createContext, useContext, useReducer } from "react";
import type {
  CartState,
  CartAction,
  CartContextType,
  ProductDTO,
  CartItem,
} from "../types";

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.items.find(
        (item) => item.product.id === action.product.id
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.product.id === action.product.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + action.quantity,
                  item.product.unitsInStock
                ),
              }
            : item
        );
        return {
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
      } else {
        const quantity = Math.min(action.quantity, action.product.unitsInStock);
        const newItems = [
          ...state.items,
          { product: action.product, quantity },
        ];
        return {
          items: newItems,
          total: calculateTotal(newItems),
        };
      }
    }

    case "REMOVE_FROM_CART": {
      const newItems = state.items.filter(
        (item) => item.product.id !== action.productId
      );
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    }

    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        const newItems = state.items.filter(
          (item) => item.product.id !== action.productId
        );
        return {
          items: newItems,
          total: calculateTotal(newItems),
        };
      }

      const newItems = state.items.map((item) =>
        item.product.id === action.productId
          ? {
              ...item,
              quantity: Math.min(action.quantity, item.product.unitsInStock),
            }
          : item
      );
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    }

    case "CLEAR_CART":
      return { items: [], total: 0 };

    default:
      return state;
  }
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce(
    (total, item) => total + item.product.unitPrice * item.quantity,
    0
  );
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  const addToCart = (product: ProductDTO, quantity: number = 1) => {
    if (product.unitsInStock > 0 && product.isActive) {
      dispatch({ type: "ADD_TO_CART", product, quantity });
    }
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{ state, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
