import { Table, Button, Modal, Input, message, Tag } from "antd";
import { useEffect, useState } from "react";
import API from "../../services/api";

export default function CarApproval() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/listings/pending");
      setListings(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách:", error);
      message.error("Lỗi tải dữ liệu tin đăng chờ duyệt!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const approve = async (id) => {
    try {
      await API.patch(`/admin/listings/${id}/approve`);
      message.success("Đã duyệt tin đăng!");
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
      await API.patch(`/admin/listings/${selectedId}/reject`, null, {
        params: { reason },
      });
      message.success("Đã từ chối tin đăng!");
      setSelectedId(null);
      setReason("");
      loadData();
    } catch (error) {
      console.error("Lỗi khi từ chối:", error);
      message.error("Từ chối thất bại!");
    }
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "primaryImageUrl",
      render: (url) => {
        let displayUrl = url || "https://via.placeholder.com/50";
        if (displayUrl.startsWith("/uploads")) {
          displayUrl = `http://localhost:8080${displayUrl}`;
        }
        return (
          <img
            src={displayUrl}
            alt="bike"
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
        );
      },
    },
    { title: "Tiêu đề", dataIndex: "title" },
    {
      title: "Giá",
      dataIndex: "price",
      render: (p) => `${p?.toLocaleString()}đ`,
    },
    { title: "Người bán", dataIndex: "sellerUsername" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => <Tag color="orange">{status}</Tag>,
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => approve(record.id)}>
            Duyệt
          </Button>
          <Button
            danger
            onClick={() => setSelectedId(record.id)}
            style={{ marginLeft: 8 }}
          >
            Từ chối
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Duyệt tin đăng xe đạp</h2>
      <Table
        dataSource={listings}
        columns={columns}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title="Lý do từ chối"
        open={!!selectedId}
        onOk={reject}
        onCancel={() => {
          setSelectedId(null);
          setReason("");
        }}
      >
        <Input.TextArea
          placeholder="Nhập lý do từ chối..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
        />
      </Modal>
    </div>
  );
}
