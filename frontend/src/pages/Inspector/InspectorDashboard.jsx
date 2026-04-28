import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  message,
  Space,
  Empty,
  Avatar,
  Dropdown,
} from "antd";
import {
  FileSearchOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { inspectionService } from "../../services/inspectionService";

const { Title, Text } = Typography;

const InspectorDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- LOGIC ĐĂNG XUẤT (QUAY VỀ TRANG CHỦ) ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Xóa thêm thông tin user nếu có
    message.success("Đã đăng xuất thành công!");
    navigate("/"); // Chuyển về trang chủ
  };

  const items = [
    {
      key: "1",
      label: "Hồ sơ của tôi",
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const getStats = () => {
    return {
      total: data.length,
      pending: data.filter(
        (item) => item.status === "PENDING" || item.status === "REQUESTED",
      ).length,
      passed: data.filter((item) => item.status === "PASSED").length,
      failed: data.filter((item) => item.status === "FAILED").length,
    };
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await inspectionService.getAll();
      if (res && res.length > 0) {
        setData(res);
      } else {
        throw new Error("Empty");
      }
    } catch (err) {
      // Mock data để bạn test giao diện khi BE chưa có data
      setData([
        {
          id: 101,
          listingId: "BIKE-2026-001",
          status: "PENDING",
          createdAt: "2026-04-29T08:30:00",
          notes: "Đang đợi xe vận chuyển đến kho...",
        },
        {
          id: 102,
          listingId: "BIKE-2026-005",
          status: "PASSED",
          createdAt: "2026-04-28T14:20:00",
          notes: "Xe rất mới, khung sườn nguyên bản.",
        },
        {
          id: 103,
          listingId: "BIKE-2026-009",
          status: "FAILED",
          createdAt: "2026-04-27T09:15:00",
          notes: "Phát hiện nứt khung ở mối hàn cổ xe.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = getStats();

  const columns = [
    {
      title: "Mã YC",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id) => <b style={{ color: "#1890ff" }}>#{id}</b>,
    },
    {
      title: "Mã Xe",
      dataIndex: "listingId",
      key: "listingId",
      render: (id) => <Tag color="geekblue">{id}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color =
          status === "PASSED" ? "green" : status === "FAILED" ? "red" : "blue";
        return (
          <Tag color={color} style={{ borderRadius: "12px" }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Ghi chú kiểm định",
      dataIndex: "notes",
      key: "notes",
      render: (text) => (
        <Text italic type="secondary">
          {text || "Chưa có ghi chú"}
        </Text>
      ),
    },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <small>{new Date(date).toLocaleDateString("vi-VN")}</small>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right",
      render: (_, record) => (
        <Button
          type="primary"
          shape="round"
          icon={<EditOutlined />}
          onClick={() => navigate(`/inspector/inspect/${record.id}`)}
          disabled={record.status !== "PENDING"}
        >
          {record.status === "PENDING" ? "Kiểm định" : "Xem lại"}
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "0 24px 24px",
        background: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      {/* --- HEADER BAR --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 0",
          marginBottom: "16px",
          borderBottom: "1px solid #d9d9d9",
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Hệ thống Kiểm định
        </Title>
        <Space size="large">
          <Button icon={<ReloadOutlined />} onClick={loadData} shape="circle" />
          <Dropdown menu={{ items }} trigger={["click"]}>
            <a
              onClick={(e) => e.preventDefault()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "inherit",
              }}
            >
              <Avatar
                icon={<UserOutlined />}
                style={{ backgroundColor: "#1890ff" }}
              />
              <Text strong>Nhân viên Kiểm Định</Text>
            </a>
          </Dropdown>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} hoverable variant="none">
            <Statistic
              title="TỔNG YÊU CẦU"
              value={stats.total}
              prefix={<FileSearchOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            hoverable
            style={{ borderBottom: "4px solid #faad14" }}
            variant="none"
          >
            <Statistic
              title="ĐANG CHỜ"
              value={stats.pending}
              styles={{ content: { color: "#faad14" } }}
              prefix={<SyncOutlined spin />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            hoverable
            style={{ borderBottom: "4px solid #52c41a" }}
            variant="none"
          >
            <Statistic
              title="ĐÃ DUYỆT"
              value={stats.passed}
              styles={{ content: { color: "#52c41a" } }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            hoverable
            style={{ borderBottom: "4px solid #f5222d" }}
            variant="none"
          >
            <Statistic
              title="TỪ CHỐI"
              value={stats.failed}
              styles={{ content: { color: "#f5222d" } }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: "12px" }}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default InspectorDashboard;
