import React from "react";
import { Table, Tag, Card, Row, Col, Statistic } from "antd";
import { DollarOutlined } from "@ant-design/icons";

export default function TransactionManagement() {
  const transactions = [
    {
      id: "TXN1001",
      type: "ORDER_PAYMENT",
      amount: 5000000,
      fee: 250000,
      date: "2026-04-18",
      status: "SUCCESS",
    },
    {
      id: "TXN1002",
      type: "REFUND",
      amount: 3000000,
      fee: 0,
      date: "2026-04-19",
      status: "SUCCESS",
    },
  ];

  const columns = [
    { title: "Mã GD", dataIndex: "id" },
    {
      title: "Loại giao dịch",
      dataIndex: "type",
      render: (type) => (
        <Tag color={type === "REFUND" ? "volcano" : "cyan"}>{type}</Tag>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      render: (val) => val.toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Phí dịch vụ thu được",
      dataIndex: "fee",
      render: (val) => (
        <span style={{ color: "green", fontWeight: "bold" }}>
          +{val.toLocaleString("vi-VN")} đ
        </span>
      ),
    },
    { title: "Ngày GD", dataIndex: "date" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: () => <Tag color="success">Thành công</Tag>,
    },
  ];

  const totalFee = transactions.reduce((sum, tx) => sum + tx.fee, 0);

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng doanh thu phí dịch vụ"
              value={totalFee}
              prefix={<DollarOutlined />}
              suffix="đ"
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>

      <h2>Lịch sử Giao dịch</h2>
      <Table dataSource={transactions} columns={columns} rowKey="id" />
    </div>
  );
}
