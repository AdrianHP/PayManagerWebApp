export const validateProduct = (product: any): string[] => {
  const errors: string[] = [];

  if (!product.name || product.name.trim().length === 0) {
    errors.push('Product name is required');
  }

  if (!product.unitPrice || product.unitPrice <= 0) {
    errors.push('Unit price must be greater than 0');
  }

  if (product.unitsInStock === undefined || product.unitsInStock < 0) {
    errors.push('Units in stock must be 0 or greater');
  }

  return errors;
};

export const validateOrder = (order: any): string[] => {
  const errors: string[] = [];

  if (!order.paymentMethod || order.paymentMethod.trim().length === 0) {
    errors.push('Payment method is required');
  }

  if (!order.products || order.products.length === 0) {
    errors.push('At least one product is required');
  }

  return errors;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};