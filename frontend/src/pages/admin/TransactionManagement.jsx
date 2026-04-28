import React, { useState, useEffect } from "react";
import { Table, Tag, Card, Row, Col, Statistic, message } from "antd";
import { DollarSign } from "lucide-react";
import API from "../../services/api";

export default function TransactionManagement() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/payments");
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tải lịch sử giao dịch!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id" },
    {
      title: "Loại",
      dataIndex: "isDeposit",
      render: (isDeposit) => (
        <Tag color={isDeposit ? "blue" : "green"}>
          {isDeposit ? "Đặt cọc" : "Thanh toán hết"}
        </Tag>
      ),
    },
    {
      title: "Phương thức",
      dataIndex: "method",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      render: (val, record) => `${val?.toLocaleString()} ${record.currency}`,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: ["order", "id"],
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "COMPLETED" || status === "SUCCESS" ? "success" : "warning"}>
          {status}
        </Tag>
      ),
    },
  ];

  const totalAmount = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng dòng tiền"
              value={totalAmount}
              prefix={<DollarSign size={16} style={{ marginRight: 4 }} />}
              suffix="đ"
              styles={{ content: { color: "#3f8600" } }}
            />
          </Card>
        </Col>
      </Row>

      <h2>Lịch sử Giao dịch</h2>
      <Table
        dataSource={transactions}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
}
