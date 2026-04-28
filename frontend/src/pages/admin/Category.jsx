import { Table, Button, Modal, Form, Input, message, Space, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import API from "../../services/api";

export default function Category() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/categories");
      setData(res.data);
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi tải danh sách danh mục!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (values) => {
    try {
      if (editingId) {
        await API.post("/admin/categories", { ...values, id: editingId });
        message.success("Cập nhật thành công!");
      } else {
        await API.post("/admin/categories", values);
        message.success("Thêm mới thành công!");
      }
      setIsModalOpen(false);
      form.resetFields();
      load();
    } catch (error) {
      console.error(error);
      message.error("Lưu thất bại!");
    }
  };

  const remove = async (id) => {
    try {
      await API.delete(`/admin/categories/${id}`);
      message.success("Xóa thành công!");
      load();
    } catch (error) {
      console.error(error);
      message.error("Xóa thất bại!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2>Quản lý danh mục</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          + Thêm danh mục
        </Button>
      </div>

      <Table
        dataSource={data}
        rowKey="id"
        loading={loading}
        columns={[
          { title: "ID", dataIndex: "id" },
          { title: "Tên danh mục", dataIndex: "name" },
          { title: "Mô tả", dataIndex: "description" },
          {
            title: "Hành động",
            render: (_, r) => (
              <Space size="middle">
                <Button
                  onClick={() => {
                    setEditingId(r.id);
                    form.setFieldsValue(r);
                    setIsModalOpen(true);
                  }}
                >
                  Sửa
                </Button>
                <Popconfirm
                  title="Xóa danh mục này?"
                  onConfirm={() => remove(r.id)}
                >
                  <Button danger>Xóa</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editingId ? "Sửa danh mục" : "Thêm danh mục"}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical" onFinish={save}>
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="iconUrl" label="Icon URL">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
