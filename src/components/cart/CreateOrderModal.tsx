import React, { useState } from "react";
import { useCart } from "../../hooks";
import { formatCurrency, PAYMENT_METHODS } from "../../utils";
import { Button, Modal, Select } from "../common";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentMethod: string) => Promise<void>;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>(
    PAYMENT_METHODS.CREDIT_CARD
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { state } = useCart();

  const paymentOptions = [
    { value: PAYMENT_METHODS.CREDIT_CARD, label: "Credit Card" },
    { value: PAYMENT_METHODS.DEBIT_CARD, label: "Debit Card" },
    { value: PAYMENT_METHODS.PAYPAL, label: "PayPal" },
    { value: PAYMENT_METHODS.BANK_TRANSFER, label: "Bank Transfer" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (state.items.length === 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(paymentMethod);
      onClose();
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Order"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Summary */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
          <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
            <div className="space-y-3">
              {state.items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(item.product.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(item.product.unitPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-300 pt-3 mt-3">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Subtotal:</span>
                <span className="text-blue-600">
                  {formatCurrency(state.total)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                * Processing fees will be calculated by the backend
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <Select
          label="Payment Method"
          value={paymentMethod}
          onChange={setPaymentMethod}
          options={paymentOptions}
          required
        />

        {/* Order Details Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Order Processing Information</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Final amount will include processing fees</li>
                <li>Payment provider will be assigned automatically</li>
                <li>You'll receive order details after creation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || state.items.length === 0}
            className="flex-1"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Order...
              </span>
            ) : (
              "Create Order"
            )}
          </Button>
          <Button
            type="button"
            onClick={handleClose}
            variant="secondary"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
