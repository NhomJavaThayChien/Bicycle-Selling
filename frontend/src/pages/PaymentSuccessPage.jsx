import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import { CheckCircle, Clock, XCircle, ShoppingBag, ArrowRight } from "lucide-react";

const statusConfig = {
  DEPOSIT_PAID: {
    icon: <CheckCircle size={64} color="#52c41a" />,
    title: "Đặt cọc thành công!",
    desc: "Stripe đã ghi nhận khoản đặt cọc 20% của bạn. Người bán sẽ xác nhận đơn hàng sớm nhất.",
    color: "#52c41a",
    bg: "#f6ffed",
    border: "#b7eb8f",
  },
  FULL_PAID: {
    icon: <CheckCircle size={64} color="#1890ff" />,
    title: "Thanh toán toàn bộ thành công!",
    desc: "Đơn hàng đã được thanh toán đầy đủ. Vui lòng chờ xác nhận từ người bán.",
    color: "#1890ff",
    bg: "#e6f7ff",
    border: "#91d5ff",
  },
  PENDING: {
    icon: <Clock size={64} color="#fa8c16" />,
    title: "Đang chờ xác nhận thanh toán...",
    desc: "Hệ thống đang xử lý giao dịch của bạn. Vui lòng chờ trong giây lát hoặc kiểm tra lại lịch sử đơn hàng.",
    color: "#fa8c16",
    bg: "#fff7e6",
    border: "#ffd591",
  },
  ERROR: {
    icon: <XCircle size={64} color="#ff4d4f" />,
    title: "Không thể xác nhận trạng thái",
    desc: "Không thể tải thông tin đơn hàng. Vui lòng kiểm tra lịch sử đơn hàng để biết trạng thái chính xác.",
    color: "#ff4d4f",
    bg: "#fff2f0",
    border: "#ffccc7",
  },
};

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [orderStatus, setOrderStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Polling để verify trạng thái thực tế từ backend (webhook có thể đến chậm hơn redirect)
  useEffect(() => {
    if (!orderId) {
      setOrderStatus("ERROR");
      setLoading(false);
      return;
    }

    let attempts = 0;
    const MAX_ATTEMPTS = 6; // thử 6 lần × 2 giây = tối đa 12 giây
    let timer;

    const checkStatus = async () => {
      try {
        const res = await getOrderById(orderId);
        const status = res.data?.status;

        if (status === "DEPOSIT_PAID" || status === "FULL_PAID" || status === "CONFIRMED") {
          setOrderStatus(status === "CONFIRMED" ? "DEPOSIT_PAID" : status);
          setLoading(false);
          return;
        }

        attempts++;
        setRetryCount(attempts);

        if (attempts < MAX_ATTEMPTS) {
          timer = setTimeout(checkStatus, 2000); // thử lại sau 2s
        } else {
          // Webhook chưa kịp xử lý — vẫn hiện PENDING
          setOrderStatus(status || "PENDING");
          setLoading(false);
        }
      } catch {
        setOrderStatus("ERROR");
        setLoading(false);
      }
    };

    checkStatus();
    return () => clearTimeout(timer);
  }, [orderId]);

  const config = statusConfig[orderStatus] || statusConfig["PENDING"];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f5ff 0%, #fff 60%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: "100%",
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
          padding: "48px 40px",
          textAlign: "center",
        }}
      >
        {loading ? (
          <>
            <div style={{ marginBottom: 24 }}>
              <Clock size={64} color="#1890ff" style={{ animation: "spin 1.5s linear infinite" }} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 12px", color: "#1d1d1f" }}>
              Đang xác nhận thanh toán...
            </h1>
            <p style={{ color: "#8c8c8c", fontSize: 14, margin: "0 0 8px" }}>
              Đang chờ phản hồi từ Stripe {retryCount > 0 ? `(${retryCount}/${6})` : ""}
            </p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </>
        ) : (
          <>
            {/* Icon trạng thái */}
            <div style={{ marginBottom: 24 }}>{config.icon}</div>

            {/* Tiêu đề */}
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                margin: "0 0 12px",
                color: config.color,
              }}
            >
              {config.title}
            </h1>

            {/* Mô tả */}
            <p style={{ color: "#595959", fontSize: 14, lineHeight: 1.7, margin: "0 0 24px" }}>
              {config.desc}
            </p>

            {/* Order badge */}
            {orderId && (
              <div
                style={{
                  display: "inline-block",
                  background: config.bg,
                  border: `1px solid ${config.border}`,
                  borderRadius: 8,
                  padding: "8px 20px",
                  marginBottom: 32,
                  fontWeight: 700,
                  fontSize: 14,
                  color: config.color,
                }}
              >
                Đơn hàng #{orderId}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
              <Link
                to="/orders"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: "#1890ff",
                  color: "#fff",
                  padding: "14px 24px",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                  transition: "background 0.2s",
                }}
              >
                <ShoppingBag size={18} />
                Xem lịch sử đơn hàng
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/bikes"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: "#f5f5f5",
                  color: "#595959",
                  padding: "14px 24px",
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: "none",
                }}
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default PaymentSuccessPage;
