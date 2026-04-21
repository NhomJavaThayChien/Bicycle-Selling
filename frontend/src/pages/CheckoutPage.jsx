import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getListingById } from "../services/bikeService";
import { createOrder } from "../services/orderService";
import { createCashPayment, createDepositPayment } from "../services/paymentService";
import {
  calculateShippingFee,
  getDistricts,
  getProvinces,
  getWards,
} from "../services/shippingService";
import { formatPrice } from "../utils/formatPrice";

const DEFAULT_FROM_DISTRICT_ID = 1450;
const DEFAULT_FROM_WARD_CODE = "21211";

function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loadingListing, setLoadingListing] = useState(true);

  const [streetAddress, setStreetAddress] = useState("");
  const [note, setNote] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedWardCode, setSelectedWardCode] = useState("");

  const [fromDistrictId, setFromDistrictId] = useState(DEFAULT_FROM_DISTRICT_ID);
  const [fromWardCode, setFromWardCode] = useState(DEFAULT_FROM_WARD_CODE);

  const [shippingFee, setShippingFee] = useState(null);
  const [loadingFee, setLoadingFee] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingListing(true);
      setError("");

      try {
        const [listingRes, provinceRes] = await Promise.all([
          getListingById(id),
          getProvinces(),
        ]);

        setListing(listingRes.data || null);
        setProvinces(Array.isArray(provinceRes.data) ? provinceRes.data : []);
      } catch {
        setError("Khong tai duoc thong tin checkout. Vui long thu lai.");
      } finally {
        setLoadingListing(false);
      }
    };

    loadInitialData();
  }, [id]);

  useEffect(() => {
    if (!selectedProvinceId) {
      setDistricts([]);
      setSelectedDistrictId("");
      setWards([]);
      setSelectedWardCode("");
      return;
    }

    const loadDistricts = async () => {
      setError("");
      try {
        const response = await getDistricts(selectedProvinceId);
        const nextDistricts = Array.isArray(response.data) ? response.data : [];
        setDistricts(nextDistricts);
        setSelectedDistrictId("");
        setWards([]);
        setSelectedWardCode("");
      } catch {
        setError("Khong tai duoc danh sach quan/huyen.");
      }
    };

    loadDistricts();
  }, [selectedProvinceId]);

  useEffect(() => {
    if (!selectedDistrictId) {
      setWards([]);
      setSelectedWardCode("");
      return;
    }

    const loadWards = async () => {
      setError("");
      try {
        const response = await getWards(selectedDistrictId);
        const nextWards = Array.isArray(response.data) ? response.data : [];
        setWards(nextWards);
        setSelectedWardCode("");
      } catch {
        setError("Khong tai duoc danh sach phuong/xa.");
      }
    };

    loadWards();
  }, [selectedDistrictId]);

  const selectedProvince = useMemo(
    () =>
      provinces.find((province) =>
        String(province.provinceId) === String(selectedProvinceId),
      ) || null,
    [provinces, selectedProvinceId],
  );

  const selectedDistrict = useMemo(
    () =>
      districts.find((district) =>
        String(district.districtId) === String(selectedDistrictId),
      ) || null,
    [districts, selectedDistrictId],
  );

  const selectedWard = useMemo(
    () => wards.find((ward) => ward.wardCode === selectedWardCode) || null,
    [wards, selectedWardCode],
  );

  const totalEstimate = useMemo(() => {
    const price = Number(listing?.price || 0);
    const fee = Number(shippingFee || 0);
    return price + fee;
  }, [listing?.price, shippingFee]);

  const buildShippingAddress = () => {
    const parts = [
      streetAddress.trim(),
      selectedWard?.wardName,
      selectedDistrict?.districtName,
      selectedProvince?.provinceName,
    ].filter(Boolean);

    return parts.join(", ");
  };

  const canCalculateFee =
    listing &&
    selectedDistrictId &&
    selectedWardCode &&
    fromDistrictId &&
    fromWardCode;

  const handleCalculateFee = async () => {
    if (!canCalculateFee) {
      setError("Vui long chon day du thong tin GHN de tinh phi ship.");
      return;
    }

    setLoadingFee(true);
    setError("");

    try {
      const response = await calculateShippingFee({
        listingId: listing.id,
        fromDistrictId: Number(fromDistrictId),
        fromWardCode: String(fromWardCode).trim(),
        toDistrictId: Number(selectedDistrictId),
        toWardCode: selectedWardCode,
      });

      setShippingFee(Number(response?.data?.fee || 0));
    } catch {
      setShippingFee(null);
      setError(
        "Khong tinh duoc phi ship GHN. Kiem tra lai fromDistrict/fromWard hoac thong tin dia chi.",
      );
    } finally {
      setLoadingFee(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!listing) {
      return;
    }

    if (!streetAddress.trim() || !selectedDistrictId || !selectedWardCode) {
      setError("Vui long nhap day du dia chi giao hang.");
      return;
    }

    const shippingAddress = buildShippingAddress();
    if (!shippingAddress) {
      setError("Dia chi giao hang khong hop le.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const orderResponse = await createOrder({
        listingId: listing.id,
        agreedPrice: Number(listing.price),
        shippingAddress,
        note: note.trim() || null,
        paymentMethod,
      });

      const orderId = orderResponse?.data?.id;

      if (orderId) {
        if (paymentMethod === "STRIPE") {
          try {
            await createDepositPayment(orderId);
          } catch {
            // Continue with fake redirect even if payment API is unavailable.
          }

          navigate(`/payment-success?orderId=${orderId}`);
          return;
        }

        try {
          await createCashPayment(orderId);
        } catch {
          // Cash payment API failure should not block order history navigation.
        }
      }

      navigate("/orders");
    } catch (err) {
      const serverError = err?.response?.data?.error || err?.response?.data?.message;
      setError(serverError || "Tao don hang that bai. Vui long thu lai.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingListing) {
    return (
      <main style={{ maxWidth: "760px", margin: "24px auto", padding: "0 16px" }}>
        <p>Dang tai du lieu checkout...</p>
      </main>
    );
  }

  if (!listing) {
    return (
      <main style={{ maxWidth: "760px", margin: "24px auto", padding: "0 16px" }}>
        <p>Khong tim thay thong tin xe de checkout.</p>
      </main>
    );
  }

  return (
    <main className="content-wrap checkout-layout">
      <div className="section-heading" style={{ marginBottom: "18px" }}>
        <p className="eyebrow">Secure checkout</p>
        <h1 style={{ marginBottom: "8px" }}>Checkout</h1>
        <p style={{ marginTop: 0, color: "#475467" }}>
          Xac nhan thong tin giao hang, chon phuong thuc thanh toan va tao don mua xe.
        </p>
      </div>

      <div className="checkout-grid">
        <section className="panel-card checkout-summary-card">
          <h3 style={{ marginTop: 0 }}>{listing.title}</h3>
          <p style={{ margin: "4px 0" }}>Gia xe: {formatPrice(Number(listing.price || 0))}</p>
          <p style={{ margin: "4px 0", color: "#667085" }}>Listing ID: {listing.id}</p>
          <div className="checkout-summary-price">
            <span>Total estimate</span>
            <strong>{formatPrice(totalEstimate)}</strong>
          </div>
        </section>

        {error && <div className="alert alert-error full-span">{error}</div>}

        <form onSubmit={handleSubmit} className="panel-card checkout-form">
        <Field label="So nha, duong" required fullWidth>
          <input
            value={streetAddress}
            onChange={(event) => setStreetAddress(event.target.value)}
            placeholder="VD: 123 Nguyen Trai"
          />
        </Field>

        <Field label="Tinh/Thanh pho" required>
          <select
            value={selectedProvinceId}
            onChange={(event) => setSelectedProvinceId(event.target.value)}
          >
            <option value="">Chon tinh/thanh</option>
            {provinces.map((province) => (
              <option key={province.provinceId} value={province.provinceId}>
                {province.provinceName}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Quan/Huyen" required>
          <select
            value={selectedDistrictId}
            onChange={(event) => setSelectedDistrictId(event.target.value)}
            disabled={!selectedProvinceId}
          >
            <option value="">Chon quan/huyen</option>
            {districts.map((district) => (
              <option key={district.districtId} value={district.districtId}>
                {district.districtName}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Phuong/Xa" required>
          <select
            value={selectedWardCode}
            onChange={(event) => setSelectedWardCode(event.target.value)}
            disabled={!selectedDistrictId}
          >
            <option value="">Chon phuong/xa</option>
            {wards.map((ward) => (
              <option key={ward.wardCode} value={ward.wardCode}>
                {ward.wardName}
              </option>
            ))}
          </select>
        </Field>

        <Field label="From district (GHN shop)">
          <input
            type="number"
            value={fromDistrictId}
            onChange={(event) => setFromDistrictId(event.target.value)}
          />
        </Field>

        <Field label="From ward code (GHN shop)">
          <input
            value={fromWardCode}
            onChange={(event) => setFromWardCode(event.target.value)}
          />
        </Field>

        <Field label="Ghi chu don hang" fullWidth>
          <textarea
            rows={4}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Vi du: Giao gio hanh chinh"
          />
        </Field>

        <Field label="Payment method" required>
          <select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
          >
            <option value="COD">Cash on Delivery</option>
            <option value="STRIPE">Stripe</option>
          </select>
        </Field>

        {paymentMethod === "STRIPE" && (
          <section className="stripe-card full-span">
            <div className="section-heading" style={{ marginBottom: "10px" }}>
              <p className="eyebrow">Stripe test form</p>
              <h3 style={{ margin: 0 }}>Card details</h3>
              <p style={{ margin: 0, color: "#667085" }}>This is UI-only for test mode and confirmation flow.</p>
            </div>
            <div className="form-grid">
              <label>
                <span>Cardholder name</span>
                <input value={cardholderName} onChange={(event) => setCardholderName(event.target.value)} placeholder="Nguyen Van A" />
              </label>
              <label>
                <span>Card number</span>
                <input value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} placeholder="4242 4242 4242 4242" />
              </label>
              <label>
                <span>Expiry</span>
                <input value={cardExpiry} onChange={(event) => setCardExpiry(event.target.value)} placeholder="12/28" />
              </label>
              <label>
                <span>CVC</span>
                <input value={cardCvc} onChange={(event) => setCardCvc(event.target.value)} placeholder="123" />
              </label>
            </div>
          </section>
        )}

        <div
          className="checkout-actions full-span"
        >
          <div>
            <p style={{ margin: 0 }}>
              Phi ship GHN: {shippingFee != null ? formatPrice(shippingFee) : "Chua tinh"}
            </p>
            <p style={{ margin: 0, color: "#667085" }}>
              Tong tam tinh: {formatPrice(totalEstimate)}
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={handleCalculateFee}
              disabled={loadingFee}
              style={secondaryButtonStyle}
            >
              {loadingFee ? "Dang tinh phi..." : "Tinh phi ship GHN"}
            </button>
            <button type="submit" disabled={submitting} style={primaryButtonStyle}>
              {submitting ? "Dang tao don..." : "Place Order"}
            </button>
          </div>
        </div>
        </form>
      </div>
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

const primaryButtonStyle = {
  border: "none",
  borderRadius: "8px",
  padding: "10px 14px",
  backgroundColor: "#0c6cf2",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryButtonStyle = {
  border: "1px solid #d0d5dd",
  borderRadius: "8px",
  padding: "10px 14px",
  backgroundColor: "#fff",
  color: "#344054",
  fontWeight: 600,
  cursor: "pointer",
};

export default CheckoutPage;
