import React from "react";
import { Card, Steps, Typography, Divider, Badge } from "antd";
import { 
  CheckCircle, 
  RefreshCw, 
  Truck, 
  Package 
} from "lucide-react";

const { Title, Text } = Typography;

const OrderTrackingPage = () => {
  // 0: Chờ lấy hàng, 1: Đã lấy hàng, 2: Đang giao, 3: Thành công
  const currentStep = 2;

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "800px",
        margin: "0 auto",
        marginTop: "40px",
      }}
    >
      <Card
        bordered={false}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Theo dõi đơn hàng
          </Title>
          <Badge status="processing" text="Mã Vận Đơn: GHN-123456789" />
        </div>

        <Divider />

        <Steps
          current={currentStep}
          items={[
            {
              title: "Chờ lấy hàng",
              description:
                "28/04/2026 - 09:00 AM\nNgười gửi đang chuẩn bị hàng",
              icon: <Package size={20} />,
            },
            {
              title: "Đã lấy hàng",
              description:
                "28/04/2026 - 11:30 AM\nShipper đã lấy hàng thành công",
              icon: <CheckCircle size={20} />,
            },
            {
              title: "Đang giao hàng",
              description:
                "29/04/2026 - 08:15 AM\nĐơn hàng đang trên đường tới bạn",
              icon: (
                <Truck
                  size={20}
                  style={currentStep === 2 ? { color: "#1890ff" } : {}}
                />
              ),
            },
            {
              title: "Giao thành công",
              description: "Dự kiến: 29/04/2026 - Chiều",
              icon: <RefreshCw size={20} />,
            },
          ]}
        />

        <div
          style={{
            marginTop: "40px",
            backgroundColor: "#f9f9f9",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <Title level={5}>Chi tiết vận trình</Title>
          <ul
            style={{
              listStyleType: "none",
              paddingLeft: 0,
              margin: 0,
              color: "#595959",
            }}
          >
            <li style={{ marginBottom: "8px" }}>
              <Text strong>[Bình Dương] </Text> Đơn hàng đang được luân chuyển
              đến bưu cục Dĩ An. <i>(29/04/2026 08:15)</i>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <Text strong>[Kho Tổng] </Text> Đã xuất kho phân loại.{" "}
              <i>(28/04/2026 22:00)</i>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <Text strong>[TP.HCM] </Text> Lấy hàng thành công.{" "}
              <i>(28/04/2026 11:30)</i>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default OrderTrackingPage;
