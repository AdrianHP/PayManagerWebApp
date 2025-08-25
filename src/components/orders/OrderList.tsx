import React, { useState } from 'react';
import { PaymentOrderDTO } from '../../types';
import { ORDER_STATUS } from '../../utils';
import { OrderCard } from './OrderCard';

interface OrderListProps {
  orders: PaymentOrderDTO[];
  onViewDetails: (order: PaymentOrderDTO) => void;
  onPayOrder: (id: string) => void;
  onCancelOrder: (id: string) => void;
  onDeleteOrder: (id: string) => void;
  loading?: boolean;
}

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  onViewDetails,
  onPayOrder,
  onCancelOrder,
  onDeleteOrder,
  loading = false
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount'>('newest');

  const filteredOrders = orders
    .filter(order => filterStatus === 'all' || order.orderStatus === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return parseInt(a.id) - parseInt(b.id);
        case 'amount':
          return (b.amount || 0) - (a.amount || 0);
        case 'newest':
        default:
          return parseInt(b.id) - parseInt(a.id);
      }
    });

  const handleCancelOrder = (id: string) => {
    const order = orders.find(o => o.id === id);
    if (order && window.confirm(`Are you sure you want to cancel order #${order.id}?`)) {
      onCancelOrder(id);
    }
  };

  const handleDeleteOrder = (id: string) => {
    const order = orders.find(o => o.id === id);
    if (order && window.confirm(`Are you sure you want to delete order #${order.id}? This action cannot be undone.`)) {
      onDeleteOrder(id);
    }
  };

  const getStatusCounts = () => {
    return {
      total: orders.length,
      paid: orders.filter(o => o.orderStatus === ORDER_STATUS.PAID).length,
      pending: orders.filter(o => o.orderStatus === ORDER_STATUS.PENDING).length,
      cancelled: orders.filter(o => o.orderStatus === ORDER_STATUS.CANCELLED).length
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Orders ({filteredOrders.length})
          </h2>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>Total: {statusCounts.total}</span>
            <span className="text-green-600">Paid: {statusCounts.paid}</span>
            <span className="text-yellow-600">Pending: {statusCounts.pending}</span>
            <span className="text-red-600">Cancelled: {statusCounts.cancelled}</span>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Orders</option>
            <option value={ORDER_STATUS.PENDING}>Pending</option>
            <option value={ORDER_STATUS.PAID}>Paid</option>
            <option value={ORDER_STATUS.CANCELLED}>Cancelled</option>
            <option value={ORDER_STATUS.PROCESSING}>Processing</option>
          </select>
        </div>
        
        <div className="sm:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'amount')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount">Highest Amount</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <div className="text-gray-500 text-lg mb-2">
            {filterStatus !== 'all' ? `No ${filterStatus.toLowerCase()} orders found` : 'No orders found'}
          </div>
          <p className="text-gray-400">
            {orders.length === 0 ? 'Create your first order from the Products page' : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={onViewDetails}
              onPayOrder={onPayOrder}
              onCancelOrder={handleCancelOrder}
              onDeleteOrder={handleDeleteOrder}
            />
          ))}
        </div>
      )}
    </div>
  );
};