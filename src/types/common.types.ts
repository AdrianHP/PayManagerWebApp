import { ProductDTO } from "./product.types";

export interface BaseDTO<T> {
  id: T;
}

export interface CartItem {
  product: ProductDTO;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export type CartAction =
  | { type: "ADD_TO_CART"; product: ProductDTO; quantity: number }
  | { type: "REMOVE_FROM_CART"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" };

export interface CartContextType {
  state: CartState;
  addToCart: (product: ProductDTO, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}
