import { Table, Button, Modal, Input, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080";

export default function Category() {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  // 1. Tạo hàm lấy cấu hình chứa Token
  const getAuthHeaders = () => {
    // Lưu ý: Thay "token" bằng đúng từ khóa bạn dùng khi lưu lúc Login
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const load = async () => {
    try {
      // 2. Kèm token vào request GET
      const res = await axios.get(
        `${API_BASE}/admin/categories`,
        getAuthHeaders(),
      );
      setData(res.data);
    } catch (error) {
      console.error(error);
      message.error("Lỗi 401: Bạn chưa đăng nhập hoặc Token hết hạn!");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    try {
      if (editing) {
        // Kèm token vào request PUT
        await axios.put(
          `${API_BASE}/admin/categories/${editing}`,
          { name },
          getAuthHeaders(),
        );
      } else {
        // Kèm token vào request POST
        await axios.post(
          `${API_BASE}/admin/categories`,
          { name },
          getAuthHeaders(),
        );
      }

      message.success("Lưu thành công!");
      setName("");
      setEditing(null);
      load();
    } catch (error) {
      console.error(error);
      message.error("Lưu thất bại: Không có quyền truy cập!");
    }
  };

  const remove = async (id) => {
    try {
      // Kèm token vào request DELETE
      await axios.delete(
        `${API_BASE}/admin/categories/${id}`,
        getAuthHeaders(),
      );
      message.success("Xóa thành công!");
      load();
    } catch (error) {
      console.error(error);
      message.error("Xóa thất bại!");
    }
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => setEditing(0)}
        style={{ marginBottom: 16 }}
      >
        Add Category
      </Button>

      <Table
        dataSource={data}
        rowKey="id"
        columns={[
          { title: "Name", dataIndex: "name" },
          {
            title: "Action",
            render: (_, r) => (
              <>
                <Button
                  style={{ marginRight: 8 }}
                  onClick={() => {
                    setEditing(r.id);
                    setName(r.name);
                  }}
                >
                  Edit
                </Button>
                <Button danger onClick={() => remove(r.id)}>
                  Delete
                </Button>
              </>
            ),
          },
        ]}
      />

      <Modal
        title={editing ? "Edit Category" : "Add Category"}
        open={editing !== null}
        onOk={save}
        onCancel={() => {
          setEditing(null);
          setName("");
        }}
      >
        <Input
          placeholder="Nhập tên category..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Modal>
    </>
  );
}
