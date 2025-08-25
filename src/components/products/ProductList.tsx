import React, { useState } from "react";
import type { ProductDTO } from "../../types";
import { ProductCard } from "./ProductCard";
import { Input, Button } from "../common";

interface ProductListProps {
  products: ProductDTO[];
  onEdit: (product: ProductDTO) => void;
  onDelete: (id: string) => void;
  onAddToCart: (product: ProductDTO) => void;
  onCreateNew: () => void;
  loading?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onEdit,
  onDelete,
  onAddToCart,
  onCreateNew,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<
    "all" | "active" | "inactive"
  >("all");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && product.isActive) ||
      (filterActive === "inactive" && !product.isActive);

    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (
      product &&
      window.confirm(`Are you sure you want to delete "${product.name}"?`)
    ) {
      onDelete(id);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 rounded flex-1"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Products ({filteredProducts.length})
        </h2>
        <Button onClick={onCreateNew}>Add New Product</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            label=""
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search products..."
            className="mb-0"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={filterActive}
            onChange={(e) =>
              setFilterActive(e.target.value as "all" | "active" | "inactive")
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Products</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            {searchTerm || filterActive !== "all"
              ? "No products match your filters"
              : "No products found"}
          </div>
          {!searchTerm && filterActive === "all" && (
            <Button onClick={onCreateNew}>Create Your First Product</Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={handleDelete}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};
