import React from 'react';
import { ProductCardProps } from '../../types';
import { formatCurrency } from '../../utils';
import { Button } from '../common';

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onEdit, 
  onDelete, 
  onAddToCart 
}) => {
  const handleAddToCart = () => {
    if (product.isActive && product.unitsInStock > 0) {
      onAddToCart(product);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
          product.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {product.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <p className="text-2xl font-bold text-blue-600">{formatCurrency(product.unitPrice)}</p>
        <p className={`text-sm ${product.unitsInStock <= 5 && product.unitsInStock > 0 ? 'text-yellow-600' : 'text-gray-600'}`}>
          Stock: {product.unitsInStock} units
          {product.unitsInStock <= 5 && product.unitsInStock > 0 && (
            <span className="ml-2 text-yellow-600 font-medium">Low Stock!</span>
          )}
          {product.unitsInStock === 0 && (
            <span className="ml-2 text-red-600 font-medium">Out of Stock</span>
          )}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleAddToCart}
          disabled={!product.isActive || product.unitsInStock === 0}
          size="sm"
          className="flex-1 min-w-0"
        >
          {product.unitsInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
        <Button 
          onClick={() => onEdit(product)} 
          variant="secondary" 
          size="sm"
        >
          Edit
        </Button>
        <Button 
          onClick={() => onDelete(product.id)} 
          variant="danger" 
          size="sm"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};