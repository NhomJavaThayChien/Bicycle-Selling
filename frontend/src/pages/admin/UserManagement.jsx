import { Table, Button, Select, message, Tag } from "antd";
import { useEffect, useState } from "react";
import API from "../../services/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = (role = "") => {
    setLoading(true);
    API.get("/admin/users", {
      params: { role },
    })
      .then((res) => {
        // Backend trả về List<User> trực tiếp hoặc bọc trong content
        setUsers(res.data.content || res.data);
      })
      .catch((err) => {
        console.error("Lỗi tải users:", err);
        message.error("Lỗi khi tải danh sách người dùng");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggle = (id, currentStatus) => {
    const newStatus = !currentStatus;
    API.patch(`/admin/users/${id}/activate`, null, {
      params: { active: newStatus },
    })
      .then(() => {
        message.success("Đã cập nhật trạng thái người dùng!");
        loadUsers();
      })
      .catch((err) => {
        console.error("Lỗi cập nhật:", err);
        message.error("Cập nhật thất bại!");
      });
  };

  const deleteUser = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      API.delete(`/admin/users/${id}`)
        .then(() => {
          message.success("Đã xóa người dùng!");
          loadUsers();
        })
        .catch((err) => {
          console.error("Lỗi xóa:", err);
          message.error("Xóa thất bại!");
        });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Quản lý người dùng</h2>
      <Select
        placeholder="Lọc theo vai trò"
        onChange={(val) => loadUsers(val)}
        style={{ width: 200, marginBottom: 20 }}
        allowClear
      >
        <Select.Option value="ADMIN">ADMIN</Select.Option>
        <Select.Option value="SELLER">SELLER</Select.Option>
        <Select.Option value="BUYER">BUYER</Select.Option>
        <Select.Option value="INSPECTOR">INSPECTOR</Select.Option>
      </Select>

      <Table
        dataSource={users}
        rowKey="id"
        loading={loading}
        columns={[
          {
            title: "Tên đầy đủ",
            dataIndex: "fullName",
            render: (text, record) => text || record.username,
          },
          {
            title: "Email",
            dataIndex: "email",
          },
          {
            title: "Vai trò",
            dataIndex: "role",
            render: (role) => (
              <Tag color={role === "ADMIN" ? "red" : "blue"}>{role}</Tag>
            ),
          },
          {
            title: "Trạng thái",
            dataIndex: "isActive",
            render: (isActive) => (
              <Tag color={isActive ? "green" : "gray"}>
                {isActive ? "Hoạt động" : "Bị khóa"}
              </Tag>
            ),
          },
          {
            title: "Thao tác",
            render: (_, r) => (
              <>
                <Button
                  size="small"
                  danger={r.isActive}
                  onClick={() => toggle(r.id, r.isActive)}
                  style={{ marginRight: 8 }}
                >
                  {r.isActive ? "Khóa" : "Mở khóa"}
                </Button>
                <Button
                  size="small"
                  type="primary"
                  danger
                  onClick={() => deleteUser(r.id)}
                >
                  Xóa
                </Button>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
