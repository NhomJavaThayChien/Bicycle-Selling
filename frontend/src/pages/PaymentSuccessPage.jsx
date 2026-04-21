import { Link, useSearchParams } from "react-router-dom";

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const method = searchParams.get("method") || "Stripe";

  return (
    <main className="content-wrap">
      <section className="hero-card success-card">
        <p className="eyebrow">Payment confirmed</p>
        <h1 style={{ marginTop: 0 }}>Thanh toan thanh cong</h1>
        <p>
          Giao dich da duoc ghi nhan. {orderId ? `Order #${orderId}` : ""} via {method}.
        </p>

        <div className="success-actions">
          <Link to="/orders" className="primary-button link-button">
            Go to Order History
          </Link>
          <Link to="/bikes" className="ghost-button link-button">
            Continue shopping
          </Link>
        </div>
      </section>
    </main>
  );
}

export default PaymentSuccessPage;
