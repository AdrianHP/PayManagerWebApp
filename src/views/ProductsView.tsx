import React, { useState } from "react";
import type { ProductDTO } from "../types";
import { useProducts, useOrders, useCart } from "../hooks";
import { ProductList, ProductForm } from "../components/products";
import { Cart, CreateOrderModal } from "../components/cart";
import { Modal } from "../components/common";

export const ProductsView: React.FC = () => {
  const {
    products,
    loading: productsLoading,
    error: productsError,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const { createOrder } = useOrders();
  const { addToCart, clearCart } = useCart();

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<
    ProductDTO | undefined
  >();
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Product handlers
  const handleCreateProduct = async (productData: Omit<ProductDTO, "id">) => {
    try {
      await createProduct(productData);
      setShowProductForm(false);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleUpdateProduct = async (productData: Omit<ProductDTO, "id">) => {
    if (editingProduct) {
      try {
        await updateProduct(editingProduct.id, productData);
        setEditingProduct(undefined);
        setShowProductForm(false);
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditProduct = (product: ProductDTO) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleAddToCart = (product: ProductDTO) => {
    addToCart(product, 1);
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(undefined);
  };
  const { state } = useCart();
  // Order handlers
  const handleCreateOrder = async (paymentMethod: string) => {
    try {
      setIsCreatingOrder(true);

      if (state.items.length === 0) {
        throw new Error("Cart is empty");
      }

      const productsToOrder = state.items.map((item) => item.product);
      await createOrder(productsToOrder, { paymentMethod });

      clearCart();
      setShowCreateOrderModal(false);

      // Show success message
      alert(
        "Order created successfully! You can view it in the Orders section."
      );
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error creating order. Please try again.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Error handling
  if (productsError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Products
          </h3>
          <p className="text-gray-600">{productsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
      {/* Products Section */}
      <div className="xl:col-span-3">
        <ProductList
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onAddToCart={handleAddToCart}
          onCreateNew={() => setShowProductForm(true)}
          loading={productsLoading}
        />

        {/* Product Form Modal */}
        <Modal
          isOpen={showProductForm}
          onClose={handleCloseProductForm}
          title={editingProduct ? "Edit Product" : "Add New Product"}
          maxWidth="md"
        >
          <ProductForm
            product={editingProduct}
            onSubmit={
              editingProduct ? handleUpdateProduct : handleCreateProduct
            }
            onCancel={handleCloseProductForm}
          />
        </Modal>
      </div>

      {/* Cart Sidebar */}
      <div className="xl:col-span-1">
        <div className="sticky top-24">
          <Cart onCreateOrder={() => setShowCreateOrderModal(true)} />
        </div>
      </div>

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={showCreateOrderModal}
        onClose={() => !isCreatingOrder && setShowCreateOrderModal(false)}
        onSubmit={handleCreateOrder}
      />
    </div>
  );
};
