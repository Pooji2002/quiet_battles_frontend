import { useEffect, useState } from "react";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

import "../styles/ProductManagement.css";

function AdminProducts() {
 const emptyForm = {
  sku: "",
  name: "",
  description: "",
  imageUrl: "",
  price: "",
  stockQuantity: "",
  category: "",
  status: "ACTIVE",
};

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load products. Check your backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.id);

    setForm({
      sku: product.sku || "",
      name: product.name || "",
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      price: product.price ?? "",
      stockQuantity: product.stockQuantity ?? "",
      category: product.category || "",
      status: product.status || "ACTIVE",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    const productData = {
      ...form,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
    };

    try {
      if (editingId !== null) {
        await updateProduct(editingId, productData);
        setSuccess("Product updated successfully.");
      } else {
        await createProduct(productData);
        setSuccess("Product created successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      await loadProducts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save product. Please check the entered details."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteProduct(id);
      setSuccess("Product deleted successfully.");
      await loadProducts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete product."
      );
    }
  };

  return (
    <div className="product-management">

      <div className="product-management-header">
        <div>
          <span>THE COLLECTION / CATALOGUE</span>
          <h2>Manage Products</h2>
          <p>Create and maintain your product catalogue.</p>
        </div>

        <button
          className="product-add-button"
          onClick={openCreateForm}
        >
          + ADD NEW PRODUCT
        </button>
      </div>

      {error && (
        <div className="product-message error">{error}</div>
      )}

      {success && (
        <div className="product-message success">{success}</div>
      )}

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="product-form-heading">
            <div>
              <span>PRODUCT DETAILS</span>
              <h3>
                {editingId !== null
                  ? "Edit Product"
                  : "Create New Product"}
              </h3>
            </div>

            <button
              type="button"
              className="product-close-button"
              onClick={() => setShowForm(false)}
            >
              CLOSE
            </button>
          </div>

          <div className="product-form-grid">

            <div className="product-field">
              <label>Product SKU *</label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="QB-JACKET-001"
                maxLength={50}
                required
              />
            </div>

            <div className="product-field">
              <label>Product Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="THE GENTLE ARMOR JACKET"
                maxLength={150}
                required
              />
            </div>

            <div className="product-field">
              <label>Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="product-field">
              <label>Stock Quantity *</label>
              <input
                type="number"
                name="stockQuantity"
                value={form.stockQuantity}
                onChange={handleChange}
                min="0"
                step="1"
                required
              />
            </div>

            <div className="product-field">
              <label>Category *</label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="JACKETS"
                required
              />
            </div>

            <div className="product-field">
              <label>Status *</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div className="product-field full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe this product..."
              />
            </div>

            <div className="product-field full-width">
  <label>Product Image URL</label>

  <input
    type="url"
    name="imageUrl"
    value={form.imageUrl}
    onChange={handleChange}
    placeholder="https://example.com/product-image.jpg"
  />

  {form.imageUrl && (
    <img
      src={form.imageUrl}
      alt="Product preview"
      style={{
        width: "160px",
        height: "160px",
        objectFit: "cover",
        marginTop: "12px",
      }}
    />
  )}
</div>

          </div>

          <div className="product-form-actions">
            <button
              type="button"
              className="product-cancel-button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              CANCEL
            </button>

            <button
              type="submit"
              className="product-save-button"
              disabled={saving}
            >
              {saving
                ? "SAVING..."
                : editingId !== null
                  ? "UPDATE PRODUCT"
                  : "CREATE PRODUCT"}
            </button>
          </div>
        </form>
      )}

      <div className="product-list-heading">
        <span>YOUR CATALOGUE</span>
        <h3>All Products ({products.length})</h3>
      </div>

      {loading ? (
        <p className="product-empty-message">Loading products...</p>
      ) : products.length === 0 ? (
        <div className="product-empty-message">
          <h3>No products found</h3>
          <p>Create your first product to get started.</p>
        </div>
      ) : (
        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>SKU</th>
                <th>IMAGE</th>
                <th>PRODUCT</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>CATEGORY</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>#{product.id}</td>
                  <td>{product.sku}</td>
                  <td>
  {product.imageUrl ? (
    <img
      src={product.imageUrl}
      alt={product.name}
      style={{
        width: "55px",
        height: "65px",
        objectFit: "cover",
      }}
    />
  ) : (
    "No image"
  )}
</td>
                  <td>{product.name}</td>
                  <td>₹{Number(product.price).toLocaleString("en-IN")}</td>
                  <td>{product.stockQuantity}</td>
                  <td>{product.category}</td>
                  <td>
                    <span
                      className={`product-status ${
                        product.status?.toLowerCase()
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <div className="product-actions">
                      <button onClick={() => openEditForm(product)}>
                        EDIT
                      </button>

                      <button
                        className="delete"
                        onClick={() => handleDelete(product.id)}
                      >
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;