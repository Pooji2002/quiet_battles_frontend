
import { useEffect, useState } from "react";
import {
  getAllSeries,
  getChaptersBySeries,
  createChapter,
  updateChapter,
  deleteChapter,
} from "../services/contentService";

import "../styles/AdminChapters.css";
import { getAllProducts } from "../services/productService";

function AdminChapters() {
  const [seriesList, setSeriesList] = useState([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState("");
  const [chapters, setChapters] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [products, setProducts] = useState([]);

const emptyForm = {
  chapterNumber: "",
  title: "",
  content: "",
  productId: "",
  imageUrl: "",
  status: "DRAFT",
};

  const [form, setForm] = useState(emptyForm);

  // Load all Series for the dropdown
  useEffect(() => {
    const loadSeries = async () => {
      try {
        const response = await getAllSeries();
        const list = response.data || [];

        setSeriesList(list);

        if (list.length > 0) {
          setSelectedSeriesId(String(list[0].id));
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load Series."
        );
      }
    };

    loadSeries();
  }, []);

  // Load active products for the product dropdown
useEffect(() => {
  const loadProducts = async () => {
    try {
      const response = await getAllProducts();

      const activeProducts = (response.data || []).filter(
        (product) => product.status === "ACTIVE"
      );

      setProducts(activeProducts);
    } catch (err) {
      console.error("Unable to load products:", err);
      setError("Unable to load products for chapter association.");
    }
  };

  loadProducts();
}, []);

  // Load chapters whenever the selected Series changes
  const loadChapters = async () => {
    if (!selectedSeriesId) {
      setChapters([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getChaptersBySeries(selectedSeriesId);
      setChapters(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load Chapters."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChapters();
  }, [selectedSeriesId]);

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

const openEditForm = (chapter) => {
  setEditingId(chapter.id);

  setForm({
    chapterNumber: chapter.chapterNumber,
    title: chapter.title || "",
    content: chapter.content || "",
    productId: chapter.productId
      ? String(chapter.productId)
      : "",
    imageUrl: chapter.imageUrl || "",
    status: chapter.status || "DRAFT",
  });

  setError("");
  setSuccess("");
  setShowForm(true);
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSeriesId) {
      setError("Please select a Series first.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

const chapterData = {
  chapterNumber: Number(form.chapterNumber),
  title: form.title.trim(),
  content: form.content,
  productId: form.productId
    ? Number(form.productId)
    : null,
  imageUrl: form.imageUrl.trim(),
  status: form.status,
};

    try {
      if (editingId !== null) {
        await updateChapter(editingId, chapterData);
        setSuccess("Chapter updated successfully.");
      } else {
        await createChapter(selectedSeriesId, chapterData);
        setSuccess("Chapter created successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      await loadChapters();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save Chapter. Check the chapter number and details."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (chapterId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Chapter?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteChapter(chapterId);
      setSuccess("Chapter deleted successfully.");
      await loadChapters();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete Chapter."
      );
    }
  };

  return (
    <div className="chapter-management">

      <div className="chapter-management-header">
        <div>
          <span>THE ARCHIVE / STORIES</span>
          <h2>Manage Chapters</h2>
          <p>Create and maintain the stories within each collection.</p>
        </div>

        <button
          className="chapter-add-button"
          onClick={openCreateForm}
          disabled={!selectedSeriesId}
        >
          + ADD NEW CHAPTER
        </button>
      </div>

      {error && (
        <div className="chapter-message error">{error}</div>
      )}

      {success && (
        <div className="chapter-message success">{success}</div>
      )}

      <div className="chapter-series-selector">
        <label htmlFor="chapter-series">SELECT SERIES</label>

        <select
          id="chapter-series"
          value={selectedSeriesId}
          onChange={(e) => {
            setSelectedSeriesId(e.target.value);
            setShowForm(false);
            setEditingId(null);
            setForm(emptyForm);
            setError("");
            setSuccess("");
          }}
        >
          {seriesList.length === 0 && (
            <option value="">No Series available</option>
          )}

          {seriesList.map((series) => (
            <option key={series.id} value={series.id}>
              {series.title}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <form className="chapter-form" onSubmit={handleSubmit}>
          <div className="chapter-form-heading">
            <div>
              <span>CHAPTER DETAILS</span>
              <h3>
                {editingId !== null ? "Edit Chapter" : "Create New Chapter"}
              </h3>
            </div>

            <button
              type="button"
              className="chapter-close-button"
              onClick={() => setShowForm(false)}
            >
              CLOSE
            </button>
          </div>

          <div className="chapter-form-grid">
            <div className="chapter-field">
              <label>Chapter Number *</label>
              <input
                type="number"
                name="chapterNumber"
                min="1"
                value={form.chapterNumber}
                onChange={handleChange}
                placeholder="Example: 1"
                required
              />
            </div>

            <div className="chapter-field">
              <label>Status *</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div className="chapter-field full-width">
              <label>Chapter Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter chapter title"
                maxLength={150}
                required
              />
            </div>

            <div className="chapter-field full-width">
  <label>Chapter Image URL</label>

  <input
    type="url"
    name="imageUrl"
    value={form.imageUrl}
    onChange={handleChange}
    placeholder="https://example.com/chapter-image.jpg"
  />

  {form.imageUrl && (
    <img
      src={form.imageUrl}
      alt="Chapter preview"
      style={{
        width: "220px",
        height: "150px",
        objectFit: "cover",
        marginTop: "12px",
      }}
    />
  )}
</div>

            <div className="chapter-field full-width">
  <label htmlFor="chapter-product">
    RELATED PRODUCT
  </label>

  <select
    id="chapter-product"
    name="productId"
    value={form.productId}
    onChange={handleChange}
  >
    <option value="">No product associated</option>

    {products.map((product) => (
      <option key={product.id} value={product.id}>
        {product.name} — ₹{product.price}
      </option>
    ))}
  </select>
</div>

            <div className="chapter-field full-width">
              <label>Story Content</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Write the chapter story here..."
                rows={8}
              />
            </div>
          </div>

          <div className="chapter-form-actions">
            <button
              type="button"
              className="chapter-cancel-button"
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
              className="chapter-save-button"
              disabled={saving}
            >
              {saving
                ? "SAVING..."
                : editingId !== null
                  ? "UPDATE CHAPTER"
                  : "CREATE CHAPTER"}
            </button>
          </div>
        </form>
      )}

      <div className="chapter-list-heading">
        <div>
          <span>YOUR STORIES</span>
          <h3>All Chapters ({chapters.length})</h3>
        </div>
      </div>

      {loading ? (
        <p className="chapter-empty-message">Loading Chapters...</p>
      ) : !selectedSeriesId ? (
        <p className="chapter-empty-message">
          Create a Series before adding Chapters.
        </p>
      ) : chapters.length === 0 ? (
        <div className="chapter-empty-message">
          <h3>No Chapters found</h3>
          <p>Add the first chapter to this Series.</p>
        </div>
      ) : (
        <div className="chapter-table-wrapper">
          <table className="chapter-table">
            <thead>
              <tr>
                <th>NUMBER</th>
                <th>CHAPTER TITLE</th>
                <th>IMAGE</th>
                <th>RELATED PRODUCT</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {chapters.map((chapter) => (
                <tr key={chapter.id}>
                  <td>#{chapter.chapterNumber}</td>

                  <td className="chapter-table-title">
                    {chapter.title}
                  </td>
                  
                  <td>
  {chapter.imageUrl ? (
    <img
      src={chapter.imageUrl}
      alt={chapter.title}
      style={{
        width: "65px",
        height: "75px",
        objectFit: "cover",
      }}
    />
  ) : (
    "No image"
  )}
</td>

                  <td>
  {products.find(
    (product) => product.id === chapter.productId
  )?.name || "Not associated"}
</td>

                  <td>
                    <span
                      className={`chapter-status ${
                        chapter.status?.toLowerCase() || ""
                      }`}
                    >
                      {chapter.status}
                    </span>
                  </td>

                  <td>
                    <div className="chapter-actions">
                      <button onClick={() => openEditForm(chapter)}>
                        EDIT
                      </button>

                      <button
                        className="delete"
                        onClick={() => handleDelete(chapter.id)}
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

export default AdminChapters;
