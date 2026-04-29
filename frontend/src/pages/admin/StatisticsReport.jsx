import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Spin, Alert, Radio } from "antd";
import {
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import API from "../../services/api";

const { Title, Text } = Typography;

// Gộp dữ liệu đơn hàng theo tuần
const groupByWeek = (data) => {
  const weeks = {};
  data.forEach(({ date, count }) => {
    const d = new Date(date);
    // Tuần 1-4 trong tháng
    const week = `Tuần ${Math.ceil(d.getDate() / 7)}`;
    weeks[week] = (weeks[week] || 0) + Number(count);
  });
  return Object.entries(weeks)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, bikes]) => ({ week, bikes }));
};

// Gộp doanh thu theo tháng
const groupByMonth = (data) => {
  const months = {};
  data.forEach(({ date, revenue }) => {
    const d = new Date(date);
    const key = `Thg ${d.getMonth() + 1}/${d.getFullYear()}`;
    months[key] = (months[key] || 0) + Number(revenue);
  });
  return Object.entries(months)
    .sort(([a], [b]) => {
      // Sort by year then month
      const [ma, ya] = a.replace("Thg ", "").split("/").map(Number);
      const [mb, yb] = b.replace("Thg ", "").split("/").map(Number);
      return ya !== yb ? ya - yb : ma - mb;
    })
    .map(([month, revenue]) => ({
      month: month.split("/")[0], // Chỉ hiện "Thg X"
      revenue: Math.round(revenue / 1_000_000), // Đổi sang Triệu VNĐ
    }));
};

const StatisticsReport = () => {
  const [orderData, setOrderData]     = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const [orderRes, revenueRes] = await Promise.all([
          API.get("/admin/stats/orders-chart"),
          API.get("/admin/stats/revenue-chart"),
        ]);
        setOrderData(groupByWeek(orderRes.data || []));
        setRevenueData(groupByMonth(revenueRes.data || []));
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const tooltipStyle = {
    borderRadius: "8px",
    border: "none",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  };

  if (loading) {
    return (
      <div style={{ padding: 24, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <Spin size="large" tip="Đang tải dữ liệu thống kê..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: "#1f2937" }}>
          Báo Cáo Thống Kê
        </Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Dữ liệu thực từ hệ thống
        </Text>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Row gutter={[24, 24]}>
        {/* Biểu đồ số xe đăng theo tuần */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                Số đơn hàng theo tuần
                <Text type="secondary" style={{ fontSize: 11, marginLeft: 8 }}>
                  (tháng hiện tại)
                </Text>
              </span>
            }
            variant="borderless"
            style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", borderRadius: 10 }}
          >
            {orderData.length === 0 ? (
              <div style={{ height: 350, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Text type="secondary">Chưa có dữ liệu</Text>
              </div>
            ) : (
              <div style={{ width: "100%", height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="week" tick={{ fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#6b7280" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} đơn`, "Số đơn"]} />
                    <Legend wrapperStyle={{ paddingTop: 20 }} />
                    <Bar
                      dataKey="bikes"
                      name="Số đơn hàng"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </Col>

        {/* Biểu đồ doanh thu theo tháng */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                Doanh thu theo tháng
                <Text type="secondary" style={{ fontSize: 11, marginLeft: 8 }}>
                  (Triệu VNĐ, tiền đã thu thực tế)
                </Text>
              </span>
            }
            variant="borderless"
            style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", borderRadius: 10 }}
          >
            {revenueData.length === 0 ? (
              <div style={{ height: 350, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Text type="secondary">Chưa có dữ liệu doanh thu</Text>
              </div>
            ) : (
              <div style={{ width: "100%", height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fill: "#6b7280" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v}M`}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v) => [`${v} Triệu VNĐ`, "Doanh thu"]}
                    />
                    <Legend wrapperStyle={{ paddingTop: 20 }} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Doanh thu"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsReport;
