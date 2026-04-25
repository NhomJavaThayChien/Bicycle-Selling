import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Tag, message } from "antd";

const { TextArea } = Input;

export default function DisputeManagement() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [form] = Form.useForm();

  const [disputes, setDisputes] = useState([
    {
      id: "DP001",
      orderId: "ORD992",
      buyer: "Lê Văn C",
      reason: "Xe trầy xước không giống mô tả",
      status: "PENDING",
    },
  ]);

  const openResolveModal = (record) => {
    setSelectedDispute(record);
    setIsModalVisible(true);
  };

  const handleResolve = (values) => {
    message.success("Đã xử lý tranh chấp thành công!");
    setDisputes(
      disputes.map((d) =>
        d.id === selectedDispute.id ? { ...d, status: "RESOLVED" } : d,
      ),
    );
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: "Mã TC", dataIndex: "id" },
    { title: "Mã Đơn", dataIndex: "orderId" },
    { title: "Người khiếu nại", dataIndex: "buyer" },
    { title: "Lý do", dataIndex: "reason" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "PENDING" ? "red" : "green"}>
          {status === "PENDING" ? "Đang chờ xử lý" : "Đã giải quyết"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Button
          type="primary"
          disabled={record.status === "RESOLVED"}
          onClick={() => openResolveModal(record)}
        >
          Xử lý
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý Tranh chấp</h2>
      <Table dataSource={disputes} columns={columns} rowKey="id" />

      <Modal
        title={`Xử lý tranh chấp cho đơn: ${selectedDispute?.orderId}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleResolve}>
          <Form.Item
            name="resolutionType"
            label="Kết quả phán quyết"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="REFUND_BUYER">
                Hoàn tiền cho người mua
              </Select.Option>
              <Select.Option value="PAY_SELLER">
                Từ chối khiếu nại - Trả tiền cho người bán
              </Select.Option>
              <Select.Option value="COMPENSATE">Đền bù một phần</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="adminNote"
            label="Ghi chú của Admin"
            rules={[{ required: true }]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập lý do và chi tiết phán quyết..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
