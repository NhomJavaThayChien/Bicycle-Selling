import React, { useState, useEffect } from "react";
import {
  Table, Button, Modal, Form, Input,
  Space, Tag, message, Typography, Tooltip, Badge
} from "antd";
import {
  getAllDisputes, takeDispute,
  resolveDispute, closeDispute
} from "../../services/disputeService";

const { TextArea } = Input;
const { Text } = Typography;

// Backend trả về: OPEN | UNDER_REVIEW | RESOLVED | CLOSED
const STATUS_CONFIG = {
  OPEN:         { color: "red",    label: "Chờ xử lý" },
  UNDER_REVIEW: { color: "blue",   label: "Đang xem xét" },
  RESOLVED:     { color: "green",  label: "Đã giải quyết" },
  CLOSED:       { color: "default",label: "Đã đóng" },
};

export default function DisputeManagement() {
  const [disputes, setDisputes]           = useState([]);
  const [loading, setLoading]             = useState(false);
  const [resolveTarget, setResolveTarget] = useState(null); // dispute đang phán quyết
  const [detailTarget, setDetailTarget]   = useState(null); // dispute xem chi tiết
  const [form] = Form.useForm();

  const loadDisputes = async () => {
    setLoading(true);
    try {
      const res = await getAllDisputes();
      setDisputes(res.data || []);
    } catch {
      message.error("Lỗi khi tải danh sách tranh chấp!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDisputes(); }, []);

  const handleTake = async (id) => {
    try {
      await takeDispute(id);
      message.success("Đã nhận xử lý tranh chấp!");
      loadDisputes();
    } catch (err) {
      message.error(err?.response?.data?.message || "Không thể nhận xử lý!");
    }
  };

  const handleResolve = async (values) => {
    try {
      await resolveDispute(resolveTarget.id, { resolution: values.resolution });
      message.success("Đã phán quyết thành công!");
      setResolveTarget(null);
      form.resetFields();
      loadDisputes();
    } catch (err) {
      message.error(err?.response?.data?.message || "Xử lý thất bại!");
    }
  };

  const handleClose = async (id) => {
    try {
      await closeDispute(id);
      message.success("Đã đóng tranh chấp!");
      loadDisputes();
    } catch (err) {
      message.error(err?.response?.data?.message || "Không thể đóng tranh chấp!");
    }
  };

  const openCount = disputes.filter((d) => d.status === "OPEN").length;

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 60,
    },
    {
      title: "Mã Đơn",
      dataIndex: "orderId",
      width: 90,
      render: (v) => <Text strong>#{v}</Text>,
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      ellipsis: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      ellipsis: true,
      render: (v) => v ? <Tooltip title={v}><Text type="secondary">{v}</Text></Tooltip> : "—",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 140,
      render: (status) => {
        const cfg = STATUS_CONFIG[status] || { color: "default", label: status };
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: 130,
      render: (v) => v ? new Date(v).toLocaleDateString("vi-VN") : "—",
    },
    {
      title: "Thao tác",
      width: 200,
      render: (_, record) => (
        <Space wrap>
          {/* Xem chi tiết */}
          <Button
            size="small"
            onClick={() => setDetailTarget(record)}
          >
            Chi tiết
          </Button>

          {/* Admin nhận xử lý — chỉ khi OPEN */}
          {record.status === "OPEN" && (
            <Button
              size="small"
              type="default"
              onClick={() => handleTake(record.id)}
            >
              Nhận xử lý
            </Button>
          )}

          {/* Admin phán quyết — chỉ khi UNDER_REVIEW */}
          {record.status === "UNDER_REVIEW" && (
            <Button
              size="small"
              type="primary"
              onClick={() => {
                setResolveTarget(record);
                form.resetFields();
              }}
            >
              Phán quyết
            </Button>
          )}

          {/* Đóng tranh chấp — khi RESOLVED */}
          {record.status === "RESOLVED" && (
            <Button
              size="small"
              danger
              onClick={() => handleClose(record.id)}
            >
              Đóng
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>Quản lý Tranh chấp</h2>
        {openCount > 0 && (
          <Badge count={openCount} style={{ backgroundColor: "#f5222d" }} />
        )}
        <Button onClick={loadDisputes} style={{ marginLeft: "auto" }}>
          Làm mới
        </Button>
      </div>

      <Table
        dataSource={disputes}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: "Chưa có tranh chấp nào." }}
      />

      {/* Modal phán quyết */}
      <Modal
        title={`Phán quyết tranh chấp #${resolveTarget?.id} — Đơn #${resolveTarget?.orderId}`}
        open={!!resolveTarget}
        onCancel={() => { setResolveTarget(null); form.resetFields(); }}
        onOk={() => form.submit()}
        okText="Xác nhận phán quyết"
        cancelText="Hủy"
      >
        {resolveTarget && (
          <div style={{ marginBottom: 16, padding: 12, background: "#f6f8fa", borderRadius: 8 }}>
            <Text strong>Lý do: </Text><Text>{resolveTarget.reason}</Text><br />
            {resolveTarget.description && (
              <><Text strong>Mô tả: </Text><Text>{resolveTarget.description}</Text><br /></>
            )}
            {resolveTarget.evidenceUrls && (
              <><Text strong>Bằng chứng: </Text>
                <a href={resolveTarget.evidenceUrls} target="_blank" rel="noreferrer">Xem</a>
              </>
            )}
          </div>
        )}
        <Form form={form} layout="vertical" onFinish={handleResolve}>
          <Form.Item
            name="resolution"
            label="Nội dung phán quyết"
            rules={[{ required: true, message: "Vui lòng nhập nội dung phán quyết" }]}
          >
            <TextArea
              rows={4}
              placeholder="Mô tả quyết định của Admin (VD: Hoàn tiền đặt cọc cho buyer vì xe không đúng mô tả)"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chi tiết */}
      <Modal
        title={`Chi tiết tranh chấp #${detailTarget?.id}`}
        open={!!detailTarget}
        onCancel={() => setDetailTarget(null)}
        footer={<Button onClick={() => setDetailTarget(null)}>Đóng</Button>}
      >
        {detailTarget && (
          <div style={{ display: "grid", gap: 10 }}>
            {[
              ["Mã đơn hàng", `#${detailTarget.orderId}`],
              ["Trạng thái", STATUS_CONFIG[detailTarget.status]?.label || detailTarget.status],
              ["Lý do", detailTarget.reason],
              ["Mô tả chi tiết", detailTarget.description || "—"],
              ["Bằng chứng", detailTarget.evidenceUrls || "Không có"],
              ["Phán quyết", detailTarget.resolution || "Chưa có"],
              ["Ngày tạo", detailTarget.createdAt ? new Date(detailTarget.createdAt).toLocaleString("vi-VN") : "—"],
              ["Ngày giải quyết", detailTarget.resolvedAt ? new Date(detailTarget.resolvedAt).toLocaleString("vi-VN") : "—"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", gap: 8 }}>
                <Text strong style={{ minWidth: 130 }}>{label}:</Text>
                <Text>{value}</Text>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
