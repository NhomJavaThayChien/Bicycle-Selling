import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Layout, 
  List, 
  Avatar, 
  Typography, 
  Button, 
  Spin, 
  Empty, 
  Card, 
  Badge,
  Input,
  Space
} from "antd";
import { 
  MessageSquare, 
  Search, 
  RefreshCw, 
  User as UserIcon,
  ChevronRight,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import {
  getCachedConversations,
  getMessages,
  upsertCachedConversation,
} from "../services/chatService";

const { Title, Text } = Typography;

export default function InboxPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadInbox = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const cachedItems = getCachedConversations();

      const enrichedItems = await Promise.all(
        cachedItems.map(async (item) => {
          try {
            const response = await getMessages(item.conversationId);
            const messages = Array.isArray(response.data) ? response.data : [];
            const lastMessage = messages[messages.length - 1] || null;

            const otherSender = [...messages]
              .reverse()
              .find((message) => Number(message.senderId) !== Number(user?.userId));

            const otherUsername =
              item.otherUsername ||
              otherSender?.senderUsername ||
              "Người dùng ẩn danh";

            upsertCachedConversation({
              ...item,
              otherUsername,
              updatedAt: lastMessage?.sentAt || item.updatedAt,
            });

            return {
              ...item,
              otherUsername,
              lastMessage: lastMessage?.content || "Chưa có tin nhắn nào",
              lastMessageAt: lastMessage?.sentAt || item.updatedAt,
            };
          } catch {
            return {
              ...item,
              lastMessage: "Không thể tải tin nhắn",
              lastMessageAt: item.updatedAt,
            };
          }
        })
      );

      setConversations(
        enrichedItems.sort(
          (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
        )
      );
    } catch (err) {
      console.error("Lỗi tải inbox:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  const getTimeLabel = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 24 * 3600 * 1000) {
      return date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString("vi-VN", { month: 'numeric', day: 'numeric' });
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 16px" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>Hộp thư đến</Title>
            <Text type="secondary">Quản lý các cuộc trò chuyện của bạn với người mua và người bán.</Text>
          </div>
          <Button 
            icon={<RefreshCw size={16} className={refreshing ? "spin-animation" : ""} />} 
            onClick={() => loadInbox(true)}
            loading={refreshing}
          >
            Làm mới
          </Button>
        </div>

        <Card 
          bordered={false} 
          style={{ borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", overflow: "hidden" }}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
            <Input 
              prefix={<Search size={16} style={{ color: "#bfbfbf" }} />} 
              placeholder="Tìm kiếm người dùng hoặc tin nhắn..." 
              style={{ borderRadius: 8, height: 40 }}
            />
          </div>

          {loading ? (
            <div style={{ padding: 60, textAlign: "center" }}>
              <Spin tip="Đang tải hộp thư..." />
            </div>
          ) : conversations.length === 0 ? (
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical">
                  <Text type="secondary">Chưa có cuộc hội thoại nào.</Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Hãy nhấn "Liên hệ người bán" trong trang chi tiết sản phẩm để bắt đầu.
                  </Text>
                </Space>
              }
              style={{ padding: 60 }}
            />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={conversations}
              renderItem={(item) => (
                <List.Item
                  onClick={() => navigate(`/chat/${item.conversationId}`)}
                  style={{
                    padding: "20px 24px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    borderBottom: "1px solid #f0f0f0"
                  }}
                  className="inbox-item"
                  actions={[<ChevronRight size={18} style={{ color: "#bfbfbf" }} />]}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge dot status="processing" offset={[-2, 32]}>
                        <Avatar 
                          size={54} 
                          icon={<UserIcon size={28} />} 
                          style={{ backgroundColor: "#1890ff" }} 
                        />
                      </Badge>
                    }
                    title={
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Text strong style={{ fontSize: 16 }}>{item.otherUsername}</Text>
                        <Space style={{ color: "#8c8c8c", fontSize: 12 }}>
                          <Clock size={12} />
                          {getTimeLabel(item.lastMessageAt)}
                        </Space>
                      </div>
                    }
                    description={
                      <Text 
                        type="secondary" 
                        ellipsis 
                        style={{ maxWidth: 500, display: "block", marginTop: 4 }}
                      >
                        {item.lastMessage}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </motion.div>

      <style>{`
        .inbox-item:hover {
          background-color: #f9f9f9;
        }
        .spin-animation {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
