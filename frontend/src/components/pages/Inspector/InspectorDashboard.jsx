import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  Upload,
  message,
  Tag,
  Space,
} from "antd";
import { UploadOutlined, FormOutlined } from "@ant-design/icons";

export default function InspectorDashboard() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [form] = Form.useForm();

  const [requests, setRequests] = useState([
    {
      id: "REQ001",
      bikeName: "Giant Escape 3",
      seller: "Nguyễn Văn A",
      date: "2026-04-20",
      status: "REQUESTED",
    },
    {
      id: "REQ002",
      bikeName: "Trek Marlin 5",
      seller: "Trần Thị B",
      date: "2026-04-21",
      status: "REQUESTED",
    },
  ]);

  const openForm = (record) => {
    setSelectedRequest(record);
    setIsModalVisible(true);
  };

  const handleSubmit = (values) => {
    console.log("Dữ liệu kiểm định:", values);
    message.success(`Đã lưu kết quả kiểm định cho ${selectedRequest.bikeName}`);
    setIsModalVisible(false);
    form.resetFields();
    setRequests(requests.filter((r) => r.id !== selectedRequest.id));
  };

  const columns = [
    { title: "Mã YC", dataIndex: "id" },
    { title: "Tên xe", dataIndex: "bikeName" },
    { title: "Người bán", dataIndex: "seller" },
    { title: "Ngày yêu cầu", dataIndex: "date" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: () => <Tag color="orange">Chờ kiểm định</Tag>,
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<FormOutlined />}
          onClick={() => openForm(record)}
        >
          Kiểm định
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard Kiểm định viên</h2>
      <Table dataSource={requests} columns={columns} rowKey="id" />

      <Modal
        title={`Form Kiểm định: ${selectedRequest?.bikeName}`}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Hoàn tất đánh giá"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Space size="large" style={{ display: "flex", flexWrap: "wrap" }}>
            <Form.Item
              name="frameScore"
              label="Khung xe (1-10)"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} max={10} style={{ width: 120 }} />
            </Form.Item>
            <Form.Item
              name="brakeScore"
              label="Phanh (1-10)"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} max={10} style={{ width: 120 }} />
            </Form.Item>
            <Form.Item
              name="drivetrainScore"
              label="Truyền động (1-10)"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} max={10} style={{ width: 120 }} />
            </Form.Item>
            <Form.Item
              name="wheelScore"
              label="Bánh xe (1-10)"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} max={10} style={{ width: 120 }} />
            </Form.Item>
            <Form.Item
              name="saddleScore"
              label="Yên/Tay lái (1-10)"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} max={10} style={{ width: 120 }} />
            </Form.Item>
          </Space>

          <Form.Item
            name="pdfReport"
            label="File báo cáo (PDF)"
            rules={[
              { required: true, message: "Vui lòng upload biên bản kiểm định" },
            ]}
          >
            <Upload beforeUpload={() => false} accept=".pdf" maxCount={1}>
              <Button icon={<UploadOutlined />}>Chọn file PDF</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
