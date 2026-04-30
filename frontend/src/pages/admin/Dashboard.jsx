import React, { useEffect, useState } from "react";
import { Row, Col, Card, Table, Tag, Button, Spin, Typography, Space } from "antd";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  AlertCircle, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  ChevronRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { motion } from "framer-motion";
import API from "../../services/api";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [disputeData, setDisputeData] = useState([]);
  const [pendingListings, setPendingListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          dashboardRes, 
          revenueRes, 
          orderRes, 
          disputeRes, 
          pendingRes
        ] = await Promise.all([
          API.get("/admin/stats/dashboard"),
          API.get("/admin/stats/revenue-chart"),
          API.get("/admin/stats/orders-chart"),
          API.get("/admin/stats/disputes"),
          API.get("/admin/listings/pending")
        ]);

        setStats(dashboardRes.data);
        setRevenueData(revenueRes.data);
        setOrderData(orderRes.data);
        setDisputeData(disputeRes.data);
        setPendingListings(pendingRes.data.slice(0, 5)); // Only top 5
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  const statCards = [
    {
      title: "Người dùng",
      value: stats?.totalUsers || 0,
      subtitle: "Tổng tài khoản đã đăng ký",
      icon: <Users size={24} />,
      color: "#1890ff",
      bg: "linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)"
    },
    {
      title: "Đơn hàng",
      value: stats?.totalOrders || 0,
      subtitle: "Tổng số đơn đã tạo",
      icon: <ShoppingCart size={24} />,
      color: "#52c41a",
      bg: "linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)"
    },
    {
      title: "Doanh thu thực thu",
      value: (stats?.totalRevenue || 0).toLocaleString("vi-VN") + " đ",
      subtitle: "Tiền đã nhận từ Stripe",
      icon: <DollarSign size={24} />,
      color: "#faad14",
      bg: "linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%)"
    },
    {
      title: "Tranh chấp",
      value: stats?.totalDisputes || 0,
      subtitle: "Tổng số tranh chấp",
      icon: <AlertCircle size={24} />,
      color: "#f5222d",
      bg: "linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)"
    }
  ];

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "title",
      key: "title",
      render: (text, record) => {
        let displayUrl = record.primaryImageUrl || "https://via.placeholder.com/40";
        if (displayUrl.startsWith("/uploads")) {
          displayUrl = `http://localhost:8080${displayUrl}`;
        }
        return (
          <Space>
            <img 
              src={displayUrl} 
              alt="bike" 
              style={{ width: 40, height: 40, borderRadius: 4, objectFit: "cover" }} 
            />
            <Text strong>{text}</Text>
          </Space>
        );
      }
    },
    {
      title: "Người bán",
      dataIndex: "sellerUsername",
      key: "sellerUsername",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price?.toLocaleString()}đ`
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Link to="/admin/approvals">
          <Button type="link" icon={<ChevronRight size={16} />}>Duyệt</Button>
        </Link>
      )
    }
  ];

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={2} style={{ margin: 0 }}>Bảng điều khiển hệ thống</Title>
            <Text type="secondary">Chào mừng trở lại, Admin! Đây là tóm tắt hoạt động hôm nay.</Text>
          </Col>
          <Col>
            <Tag color="blue" icon={<Clock size={12} style={{ marginRight: 4 }} />}>
              {new Date().toLocaleDateString("vi-VN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Tag>
          </Col>
        </Row>
      </motion.div>

      {/* Stats row */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {statCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                variant="borderless" 
                style={{ 
                  borderRadius: 16, 
                  background: card.bg,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12, textTransform: "uppercase", fontWeight: 600 }}>{card.title}</Text>
                    <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>{card.value}</div>
                    {card.subtitle && (
                      <Text type="secondary" style={{ fontSize: 11, marginTop: 2 }}>{card.subtitle}</Text>
                    )}
                  </div>
                  <div style={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 12, 
                    background: "#fff", 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center",
                    color: card.color,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}>
                    {card.icon}
                  </div>
                </div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Charts row */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <TrendingUp size={18} style={{ color: "#1890ff" }} />
                <span>Xu hướng doanh thu</span>
              </Space>
            }
            variant="borderless"
            style={{ borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1890ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: "#8c8c8c" }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: "#8c8c8c" }}
                    tickFormatter={(val) => `${val/1000000}M`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#1890ff" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <AlertCircle size={18} style={{ color: "#f5222d" }} />
                <span>Tình trạng tranh chấp</span>
              </Space>
            }
            variant="borderless"
            style={{ borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            <div style={{ height: 300, display: "flex", justifyContent: "center" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={disputeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="status"
                    label
                  >
                    {disputeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bottom row */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <Clock size={18} style={{ color: "#faad14" }} />
                <span>Tin đăng chờ duyệt mới nhất</span>
              </Space>
            }
            extra={<Link to="/admin/approvals">Xem tất cả</Link>}
            variant="borderless"
            style={{ borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            <Table 
              columns={columns} 
              dataSource={pendingListings} 
              rowKey="id" 
              pagination={false} 
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <CheckCircle size={18} style={{ color: "#52c41a" }} />
                <span>Số lượng đơn hàng hàng ngày</span>
              </Space>
            }
            variant="borderless"
            style={{ borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: "#8c8c8c" }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: "#8c8c8c" }}
                  />
                  <Tooltip 
                    cursor={{ fill: "#f0f2f5" }}
                    contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Bar dataKey="count" fill="#52c41a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
