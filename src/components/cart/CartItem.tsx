import React from "react";
import type { CartItem as CartItemType } from "../../types";
import { formatCurrency } from "../../utils";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity >= 1 && newQuantity <= item.product.unitsInStock) {
      onUpdateQuantity(item.product.id, newQuantity);
    }
  };

  const totalPrice = item.product.unitPrice * item.quantity;

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">
          {item.product.name}
        </h4>
        <p className="text-sm text-gray-600">
          {formatCurrency(item.product.unitPrice)} each
        </p>
        {item.quantity === item.product.unitsInStock && (
          <p className="text-xs text-yellow-600 mt-1">Maximum stock reached</p>
        )}
      </div>

      <div className="flex items-center space-x-3 ml-4">
        {/* Quantity Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={item.quantity <= 1}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-gray-700 font-medium"
            aria-label="Decrease quantity"
          >
            -
          </button>

          <span className="w-8 text-center font-medium">{item.quantity}</span>

          <button
            onClick={() => handleQuantityChange(1)}
            disabled={item.quantity >= item.product.unitsInStock}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-gray-700 font-medium"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Total Price */}
        <div className="text-right min-w-0">
          <p className="font-medium text-gray-900">
            {formatCurrency(totalPrice)}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.product.id)}
          className="text-red-600 hover:text-red-800 font-medium text-sm whitespace-nowrap ml-2"
          aria-label={`Remove ${item.product.name} from cart`}
        >
          Remove
        </button>
      </div>
    </div>
  );
};
