import { Table, Button, Modal, Input, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

// ĐIỀN CỔNG BACKEND CỦA BẠN VÀO ĐÂY
const API_BASE = "http://localhost:8080";

export default function CarApproval() {
  const [cars, setCars] = useState([]);
  const [reason, setReason] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // Hàm lấy Token từ localStorage để gửi kèm API
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); // Sửa lại chữ "token" nếu bạn lưu bằng tên khác
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const loadData = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/admin/cars/pending`,
        getAuthHeaders(),
      );
      setCars(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách:", error);
      message.error("Lỗi tải dữ liệu. Kiểm tra lại Token hoặc Server!");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const approve = async (id) => {
    try {
      // Lưu ý: post cần tham số thứ 2 là data, nếu không có data phải để object rỗng {}
      await axios.post(
        `${API_BASE}/admin/cars/${id}/approve`,
        {},
        getAuthHeaders(),
      );
      message.success("Approved!");
      loadData();
    } catch (error) {
      console.error("Lỗi khi duyệt:", error);
      message.error("Duyệt thất bại!");
    }
  };

  const reject = async () => {
    if (!reason.trim()) {
      message.warning("Vui lòng nhập lý do từ chối!");
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/admin/cars/${selectedId}/reject`,
        { reason },
        getAuthHeaders(),
      );
      message.success("Rejected!");
      setSelectedId(null);
      setReason("");
      loadData();
    } catch (error) {
      console.error("Lỗi khi từ chối:", error);
      message.error("Từ chối thất bại!");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Price", dataIndex: "price" },
    {
      title: "Action",
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => approve(record.id)}>
            Approve
          </Button>
          <Button
            danger
            onClick={() => setSelectedId(record.id)}
            style={{ marginLeft: 8 }}
          >
            Reject
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Table dataSource={cars} columns={columns} rowKey="id" />

      <Modal
        title="Reject Reason"
        open={!!selectedId}
        onOk={reject}
        onCancel={() => {
          setSelectedId(null);
          setReason(""); // Reset lại ô input khi bấm Hủy
        }}
      >
        <Input
          placeholder="Enter reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal>
    </>
  );
}
