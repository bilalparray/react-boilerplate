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

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/account" element={<Account />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );
}
