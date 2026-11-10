import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Archive from "./pages/Archive";
import Series from "./pages/Series";
import Chapter from "./pages/Chapter";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyOrders from "./pages/MyOrders";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { CartProvider } from "./context/CartContext";
import "./styles/AdminLogin.css";

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Public website */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/archive/series-01" element={<Series />} />
            <Route
              path="/archive/series-01/chapter/:chapterId"
              element={<Chapter />}
            />
            <Route
  path="/product"
  element={<Navigate to="/product/1" replace />}
/>

<Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route
  path="/order-confirmation/:orderId"
  element={<OrderConfirmation />}
/>

<Route path="/my-orders" element={<MyOrders />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
          </Route>

          {/* Admin login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected admin pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;