import React from 'react';
import { OrderCardProps } from '../../types';
import { formatCurrency, ORDER_STATUS } from '../../utils';
import { Button } from '../common';

export const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  onViewDetails, 
  onPayOrder, 
  onCancelOrder, 
  onDeleteOrder 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case ORDER_STATUS.PAID: 
        return 'bg-green-100 text-green-800 border-green-200';
      case ORDER_STATUS.PENDING: 
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case ORDER_STATUS.CANCELLED: 
        return 'bg-red-100 text-red-800 border-red-200';
      case ORDER_STATUS.PROCESSING: 
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case ORDER_STATUS.SHIPPED: 
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case ORDER_STATUS.DELIVERED: 
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: 
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case ORDER_STATUS.PAID:
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case ORDER_STATUS.PENDING:
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case ORDER_STATUS.CANCELLED:
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const canBePaid = order.orderStatus === ORDER_STATUS.PENDING;
  const canBeCancelled = order.orderStatus !== ORDER_STATUS.CANCELLED && order.orderStatus !== ORDER_STATUS.PAID;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
          <p className="text-sm text-gray-600">
            {order.products.length} {order.products.length === 1 ? 'product' : 'products'}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center ${getStatusColor(order.orderStatus)}`}>
          {getStatusIcon(order.orderStatus)}
          {order.orderStatus}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <p className="text-2xl font-bold text-blue-600">
          {order.amount ? formatCurrency(order.amount) : (
            <span className="text-gray-500 text-lg">Processing...</span>
          )}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Payment:</span> {order.paymentMethod}
        </p>
        {order.providerName && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Provider:</span> {order.providerName}
          </p>
        )}
        {order.providerOrderId && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Provider ID:</span> {order.providerOrderId}
          </p>
        )}
      </div>

      {/* Product Preview */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">Products:</div>
        <div className="space-y-1">
          {order.products.slice(0, 2).map((product) => (
            <div key={product.id} className="text-sm text-gray-700 flex justify-between">
              <span className="truncate">{product.name}</span>
              <span>{formatCurrency(product.unitPrice)}</span>
            </div>
          ))}
          {order.products.length > 2 && (
            <div className="text-sm text-gray-500">
              +{order.products.length - 2} more products
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={() => onViewDetails(order)} 
          variant="secondary" 
          size="sm"
        >
          View Details
        </Button>
        
        {canBePaid && (
          <Button 
            onClick={() => onPayOrder(order.id)} 
            size="sm"
          >
            Pay Now
          </Button>
        )}
        
        {canBeCancelled && (
          <Button 
            onClick={() => onCancelOrder(order.id)} 
            variant="danger" 
            size="sm"
          >
            Cancel
          </Button>
        )}
        
        <Button 
          onClick={() => onDeleteOrder(order.id)} 
          variant="danger" 
          size="sm"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};