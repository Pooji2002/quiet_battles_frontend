
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";
import "../styles/Cart.css";

const fallbackImage =
  "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600";

function Cart() {
  const {
    cartItems,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    const token = localStorage.getItem("qbAccessToken");

    if (!token) {
      setError("Please log in before placing your order.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const orderData = {
        items: cartItems.map((item) => ({
          productId: Number(item.id),
          quantity: Number(item.quantity),
          size: item.size,
        })),
      };

      const response = await createOrder(orderData);

      clearCart();

      navigate(`/order-confirmation/${response.data.id}`);
    } catch (err) {
      console.error("Checkout error:", err);

      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Unable to place your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="cart-page">
      <h1>YOUR CART</h1>
      <p className="section-label">
        QUIET BATTLES™ — YOUR SELECTION
      </p>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is currently empty.</h2>
          <p>Discover the pieces from The Gentle Armor™.</p>
          <Link to="/product">
            EXPLORE THE COLLECTION
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div
                className="cart-item"
                key={`${item.id}-${item.size}`}
              >
                <img
                  src={item.imageUrl || fallbackImage}
                  alt={item.name}
                />

                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>SIZE: {item.size}</p>

                  <p>
                    ₹{Number(item.price).toLocaleString("en-IN")}
                  </p>

                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.size,
                          item.quantity - 1
                        )
                      }
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.size,
                          item.quantity + 1
                        )
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </button>

                    <button
                      className="remove-item"
                      onClick={() =>
                        removeFromCart(item.id, item.size)
                      }
                      aria-label="Remove item"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <strong>
                  ₹{(
                    Number(item.price) * item.quantity
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>ORDER SUMMARY</h2>

            <p>
              Subtotal
              <strong>
                ₹{Number(cartTotal).toLocaleString("en-IN")}
              </strong>
            </p>

            <p className="cart-note">
              Shipping and taxes are not included in this prototype.
            </p>

            {error && (
              <p role="alert" className="checkout-error">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "PLACING ORDER..." : "PROCEED TO CHECKOUT"}
            </button>

            <Link to="/product">
              CONTINUE SHOPPING
            </Link>
          </div>
        </>
      )}
    </main>
  );
}

export default Cart;
