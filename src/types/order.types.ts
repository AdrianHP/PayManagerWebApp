import type { BaseDTO } from "./common.types";
import type { ProductDTO } from "./product.types";

export interface FeeDTO {
  name: string;
  amount: number;
}

export interface PaymentOrderDTO extends BaseDTO<string> {
  amount?: number;
  paymentMethod: string;
  providerName?: string;
  providerOrderId?: string;
  orderStatus: string;
  fees: FeeDTO[];
  products: ProductDTO[];
}

export interface OrderCardProps {
  order: PaymentOrderDTO;
  onViewDetails: (order: PaymentOrderDTO) => void;
  onPayOrder: (id: string) => void;
  onCancelOrder: (id: string) => void;
  onDeleteOrder: (id: string) => void;
}

export interface OrderDetailsProps {
  order: PaymentOrderDTO;
  isOpen: boolean;
  onClose: () => void;
}

export interface CreateOrderData {
  paymentMethod: string;
}
