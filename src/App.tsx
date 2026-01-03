import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import CategoryPage from "./pages/Category";
import ProductPage from "./pages/ProductPage";
import { RequireAuth } from "./services/auth/RequireAuth";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import Login from "./admin/pages/Login";
import WishlistPage from "./pages/WishlistPage";
import Shop from "./pages/Shop";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/category/:categoryId" element={<Shop />} />
        <Route element={<RequireAuth role="customer" />}>
          <Route path="/account" element={<Account />} />
        </Route>
        <Route element={<RequireAuth role="Admin" />}>
          <Route path="/admin" element={<Account />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );
}
