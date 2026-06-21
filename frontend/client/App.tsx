import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { CartProvider } from "./context/CartContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminProducts from "./pages/admin/AdminProducts";

import About from "./pages/static/About";
import FAQ from "./pages/static/FAQ";
import Shipping from "./pages/static/Shipping";
import Contact from "./pages/static/Contact";
import Privacy from "./pages/static/Privacy";
import Terms from "./pages/static/Terms";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminAuthProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminAnalytics />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="orders/:id" element={<AdminOrderDetail />} />
                  <Route path="products" element={<AdminProducts />} />
                </Route>

                {/* Customer Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/account" element={<Account />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
