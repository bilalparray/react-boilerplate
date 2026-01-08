import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import Shop from "./pages/Shop";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import AboutUs from "./pages/About";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import ReturnExchangePolicy from "./pages/ReturnExchangePolicy";
import Login from "./pages/admin/Login";
import DashboardPage from "./pages/admin/Dashboard/Dashboard";
import { RequireAuth } from "./services/auth/RequireAuth";
import PublicLayout from "./layout/PublicLayout";
import AdminLayout from "./layout/AdminLayout";
import OrdersPage from "./pages/admin/Orders/Orders";
import OrderDetailsPage from "./pages/admin/Orders/OrderDetailsPage";
import InvoicePage from "./pages/admin/Invoices/InvoicePage";
import InvoicesPage from "./pages/admin/Invoices/InvoicesPage";
import CustomersPage from "./components/admin/dashboard/CustomersPage";
import CategoriesPage from "./pages/admin/categories/CategoriesPage";
import UnitList from "./pages/admin/units/UnitList";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC SITE */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund-policy" element={<ReturnExchangePolicy />} />
      </Route>

      {/* AUTH */}
      <Route path="/auth/login" element={<Login />} />

      {/* ADMIN */}
      <Route element={<RequireAuth role="Admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />
          <Route path="/orders/:id/invoice" element={<InvoicePage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/invoices/:id" element={<InvoicePage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/units" element={<UnitList />} />
        </Route>
      </Route>
    </Routes>
  );
}
