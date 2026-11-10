
import { useEffect, useState } from "react";
import {
  getAllSeries,
  createSeries,
  updateSeries,
  deleteSeries,
} from "../services/contentService";

function AdminSeries() {
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    title: "",
    description: "",
    coverImageUrl: "",
    status: "DRAFT",
  };

  const [form, setForm] = useState(emptyForm);

  // Load series from the backend
  const loadSeries = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAllSeries();
      setSeriesList(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load Series. Please check your login and backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeries();
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

  const openEditForm = (series) => {
    setEditingId(series.id);

    setForm({
      title: series.title || "",
      description: series.description || "",
      coverImageUrl: series.coverImageUrl || "",
      status: series.status || "DRAFT",
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

    try {
      if (editingId !== null) {
        await updateSeries(editingId, form);
        setSuccess("Series updated successfully.");
      } else {
        await createSeries(form);
        setSuccess("New Series created successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      await loadSeries();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save Series. Please check the entered details."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Series?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteSeries(id);
      setSuccess("Series deleted successfully.");
      await loadSeries();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete Series. It may contain existing chapters."
      );
    }
  };

  return (
    <div className="series-management">

      <div className="series-management-header">
        <div>
          <span>THE ARCHIVE / COLLECTIONS</span>
          <h2>Manage Series</h2>
          <p>Create and maintain your brand collections.</p>
        </div>

        <button
          className="series-add-button"
          onClick={openCreateForm}
        >
          + ADD NEW SERIES
        </button>
      </div>

      {error && <div className="series-message error">{error}</div>}
      {success && <div className="series-message success">{success}</div>}

      {showForm && (
        <form className="series-form" onSubmit={handleSubmit}>
          <div className="series-form-heading">
            <div>
              <span>SERIES DETAILS</span>
              <h3>{editingId !== null ? "Edit Series" : "Create New Series"}</h3>
            </div>

            <button
              type="button"
              className="series-close-button"
              onClick={() => setShowForm(false)}
            >
              CLOSE
            </button>
          </div>

          <div className="series-form-grid">
            <div className="series-field">
              <label>Series Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Example: SERIES 01 – THE GENTLE ARMOR™"
                maxLength={150}
                required
              />
            </div>

            <div className="series-field">
              <label>Status *</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
              </select>
            </div>

            <div className="series-field full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe this collection..."
                rows={4}
              />
            </div>

            <div className="series-field full-width">
              <label>Cover Image URL</label>
              <input
                type="url"
                name="coverImageUrl"
                value={form.coverImageUrl}
                onChange={handleChange}
                placeholder="https://example.com/series-cover.jpg"
              />
              <small>
                For now, enter an image URL. Actual image uploading
                will be a separate enhancement.
              </small>
            </div>
          </div>

          <div className="series-form-actions">
            <button
              type="button"
              className="series-cancel-button"
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
              className="series-save-button"
              disabled={saving}
            >
              {saving
                ? "SAVING..."
                : editingId !== null
                  ? "UPDATE SERIES"
                  : "CREATE SERIES"}
            </button>
          </div>
        </form>
      )}

      <div className="series-list-heading">
        <div>
          <span>YOUR COLLECTIONS</span>
          <h3>All Series ({seriesList.length})</h3>
        </div>
      </div>

      {loading ? (
        <p className="series-empty-message">Loading Series...</p>
      ) : seriesList.length === 0 ? (
        <div className="series-empty-message">
          <h3>No Series found</h3>
          <p>Create your first collection to get started.</p>
        </div>
      ) : (
        <div className="series-table-wrapper">
          <table className="series-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>SERIES</th>
                <th>DESCRIPTION</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {seriesList.map((series) => (
                <tr key={series.id}>
                  <td>#{series.id}</td>

                  <td className="series-table-title">
                    {series.title}
                  </td>

                  <td>
                    {series.description || "—"}
                  </td>

                  <td>
                    <span
                      className={`series-status ${
                        series.status?.toLowerCase() || ""
                      }`}
                    >
                      {series.status}
                    </span>
                  </td>

                  <td>
                    <div className="series-actions">
                      <button
                        onClick={() => openEditForm(series)}
                      >
                        EDIT
                      </button>

                      <button
                        className="delete"
                        onClick={() => handleDelete(series.id)}
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

export default AdminSeries;
