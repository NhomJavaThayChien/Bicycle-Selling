import React, { useState, useEffect } from "react";
import { Badge, Popover, List, Typography, Button, Spin } from "antd";
import { BellOutlined, CheckCircleOutlined } from "@ant-design/icons";
// import axios from 'axios';

const { Text } = Typography;

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Giả lập dữ liệu fetch từ API
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        title: "Yêu cầu kiểm định mới",
        description: "Xe đạp Giant Escape 3 cần kiểm định",
        read: false,
      },
      {
        id: 2,
        title: "Tranh chấp mới",
        description: "Đơn hàng #1024 có khiếu nại",
        read: false,
      },
      {
        id: 3,
        title: "Giao dịch thành công",
        description: "Đã nhận phí dịch vụ 50.000đ",
        read: true,
      },
    ]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    // TODO: Gọi API axios.put(`/api/notifications/${id}/read`)
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const content = (
    <div style={{ width: 350, maxHeight: 400, overflowY: "auto" }}>
      <Spin spinning={loading}>
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              style={{
                background: item.read ? "#fff" : "#f0f5ff",
                padding: "10px",
                cursor: "pointer",
              }}
              onClick={() => markAsRead(item.id)}
              actions={
                !item.read
                  ? [
                      <CheckCircleOutlined
                        style={{ color: "#1890ff" }}
                        title="Đánh dấu đã đọc"
                      />,
                    ]
                  : []
              }
            >
              <List.Item.Meta
                title={<Text strong={!item.read}>{item.title}</Text>}
                description={item.description}
              />
            </List.Item>
          )}
        />
        {notifications.length === 0 && (
          <div style={{ textAlign: "center", padding: 20 }}>
            Không có thông báo nào
          </div>
        )}
      </Spin>
    </div>
  );

  return (
    <Popover
      placement="bottomRight"
      title="Thông báo"
      content={content}
      trigger="click"
    >
      <Badge count={unreadCount} style={{ cursor: "pointer" }}>
        <BellOutlined
          style={{ fontSize: "20px", cursor: "pointer", color: "#fff" }}
        />
      </Badge>
    </Popover>
  );
}
