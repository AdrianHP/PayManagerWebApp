import React from "react";
import { useCart } from "../../hooks";
import { formatCurrency } from "../../utils";
import { Button } from "../common";
import { CartItem } from "./CartItem";

interface CartProps {
  onCreateOrder: () => void;
}

export const Cart: React.FC<CartProps> = ({ onCreateOrder }) => {
  const { state, updateQuantity, removeFromCart } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
            />
          </svg>
          Shopping Cart
        </h3>
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <p className="text-gray-600 mb-2">Your cart is empty</p>
          <p className="text-sm text-gray-500">
            Add some products to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-fit">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
        <span className="flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
            />
          </svg>
          Shopping Cart
        </span>
        <span className="text-sm font-normal text-gray-600">
          {state.items.length} {state.items.length === 1 ? "item" : "items"}
        </span>
      </h3>

      <div className="space-y-0 mb-4 max-h-96 overflow-y-auto">
        {state.items.map((item) => (
          <CartItem
            key={item.product.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-xl font-bold text-blue-600">
            {formatCurrency(state.total)}
          </span>
        </div>

        <Button onClick={onCreateOrder} className="w-full" size="lg">
          Create Order
        </Button>

        <p className="text-xs text-gray-500 text-center mt-2"></p>
      </div>
    </div>
  );
};
