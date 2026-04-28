import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm } from "antd";
import API from "../../services/api";

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/brands");
      setBrands(res.data);
    } catch (err) {
      message.error("Lỗi khi tải danh sách thương hiệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        // Backend hiện tại chưa có PUT /brands/{id}, ta có thể thêm hoặc dùng POST nếu backend save có logic merge
        // Tuy nhiên theo AdminController.java chỉ có POST (save)
        await API.post("/admin/brands", { ...values, id: editingId });
        message.success("Đã cập nhật thương hiệu!");
      } else {
        await API.post("/admin/brands", values);
        message.success("Đã thêm thương hiệu mới!");
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchBrands();
    } catch (err) {
      message.error("Thao tác thất bại!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/admin/brands/${id}`);
      message.success("Đã xóa thương hiệu!");
      fetchBrands();
    } catch (err) {
      message.error("Xóa thất bại!");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên hãng", dataIndex: "name", key: "name" },
    { title: "Xuất xứ", dataIndex: "country", key: "country" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              setEditingId(record.id);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa thương hiệu này?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h2>Quản lý Thương hiệu</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          + Thêm thương hiệu
        </Button>
      </div>

      <Table
        dataSource={brands}
        columns={columns}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingId ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Tên thương hiệu"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Xuất xứ">
            <Input />
          </Form.Item>
          <Form.Item name="websiteUrl" label="Website URL">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Brand;
