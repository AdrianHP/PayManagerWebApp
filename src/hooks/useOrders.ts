import { useState, useEffect } from "react";
import type { PaymentOrderDTO, ProductDTO, CreateOrderData } from "../types";
import { OrderService } from "../services";

interface UseOrdersReturn {
  orders: PaymentOrderDTO[];
  loading: boolean;
  error: string | null;
  refreshOrders: () => Promise<void>;
  createOrder: (
    products: ProductDTO[],
    orderData: CreateOrderData
  ) => Promise<PaymentOrderDTO>;
  updateOrderStatus: (id: string, status: string) => Promise<PaymentOrderDTO>;
  deleteOrder: (id: string) => Promise<void>;
  payOrder: (id: string) => Promise<PaymentOrderDTO>;
  cancelOrder: (id: string) => Promise<PaymentOrderDTO>;
}

export const useOrders = (): UseOrdersReturn => {
  const [orders, setOrders] = useState<PaymentOrderDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedOrders = await OrderService.getAllOrders();
      setOrders(fetchedOrders);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (
    products: ProductDTO[],
    orderData: CreateOrderData
  ): Promise<PaymentOrderDTO> => {
    try {
      const newOrder = await OrderService.createOrder(products, orderData);
      setOrders((prev) => [...prev, newOrder]);
      return newOrder;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while creating the order";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateOrderStatus = async (
    id: string,
    status: string
  ): Promise<PaymentOrderDTO> => {
    try {
      const updatedOrder = await OrderService.updateOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? updatedOrder : order))
      );
      return updatedOrder;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while updating the order";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteOrder = async (id: string): Promise<void> => {
    try {
      await OrderService.deleteOrder(id);
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while deleting the order";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const payOrder = async (id: string): Promise<PaymentOrderDTO> => {
    try {
      const paidOrder = await OrderService.payOrder(id);
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? paidOrder : order))
      );
      return paidOrder;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while processing payment";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const cancelOrder = async (id: string): Promise<PaymentOrderDTO> => {
    try {
      const cancelledOrder = await OrderService.cancelOrder(id);
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? cancelledOrder : order))
      );
      return cancelledOrder;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while cancelling the order";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    refreshOrders,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    payOrder,
    cancelOrder,
  };
};
