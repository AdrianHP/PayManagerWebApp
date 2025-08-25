import React, { useState } from "react";
import type { PaymentOrderDTO } from "../types";
import { useOrders } from "../hooks";
import { OrderList, OrderDetails } from "../components/orders";

export const OrdersView: React.FC = () => {
  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
    payOrder,
    cancelOrder,
    deleteOrder,
  } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState<PaymentOrderDTO | null>(
    null
  );
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Order handlers
  const handleViewDetails = (order: PaymentOrderDTO) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handlePayOrder = async (id: string) => {
    try {
      await payOrder(id);
      alert("Payment processed successfully!");
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Error processing payment. Please try again.");
    }
  };

  const handleCancelOrder = async (id: string) => {
    try {
      await cancelOrder(id);
      alert("Order cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Error cancelling order. Please try again.");
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await deleteOrder(id);
      alert("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Error deleting order. Please try again.");
    }
  };

  const handleCloseDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  // Error handling
  if (ordersError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Orders
          </h3>
          <p className="text-gray-600">{ordersError}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Orders List */}
      <OrderList
        orders={orders}
        onViewDetails={handleViewDetails}
        onPayOrder={handlePayOrder}
        onCancelOrder={handleCancelOrder}
        onDeleteOrder={handleDeleteOrder}
        loading={ordersLoading}
      />

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          isOpen={showOrderDetails}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};
