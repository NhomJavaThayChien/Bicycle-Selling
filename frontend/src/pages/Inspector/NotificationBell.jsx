import { BellOutlined } from "@ant-design/icons";
import { Badge, Dropdown, List, Typography } from "antd";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function NotificationBell() {
  const [data, setData] = useState([]);

  const load = async () => {
    try {
      const res = await api.get("/notifications");
      // Đảm bảo data luôn là mảng để không bị lỗi crash khi gọi hàm .filter()
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Lỗi khi tải thông báo:", error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      load();
    } catch (error) {
      console.error("Lỗi khi đánh dấu đã đọc:", error);
    }
  };

  // Menu tùy chỉnh
  const customMenu = (
    <div
      style={{
        backgroundColor: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        borderRadius: "8px",
        overflow: "hidden",
        width: 320,
      }}
    >
      <List
        header={
          <div
            style={{
              padding: "10px 16px",
              fontWeight: "bold",
              fontSize: "15px",
            }}
          >
            Thông báo
          </div>
        }
        dataSource={data}
        locale={{ emptyText: "Không có thông báo nào" }}
        renderItem={(item) => (
          <List.Item
            onClick={() => markRead(item.id)}
            style={{
              padding: "12px 16px",
              cursor: "pointer",
              backgroundColor: item.read ? "#fff" : "#eff6ff",
              borderBottom: "1px solid #f0f0f0",
              transition: "background-color 0.2s",
            }}
          >
            <Typography.Text strong={!item.read}>
              {item.message}
            </Typography.Text>
          </List.Item>
        )}
        style={{ maxHeight: "400px", overflowY: "auto" }}
      />
    </div>
  );

  return (
    <Dropdown
      // Dùng dropdownRender thay cho overlay để an toàn tuyệt đối với thẻ div
      dropdownRender={() => customMenu}
      trigger={["click"]}
      placement="bottomRight"
    >
      {/* BỌC BADGE VÀO THẺ DIV: Đây là mấu chốt để fix lỗi React.Children.only */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          cursor: "pointer",
          padding: "0 8px",
        }}
      >
        <Badge
          count={data.filter((n) => !n.read).length}
          style={{ cursor: "pointer" }}
        >
          <BellOutlined
            style={{ fontSize: 22, color: "#64748b", cursor: "pointer" }}
          />
        </Badge>
      </div>
    </Dropdown>
  );
}
