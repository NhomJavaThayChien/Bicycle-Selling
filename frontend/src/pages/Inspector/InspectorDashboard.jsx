import { Table, Button, Tag, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

// Khai báo đường dẫn gốc của Backend
const API_BASE = "http://localhost:8080";

export default function InspectorDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hàm lấy Token từ localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); // Sửa lại chữ "token" nếu bạn lưu tên khác
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const load = async () => {
    setLoading(true);
    try {
      // Bổ sung API_BASE và getAuthHeaders()
      const res = await axios.get(
        `${API_BASE}/inspector/requests`,
        getAuthHeaders(),
      );
      setData(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách yêu cầu:", error);
      message.error("Không thể tải dữ liệu kiểm định!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const columns = [
    { title: "Car", dataIndex: "carName" },
    { title: "Owner", dataIndex: "ownerName" },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <Tag color="orange">{s}</Tag>,
    },
    {
      title: "Action",
      render: (_, r) => (
        <Button type="primary" href={`/inspector/form/${r.id}`}>
          Inspect
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard Kiểm Định Viên</h2>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={loading} // Thêm hiệu ứng loading cho bảng
      />
    </div>
  );
}
