import React, { useState } from "react";
import type { ProductFormProps } from "../../types";
import { validateProduct } from "../../utils";
import { Button, Input } from "../common";

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    unitPrice: product?.unitPrice?.toString() || "",
    unitsInStock: product?.unitsInStock?.toString() || "",
    isActive: product?.isActive ?? true,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name.trim(),
      unitPrice: parseFloat(formData.unitPrice),
      unitsInStock: parseInt(formData.unitsInStock),
      isActive: formData.isActive,
    };

    const validationErrors = validateProduct(productData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(productData);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "An error occurred"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <h4 className="text-sm font-medium text-red-800 mb-1">
            Please fix the following errors:
          </h4>
          <ul className="text-sm text-red-700 list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <Input
        label="Product Name"
        value={formData.name}
        onChange={(value) => handleInputChange("name", value)}
        placeholder="Enter product name"
        required
      />

      <Input
        label="Unit Price"
        value={formData.unitPrice}
        onChange={(value) => handleInputChange("unitPrice", value)}
        type="number"
        step={0.1}
        min={0}
        placeholder="0.00"
        required
      />

      <Input
        label="Units in Stock"
        value={formData.unitsInStock}
        onChange={(value) => handleInputChange("unitsInStock", value)}
        type="number"
        min={0}
        placeholder="0"
        required
      />

      <div className="flex items-center">
        <input
          id="isActive"
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => handleInputChange("isActive", e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
          Product is active
        </label>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting
            ? "Saving..."
            : product
            ? "Update Product"
            : "Create Product"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
