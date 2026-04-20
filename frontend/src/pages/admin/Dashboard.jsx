import { Card, Row, Col } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState({
    totalUsers: 0,
    totalCars: 0,
    totalOrders: 0,
    revenue: 0,
  });

  useEffect(() => {
    axios
      .get("/admin/dashboard")
      .then((res) => setData(res.data))
      .catch(() => console.log("API lỗi"));
  }, []);

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card title="Users">{data.totalUsers}</Card>
      </Col>
      <Col span={6}>
        <Card title="Cars">{data.totalCars}</Card>
      </Col>
      <Col span={6}>
        <Card title="Orders">{data.totalOrders}</Card>
      </Col>
      <Col span={6}>
        <Card title="Revenue">{data.revenue}</Card>
      </Col>
    </Row>
  );
}
