import { Routes, Route, Link } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Cart from "./pages/Cart";

export default function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/">Brian E-commerce</Link>
        <div className="nav-links">
          <Link to="/cart">Cart</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}
