import { Table, Button, Select, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = (role = "") => {
    const token = localStorage.getItem("token");

    // Thêm kiểm tra: Nếu chưa có token (chưa đăng nhập) thì báo lỗi ngay
    if (!token) {
      message.error("Bạn chưa đăng nhập hoặc thiếu token xác thực!");
      return;
    }

    setLoading(true);

    axios
      .get(`${API_BASE}/api/admin/users`, {
        params: { role },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data && res.data.content) {
          setUsers(res.data.content);
        } else {
          setUsers(res.data);
        }
      })
      .catch((err) => {
        console.error("Chi tiết lỗi:", err.response);
        if (err.response?.status === 401) {
          message.error(
            "Phiên đăng nhập hết hạn hoặc bạn không có quyền Admin!",
          );
        } else if (err.response?.status === 403) {
          message.error(
            "Tài khoản của bạn không có quyền truy cập chức năng này!",
          );
        } else {
          message.error("Lỗi khi tải danh sách người dùng");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggle = (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.error("Bạn chưa đăng nhập!");
      return;
    }

    axios
      .post(
        `${API_BASE}/api/admin/users/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        message.success("Đã cập nhật trạng thái người dùng!");
        loadUsers(); // Load lại danh sách sau khi sửa
      })
      .catch((err) => {
        console.error("Chi tiết lỗi cập nhật:", err.response);
        if (err.response?.status === 401) {
          message.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        } else {
          message.error("Cập nhật thất bại! Vui lòng thử lại.");
        }
      });
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
        <Select.Option value="">Tất cả</Select.Option>
        <Select.Option value="ADMIN">Quản trị viên (ADMIN)</Select.Option>
        <Select.Option value="USER">Người dùng (USER)</Select.Option>
      </Select>

      <Table
        dataSource={users}
        rowKey="id"
        loading={loading}
        columns={[
          {
            title: "Tên",
            // ĐÃ SỬA: Kiểm tra cả 2 trường hợp tên có thể trả về từ backend
            render: (_, record) =>
              record.fullName || record.name || "Chưa cập nhật",
          },
          {
            title: "Email",
            dataIndex: "email",
          },
          {
            title: "Vai trò",
            dataIndex: "role",
            render: (role) => (
              <span
                style={{
                  color: role === "ADMIN" ? "red" : "blue",
                  fontWeight: "bold",
                }}
              >
                {role}
              </span>
            ),
          },
          {
            title: "Trạng thái",
            dataIndex: "active",
            render: (active) => (
              <span style={{ color: active ? "green" : "gray" }}>
                {active ? "Đang hoạt động" : "Đã khóa"}
              </span>
            ),
          },
          {
            title: "Thao tác",
            render: (_, r) => (
              <Button danger={r.active} onClick={() => toggle(r.id)}>
                {r.active ? "Khóa tài khoản" : "Mở khóa"}
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
