import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMyOrders,
  cancelOrder,
} from "../services/orderService";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setError("");
      const response = await getMyOrders();
      setOrders(response.data);
    } catch (err) {
      console.error("My orders error:", err);
      setError("Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      await cancelOrder(orderId);
      await fetchOrders();
    } catch (err) {
      console.error("Cancel order error:", err);
      setError(
        err.response?.data?.message ||
        "Unable to cancel this order."
      );
    }
  };

  if (loading) {
    return <main className="cart-page">Loading your orders...</main>;
  }

  return (
    <main className="cart-page">
      <p className="section-label">QUIET BATTLES™</p>
      <h1>MY ORDERS</h1>

      {error && <p role="alert">{error}</p>}

      {orders.length === 0 ? (
        <div className="empty-cart">
          <h2>No orders yet.</h2>
          <p>Your orders will appear here after checkout.</p>
          <Link to="/archive">EXPLORE THE ARCHIVE</Link>
        </div>
      ) : (
        <div className="cart-items">
          {orders.map((order) => (
            <div className="cart-item" key={order.id}>
              <div className="cart-item-details">
                <h3>ORDER #{order.id}</h3>
                <p>Status: {order.status}</p>
                <p>
                  Total: ₹
                  {Number(order.totalAmount).toLocaleString("en-IN")}
                </p>
                <p>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString("en-IN")
                    : ""}
                </p>

                <Link to={`/order-confirmation/${order.id}`}>
                  VIEW ORDER
                </Link>

                {order.status === "PENDING" && (
                  <button
                    type="button"
                    onClick={() => handleCancel(order.id)}
                  >
                    CANCEL ORDER
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyOrders;