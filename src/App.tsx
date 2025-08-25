import React, { useState } from "react";
import { CartProvider } from "./contexts/CartContext";
import { Header } from "./components/layout";
import { ProductsView, OrdersView } from "./views";
import "./styles/globals.css";

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<"products" | "orders">(
    "products"
  );

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Header activeView={activeView} onViewChange={setActiveView} />
        <main className="container mx-auto px-4 py-8 page-transition">
          {activeView === "products" ? <ProductsView /> : <OrdersView />}
        </main>
      </div>
    </CartProvider>
  );
};

export default App;
