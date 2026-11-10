
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { getOrderById } from "../services/orderService";
import "../styles/OrderConfirmation.css";

function OrderConfirmation() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getOrderById(orderId);
        setOrder(response.data);
      } catch (err) {
        console.error("Order fetch error:", err);
        setError("Unable to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN");

  if (loading) {
    return (
      <main className="order-confirmation-page order-state">
        <p>LOADING YOUR ORDER...</p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="order-confirmation-page order-state">
        <h2>{error || "Order not found."}</h2>
        <Link to="/archive" className="order-primary-link">
          RETURN TO ARCHIVE <ArrowRight size={16} />
        </Link>
      </main>
    );
  }

  return (
    <main className="order-confirmation-page">
      <section className="confirmation-header">
        <CheckCircle2 size={42} strokeWidth={1.3} />

        <p className="confirmation-label">QUIET BATTLES™</p>

        <h1>ORDER CONFIRMED</h1>

        <p className="confirmation-message">
          Thank you. Your order has been successfully placed.
          Every piece carries a story. Yours begins here.
        </p>
      </section>

      <section className="confirmation-content">
        <div className="order-overview">
          <div>
            <p className="order-label">ORDER NUMBER</p>
            <h2>#{order.id}</h2>
          </div>

          <div className="order-status">
            <span className="order-label">ORDER STATUS</span>
            <span className="status-value">{order.status}</span>
          </div>
        </div>

        <div className="order-items-section">
          <div className="order-section-heading">
            <Package size={20} />
            <h2>YOUR SELECTION</h2>
          </div>

          {order.items?.map((item, index) => (
            <div
              className="confirmation-item"
              key={`${item.productId}-${index}`}
            >
              <div className="confirmation-item-details">
                <h3>{item.productName}</h3>

                <p>SKU: {item.productSku || "Not available"}</p>

                <p>
  SIZE: {item.size?.trim() || "Not specified"}
</p>

                <p>QUANTITY: {item.quantity}</p>

                <p>
                  UNIT PRICE: ₹{formatPrice(item.unitPrice)}
                </p>
              </div>

              <strong>
                ₹{formatPrice(item.subtotal)}
              </strong>
            </div>
          ))}
        </div>

        <div className="order-total-section">
          <div>
            <span>TOTAL AMOUNT</span>
            <h2>₹{formatPrice(order.totalAmount)}</h2>
          </div>

          <div className="order-date">
            <span>PLACED ON</span>
            <p>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString("en-IN")
                : "Not available"}
            </p>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to="/my-orders" className="order-primary-link">
            VIEW MY ORDERS <ArrowRight size={16} />
          </Link>

          <Link to="/archive" className="order-secondary-link">
            CONTINUE EXPLORING
          </Link>
        </div>
      </section>
    </main>
  );
}

export default OrderConfirmation;
