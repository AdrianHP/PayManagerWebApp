import type { ApiGridResponse, ProductDTO } from "../types";
import { apiFetch } from "./apiService";

export class ProductService {
  private static products: ProductDTO[];

  static async getAllProducts(): Promise<ProductDTO[]> {
    const response = await apiFetch<ApiGridResponse<ProductDTO[]>>("products");
    this.products = response.data;
    return response.data;
  }

  static async getProductById(id: string): Promise<ProductDTO> {
    return apiFetch<ProductDTO>(`/products/id=${id}`);
  }

  static async createProduct(
    productData: Omit<ProductDTO, "id">
  ): Promise<ProductDTO> {
    const newProduct = await apiFetch<ProductDTO>("products", {
      method: "POST",
      body: JSON.stringify(productData),
    });

    this.products.push(newProduct);
    return newProduct;
  }

  static async updateProduct(
    id: string,
    productData: Omit<ProductDTO, "id">
  ): Promise<ProductDTO> {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }

    const response = await apiFetch(`products?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });

    const updatedProduct: ProductDTO = {
      ...productData,
      id,
    };

    this.products[index] = updatedProduct;
    return updatedProduct;
  }

  static async deleteProduct(id: string): Promise<void> {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    const response = await apiFetch(`products?id=${id}`, {
      method: "DELETE",
    });

    this.products.splice(index, 1);
  }

  static async searchProducts(query: string): Promise<ProductDTO[]> {
    const lowercaseQuery = query.toLowerCase();
    return this.products.filter((product) =>
      product.name.toLowerCase().includes(lowercaseQuery)
    );
  }

  static async getActiveProducts(): Promise<ProductDTO[]> {
    return this.products.filter((product) => product.isActive);
  }

  static async updateStock(id: string, newStock: number): Promise<ProductDTO> {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    product.unitsInStock = newStock;
    return product;
  }
}
