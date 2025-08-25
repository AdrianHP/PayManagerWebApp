import { BaseDTO } from "./common.types";

export interface ProductDTO extends BaseDTO<string> {
  name: string;
  unitPrice: number;
  isActive: boolean;
  unitsInStock: number;
}

export interface ProductFormData {
  name: string;
  unitPrice: number;
  isActive: boolean;
  unitsInStock: number;
}

export interface ProductCardProps {
  product: ProductDTO;
  onEdit: (product: ProductDTO) => void;
  onDelete: (id: string) => void;
  onAddToCart: (product: ProductDTO) => void;
}

export interface ProductFormProps {
  product?: ProductDTO;
  onSubmit: (product: Omit<ProductDTO, "id">) => void;
  onCancel: () => void;
}
