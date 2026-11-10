
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getProductById } from "../services/productService";
import "../styles/Product.css";

const fallbackImage =
  "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200";

function Product() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setProduct(null);
        setSelectedSize("");
        setMessage("");

        const response = await getProductById(productId);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Unable to load this product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setMessage("Please select a size first.");
      return;
    }

    addToCart(product, selectedSize);
    setMessage("Product successfully added to your cart.");
  };

  if (loading) {
    return (
      <main className="product-page product-state">
        Loading product...
      </main>
    );
  }

  if (error) {
    return (
      <main className="product-page product-state">
        {error}
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-page product-state">
        Product not found.
      </main>
    );
  }

  return (
    <main className="product-page">

      {/* Product image */}

      <section className="product-image">
        <img
          src={product.imageUrl || fallbackImage}
          alt={product.name}
        />

        <span>QUIET BATTLES™ — SERIES 01</span>
      </section>

      {/* Product information and purchase options */}

      <section className="product-details">
        <p className="section-label">
          THE GENTLE ARMOR™
        </p>

        <h1>{product.name}</h1>

        <h2>
          ₹{Number(product.price).toLocaleString("en-IN")}
        </h2>

        <p className="product-description">
          {product.description}
        </p>

        <div className="size-section">
          <p>SELECT YOUR SIZE</p>

          <div className="size-options">
            {["S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                type="button"
                className={
                  selectedSize === size ? "size-active" : ""
                }
                aria-pressed={selectedSize === size}
                onClick={() => {
                  setSelectedSize(size);
                  setMessage("");
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="add-cart-button"
          onClick={handleAddToCart}
        >
          <ShoppingBag size={18} />
          ADD TO CART
        </button>

        {message && (
          <p className="cart-message" role="status">
            {message}
          </p>
        )}

        <div className="product-information">
          <p>COLLECTION: SERIES 01</p>
          <p>DESIGN: THE GENTLE ARMOR™</p>
          <p>IDENTITY: WEAR YOUR BATTLES.</p>
        </div>
      </section>

    </main>
  );
}

export default Product;
