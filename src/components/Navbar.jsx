import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import "../styles/Navbar.css";

function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("qbUser")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const updateUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("qbUser")) || null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("qb-auth-changed", updateUser);
    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("qb-auth-changed", updateUser);
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("qbAccessToken");
    localStorage.removeItem("qbUser");

    window.dispatchEvent(new Event("qb-auth-changed"));

    closeMenu();
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand-logo" onClick={closeMenu}>
        QUIET BATTLES<span>™</span>
      </Link>

      <nav className="nav-links">
        <Link to="/">HOME</Link>
        <Link to="/archive">THE ARCHIVE</Link>
        <a href="/#collections">COLLECTIONS</a>
        <a href="/#about">ABOUT</a>
      </nav>

      <div className="nav-actions">
        {user?.role === "USER" ? (
          <>
            <span className="nav-user">
              {user.fullName?.split(" ")[0]}
            </span>

            <Link to="/my-orders">MY ORDERS</Link>

            <button
              type="button"
              className="nav-logout"
              onClick={handleLogout}
            >
              LOG OUT
            </button>
          </>
        ) : (
          <>
            <Link to="/login">LOGIN</Link>
            <Link to="/register">REGISTER</Link>
          </>
        )}

        <Link to="/cart" className="cart-nav-link">
          <ShoppingBag size={20} />
          <span className="cart-count">{cartCount}</span>
        </Link>

        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((previous) => !previous)}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="mobile-menu">
          <Link to="/" onClick={closeMenu}>HOME</Link>
          <Link to="/archive" onClick={closeMenu}>THE ARCHIVE</Link>
          <a href="/#collections" onClick={closeMenu}>COLLECTIONS</a>
          <a href="/#about" onClick={closeMenu}>ABOUT</a>

          <div className="mobile-menu-divider" />

          {user?.role === "USER" ? (
            <>
              <span className="mobile-user">
                HELLO, {user.fullName?.split(" ")[0]?.toUpperCase()}
              </span>

              <Link to="/my-orders" onClick={closeMenu}>
                MY ORDERS
              </Link>

              <button
                type="button"
                className="mobile-logout"
                onClick={handleLogout}
              >
                LOG OUT
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>LOGIN</Link>
              <Link to="/register" onClick={closeMenu}>REGISTER</Link>
            </>
          )}

          <Link to="/cart" onClick={closeMenu}>
            SHOPPING BAG ({cartCount})
          </Link>
        </nav>
      )}
    </header>
  );
}

export default Navbar;