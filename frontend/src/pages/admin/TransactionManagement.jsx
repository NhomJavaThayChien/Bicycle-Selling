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

  const handleMarkSuccess = async (paymentId) => {
    if (!paymentId) {
      return;
    }

    try {
      const res = await API.post(`/admin/payments/${paymentId}/success`);
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === paymentId ? { ...tx, ...res.data } : tx)),
      );
      message.success("Da cap nhat trang thai thanh cong.");
    } catch (err) {
      console.error(err);
      const serverError = err?.response?.data?.message || err?.response?.data?.error;
      message.error(serverError || "Khong the cap nhat thanh toan.");
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
    {
      title: "Hành động",
      dataIndex: "id",
      render: (id, record) => (
        <button
          type="button"
          onClick={() => handleMarkSuccess(id)}
          disabled={record.status === "SUCCESS"}
          style={{
            border: "1px solid #d0d5dd",
            borderRadius: "8px",
            padding: "6px 10px",
            backgroundColor: record.status === "SUCCESS" ? "#f2f4f7" : "#0c6cf2",
            color: record.status === "SUCCESS" ? "#344054" : "#fff",
            cursor: record.status === "SUCCESS" ? "not-allowed" : "pointer",
          }}
        >
          {record.status === "SUCCESS" ? "Da xac nhan" : "Xac nhan"}
        </button>
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
