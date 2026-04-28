import React from "react";
import { Card, Row, Col, Typography } from "antd";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const { Title } = Typography;

// Mock data: Số xe đăng theo tuần (trong tháng)
const bikePostData = [
  { week: "Tuần 1", bikes: 45 },
  { week: "Tuần 2", bikes: 52 },
  { week: "Tuần 3", bikes: 38 },
  { week: "Tuần 4", bikes: 65 },
];

// Mock data: Doanh thu theo tháng (triệu VNĐ)
const revenueData = [
  { month: "Thg 1", revenue: 120 },
  { month: "Thg 2", revenue: 150 },
  { month: "Thg 3", revenue: 180 },
  { month: "Thg 4", revenue: 210 },
  { month: "Thg 5", revenue: 190 },
  { month: "Thg 6", revenue: 250 },
];

const StatisticsReport = () => {
  return (
    <div style={{ padding: "24px" }}>
      <Title level={3} style={{ marginBottom: "24px", color: "#1f2937" }}>
        Báo Cáo Thống Kê
      </Title>

      <Row gutter={[24, 24]}>
        {/* Biểu đồ số xe đăng */}
        <Col xs={24} lg={12}>
          <Card
            title="Số xe đăng theo tuần"
            bordered={false}
            style={{
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              borderRadius: "10px",
            }}
          >
            <div style={{ width: "100%", height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bikePostData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="week"
                    tick={{ fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value) => [`${value} xe`, "Số lượng"]}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Bar
                    dataKey="bikes"
                    name="Số lượng xe đăng mới"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Biểu đồ doanh thu */}
        <Col xs={24} lg={12}>
          <Card
            title="Doanh thu theo tháng (Triệu VNĐ)"
            bordered={false}
            style={{
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              borderRadius: "10px",
            }}
          >
            <div style={{ width: "100%", height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value) => [`${value} Tr VNĐ`, "Doanh thu"]}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Doanh thu"
                    stroke="#10b981"
                    strokeWidth={4}
                    dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsReport;
