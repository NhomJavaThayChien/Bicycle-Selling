import React from "react";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Dropdown, Avatar, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const { Text } = Typography;

export default function AdminUserMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Định nghĩa các mục trong menu
  const items = [
    {
      key: "1",
      label: "Hồ sơ của tôi",
      icon: <UserOutlined />,
      onClick: () => navigate("/admin/profile"),
    },
    {
      key: "2",
      label: "Cài đặt hệ thống",
      icon: <SettingOutlined />,
      onClick: () => console.log("Cài đặt"),
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true, // Hiển thị màu đỏ
      onClick: handleLogout,
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <div style={styles.userWrapper}>
        <Space size={12}>
          <div style={styles.userInfo}>
            <Text strong style={styles.userName}>
              {user?.username || "Quản trị viên"}
            </Text>
            <Text type="secondary" style={styles.userRole}>
              Quản trị viên hệ thống
            </Text>
          </div>
          <Avatar size={40} style={styles.avatar}>
            {(user?.username || "V").charAt(0).toUpperCase()}
          </Avatar>
        </Space>
      </div>
    </Dropdown>
  );
}

const styles = {
  userWrapper: {
    padding: "4px 8px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 0.3s",
    "&:hover": {
      backgroundColor: "#f1f5f9",
    },
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    lineHeight: "1.2",
  },
  userName: {
    fontSize: "14px",
    color: "#1e293b",
  },
  userRole: {
    fontSize: "11px",
    color: "#64748b",
  },
  avatar: {
    backgroundColor: "#3b82f6",
    verticalAlign: "middle",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
  },
};
