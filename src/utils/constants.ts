export const ORDER_STATUS = {
  PENDING: 'Pending',
  PAID: 'Paid',
  CANCELLED: 'Cancelled',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered'
} as const;

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'Credit Card',
  DEBIT_CARD: 'Debit Card',
  PAYPAL: 'PayPal',
  BANK_TRANSFER: 'Bank Transfer',
  CASH: 'Cash'
} as const;

export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  ORDERS: '/api/orders',
  FEES: '/api/fees'
} as const;

export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  ITEMS_PER_PAGE: 10,
  MAX_CART_ITEMS: 99,
  MIN_STOCK_WARNING: 5
} as const;