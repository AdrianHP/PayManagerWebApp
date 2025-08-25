import React from 'react';
import { OrderDetailsProps } from '../../types';
import { formatCurrency, ORDER_STATUS } from '../../utils';
import { Modal } from '../common';

export const OrderDetails: React.FC<OrderDetailsProps> = ({ 
  order, 
  isOpen, 
  onClose 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case ORDER_STATUS.PAID: 
        return 'text-green-800 bg-green-100 border-green-200';
      case ORDER_STATUS.PENDING: 
        return 'text-yellow-800 bg-yellow-100 border-yellow-200';
      case ORDER_STATUS.CANCELLED: 
        return 'text-red-800 bg-red-100 border-red-200';
      case ORDER_STATUS.PROCESSING: 
        return 'text-blue-800 bg-blue-100 border-blue-200';
      case ORDER_STATUS.SHIPPED: 
        return 'text-purple-800 bg-purple-100 border-purple-200';
      case ORDER_STATUS.DELIVERED: 
        return 'text-indigo-800 bg-indigo-100 border-indigo-200';
      default: 
        return 'text-gray-800 bg-gray-100 border-gray-200';
    }
  };

  const subtotal = order.products.reduce((sum, product) => sum + product.unitPrice, 0);
  const totalFees = order.fees.reduce((sum, fee) => sum + fee.amount, 0);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Order #${order.id} Details`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Order Status and Info */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Order ID:</span> {order.id}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {order.amount ? formatCurrency(order.amount) : (
                <span className="text-gray-500 text-lg">Processing...</span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {order.amount ? 'Total Amount' : 'Amount being calculated'}
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Payment Information</h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600 block">Payment Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              
              {order.providerName && (
                <div>
                  <span className="text-sm text-gray-600 block">Provider</span>
                  <span className="font-medium">{order.providerName}</span>
                </div>
              )}
              
              {order.providerOrderId && (
                <div className="sm:col-span-2">
                  <span className="text-sm text-gray-600 block">Provider Order ID</span>
                  <span className="font-mono text-sm bg-white px-2 py-1 rounded border">
                    {order.providerOrderId}
                  </span>
                </div>
              )}
            </div>
            
            {!order.providerName && order.orderStatus === ORDER_STATUS.PENDING && (
              <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-yellow-800">
                  Payment provider assignment is in progress
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Products */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            Products ({order.products.length})
          </h4>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="max-h-60 overflow-y-auto">
              {order.products.map((product, index) => (
                <div key={product.id} className={`p-4 flex justify-between items-center ${
                  index !== order.products.length - 1 ? 'border-b border-gray-200' : ''
                }`}>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 truncate">{product.name}</h5>
                    <p className="text-sm text-gray-600">
                      Unit Price: {formatCurrency(product.unitPrice)}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-gray-500">
                        Stock: {product.unitsInStock} units
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-gray-900">
                      {formatCurrency(product.unitPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Subtotal */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({order.products.length} items):</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fees */}
        {order.fees && order.fees.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Fees & Charges</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              {order.fees.map((fee, index) => (
                <div key={index} className="flex justify-between py-2">
                  <span className="text-sm text-gray-700">{fee.name}</span>
                  <span className="text-sm font-medium">{formatCurrency(fee.amount)}</span>
                </div>
              ))}
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Fees:</span>
                  <span className="font-medium">{formatCurrency(totalFees)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {totalFees > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fees:</span>
                  <span>{formatCurrency(totalFees)}</span>
                </div>
              )}
              <div className="border-t border-blue-200 pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {order.amount ? formatCurrency(order.amount) : (
                      <span className="text-gray-500 text-base">Calculating...</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {!order.amount && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Processing in Progress</p>
                <p>The final amount and provider details are still being calculated by our backend system. This information will be available shortly.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};