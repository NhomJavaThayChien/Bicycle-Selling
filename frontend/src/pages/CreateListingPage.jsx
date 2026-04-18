import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createListing,
  getListingDetail,
  updateListing,
} from "../services/sellerListingService";

const CONDITION_OPTIONS = ["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"];

const defaultFormState = {
  title: "",
  description: "",
  price: "",
  brandId: "",
  categoryId: "",
  condition: "GOOD",
  frameSize: "",
  gearSystem: "",
  location: "",
};

function CreateListingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = useMemo(() => Boolean(id), [id]);

  const [form, setForm] = useState(defaultFormState);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadListingDetail = async () => {
      setLoadingDetail(true);
      setError("");

      try {
        const response = await getListingDetail(id);
        const listing = response.data || {};

        setForm({
          title: listing.title || "",
          description: listing.description || "",
          price: listing.price != null ? String(listing.price) : "",
          brandId: listing.brandId != null ? String(listing.brandId) : "",
          categoryId:
            listing.categoryId != null ? String(listing.categoryId) : "",
          condition: listing.condition || "GOOD",
          frameSize: listing.frameSize || "",
          gearSystem: listing.gearSystem || "",
          location: listing.location || "",
        });
      } catch {
        setError("Khong tai duoc thong tin bai dang de chinh sua.");
      } finally {
        setLoadingDetail(false);
      }
    };

    loadListingDetail();
  }, [id, isEditMode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.title.trim()) return "Title khong duoc de trong.";
    if (!form.description.trim()) return "Description khong duoc de trong.";
    if (!form.price || Number(form.price) <= 0) return "Price phai lon hon 0.";
    if (!form.brandId || Number(form.brandId) <= 0)
      return "Brand ID phai la so duong.";
    if (!form.categoryId || Number(form.categoryId) <= 0)
      return "Category ID phai la so duong.";
    if (!form.location.trim()) return "Location khong duoc de trong.";

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      brandId: Number(form.brandId),
      categoryId: Number(form.categoryId),
      condition: form.condition,
      frameSize: form.frameSize.trim() || null,
      gearSystem: form.gearSystem.trim() || null,
      location: form.location.trim(),
    };

    try {
      if (isEditMode) {
        await updateListing(id, payload);
      } else {
        await createListing(payload);
      }

      navigate("/seller/dashboard");
    } catch (err) {
      const serverMessage = err?.response?.data?.message;
      setError(serverMessage || "Khong the luu bai dang. Vui long thu lai.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingDetail) {
    return (
      <main style={{ maxWidth: "760px", margin: "24px auto", padding: "0 16px" }}>
        <p>Dang tai du lieu bai dang...</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "760px", margin: "24px auto", padding: "0 16px" }}>
      <h1 style={{ marginBottom: "8px" }}>
        {isEditMode ? "Edit Listing" : "Create New Listing"}
      </h1>
      <p style={{ marginTop: 0, marginBottom: "20px", color: "#475467" }}>
        Dien thong tin bai dang, sau do gui len backend seller API.
      </p>

      {error && (
        <div
          style={{
            marginBottom: "14px",
            border: "1px solid #fecdca",
            backgroundColor: "#fef3f2",
            color: "#b42318",
            borderRadius: "8px",
            padding: "10px 12px",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "14px",
          border: "1px solid #eaecf0",
          borderRadius: "12px",
          padding: "16px",
          backgroundColor: "#fcfcfd",
        }}
      >
        <Field label="Title" required>
          <input name="title" value={form.title} onChange={handleChange} />
        </Field>

        <Field label="Price" required>
          <input
            type="number"
            min="1"
            name="price"
            value={form.price}
            onChange={handleChange}
          />
        </Field>

        <Field label="Brand ID" required>
          <input
            type="number"
            min="1"
            name="brandId"
            value={form.brandId}
            onChange={handleChange}
          />
        </Field>

        <Field label="Category ID" required>
          <input
            type="number"
            min="1"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
          />
        </Field>

        <Field label="Condition" required>
          <select name="condition" value={form.condition} onChange={handleChange}>
            {CONDITION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Frame Size">
          <input
            name="frameSize"
            value={form.frameSize}
            onChange={handleChange}
            placeholder="VD: M"
          />
        </Field>

        <Field label="Gear System">
          <input
            name="gearSystem"
            value={form.gearSystem}
            onChange={handleChange}
            placeholder="VD: Shimano 11-speed"
          />
        </Field>

        <Field label="Location" required>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="VD: Ho Chi Minh"
          />
        </Field>

        <Field label="Description" required fullWidth>
          <textarea
            rows={5}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Mo ta chi tiet tinh trang xe..."
          />
        </Field>

        <div
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/seller/dashboard")}
            style={secondaryBtnStyle}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              ...primaryBtnStyle,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading
              ? isEditMode
                ? "Saving..."
                : "Creating..."
              : isEditMode
                ? "Save Changes"
                : "Create Listing"}
          </button>
        </div>
      </form>
    </main>
  );
}

function Field({ label, required, fullWidth = false, children }) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        fontWeight: 600,
        fontSize: "0.9rem",
        color: "#344054",
        gridColumn: fullWidth ? "1 / -1" : "auto",
      }}
    >
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}

const primaryBtnStyle = {
  border: "none",
  borderRadius: "8px",
  padding: "10px 14px",
  backgroundColor: "#0c6cf2",
  color: "#fff",
  fontWeight: 600,
};

const secondaryBtnStyle = {
  border: "1px solid #d0d5dd",
  borderRadius: "8px",
  padding: "10px 14px",
  backgroundColor: "#fff",
  color: "#344054",
};

export default CreateListingPage;
