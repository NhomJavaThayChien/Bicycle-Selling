import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, Tag, message, Radio } from "antd";
import API from "../../services/api";

const { TextArea } = Input;

export default function DisputeManagement() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const loadDisputes = async () => {
    setLoading(true);
    try {
      const res = await API.get("/disputes");
      setDisputes(res.data);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tải danh sách tranh chấp!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisputes();
  }, []);

  const takeDispute = async (id) => {
    try {
      await API.put(`/disputes/${id}/take`);
      message.success("Đã nhận xử lý tranh chấp!");
      loadDisputes();
    } catch (err) {
      message.error("Không thể nhận xử lý!");
    }
  };

  const handleResolve = async (values) => {
    try {
      await API.put(`/disputes/${selectedDispute.id}/resolve`, values);
      message.success("Đã xử lý tranh chấp thành công!");
      setIsModalVisible(false);
      form.resetFields();
      loadDisputes();
    } catch (err) {
      message.error("Xử lý thất bại!");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Mã Đơn", dataIndex: "orderId" },
    { title: "Lý do", dataIndex: "reason" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "PENDING" ? "red" : status === "HANDLING" ? "blue" : "green"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          {record.status === "PENDING" && (
            <Button onClick={() => takeDispute(record.id)}>Nhận xử lý</Button>
          )}
          {record.status === "HANDLING" && (
            <Button type="primary" onClick={() => {
              setSelectedDispute(record);
              setIsModalVisible(true);
            }}>
              Phán quyết
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý Tranh chấp</h2>
      <Table dataSource={disputes} columns={columns} rowKey="id" loading={loading} />

      <Modal
        title={`Xử lý tranh chấp #${selectedDispute?.id}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleResolve}>
          <Form.Item
            name="acceptBuyer"
            label="Kết quả phán quyết"
            rules={[{ required: true }]}
            initialValue={true}
          >
            <Radio.Group>
              <Radio value={true}>Chấp nhận khiếu nại (Hoàn tiền)</Radio>
              <Radio value={false}>Từ chối khiếu nại (Trả tiền SELLER)</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="resolution"
            label="Ghi chú phán quyết"
            rules={[{ required: true }]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập chi tiết phán quyết của Admin..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
