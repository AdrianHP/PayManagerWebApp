import { useState, useEffect } from "react";
import type { ProductDTO } from "../types";
import { ProductService } from "../services";

interface UseProductsReturn {
  products: ProductDTO[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  createProduct: (productData: Omit<ProductDTO, "id">) => Promise<ProductDTO>;
  updateProduct: (
    id: string,
    productData: Omit<ProductDTO, "id">
  ) => Promise<ProductDTO>;
  deleteProduct: (id: string) => Promise<void>;
  searchProducts: (query: string) => Promise<ProductDTO[]>;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await ProductService.getAllProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching products"
      );
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (
    productData: Omit<ProductDTO, "id">
  ): Promise<ProductDTO> => {
    try {
      const newProduct = await ProductService.createProduct(productData);
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while creating the product";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateProduct = async (
    id: string,
    productData: Omit<ProductDTO, "id">
  ): Promise<ProductDTO> => {
    try {
      const updatedProduct = await ProductService.updateProduct(
        id,
        productData
      );
      setProducts((prev) =>
        prev.map((product) => (product.id === id ? updatedProduct : product))
      );
      return updatedProduct;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while updating the product";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      await ProductService.deleteProduct(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while deleting the product";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const searchProducts = async (query: string): Promise<ProductDTO[]> => {
    try {
      const searchResults = await ProductService.searchProducts(query);
      return searchResults;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while searching products";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refreshProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
  };
};
