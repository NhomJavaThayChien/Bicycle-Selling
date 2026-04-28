import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Layout, 
  Input, 
  Button, 
  Avatar, 
  List, 
  Typography, 
  Space, 
  Spin, 
  Empty,
  Badge,
  Card
} from "antd";
import { 
  Send, 
  ArrowLeft, 
  MoreVertical, 
  Smile, 
  Paperclip,
  User as UserIcon,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";
import {
  getCachedConversations,
  getMessages,
  markConversationRead,
  sendMessage,
  upsertCachedConversation,
} from "../services/chatService";

const { Header, Content, Sider, Footer } = Layout;
const { Title, Text } = Typography;

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversations, setConversations] = useState([]);
  
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const activeConversation = useMemo(
    () => conversations.find((item) => String(item.conversationId) === String(id)),
    [conversations, id]
  );

  const loadConversations = useCallback(() => {
    setConversations(getCachedConversations());
  }, []);

  const loadMessages = useCallback(async () => {
    if (!id) return;
    try {
      const response = await getMessages(id);
      const nextMessages = Array.isArray(response.data) ? response.data : [];
      
      // Update messages only if changed to avoid unnecessary re-renders
      setMessages(prev => JSON.stringify(prev) !== JSON.stringify(nextMessages) ? nextMessages : prev);

      const lastMessage = nextMessages[nextMessages.length - 1];
      if (lastMessage) {
        upsertCachedConversation({
          conversationId: Number(id),
          updatedAt: lastMessage.sentAt,
        });
        loadConversations();
      }

      await markConversationRead(id);
    } catch (err) {
      console.error("Lỗi tải tin nhắn:", err);
    } finally {
      setLoading(false);
    }
  }, [id, loadConversations]);

  useEffect(() => {
    loadConversations();
    loadMessages();
  }, [id, loadConversations, loadMessages]);

  // Polling for new messages
  useEffect(() => {
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || sending) return;

    const content = text.trim();
    setText("");
    setSending(true);

    try {
      await sendMessage({
        conversationId: Number(id),
        content,
      });
      await loadMessages();
      inputRef.current?.focus();
    } catch (err) {
      console.error("Gửi tin nhắn thất bại:", err);
      setText(content); // Restore text on failure
    } finally {
      setSending(false);
    }
  };

  const renderMessage = (message) => {
    const isMine = Number(message.senderId) === Number(user?.userId);
    const sentTime = new Date(message.sentAt).toLocaleTimeString("vi-VN", { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    return (
      <div
        key={message.id}
        style={{
          display: "flex",
          justifyContent: isMine ? "flex-end" : "flex-start",
          marginBottom: 16,
          padding: "0 16px"
        }}
      >
        {!isMine && (
          <Avatar 
            icon={<UserIcon size={16} />} 
            style={{ marginRight: 8, marginTop: 4, backgroundColor: "#87d068" }} 
          />
        )}
        <div style={{ maxWidth: "70%" }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              padding: "10px 16px",
              borderRadius: isMine ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
              backgroundColor: isMine ? "#1890ff" : "#f0f2f5",
              color: isMine ? "#fff" : "#000",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
            }}
          >
            <Text style={{ color: "inherit", fontSize: 15 }}>{message.content}</Text>
          </motion.div>
          <div style={{ 
            fontSize: 11, 
            color: "#8c8c8c", 
            marginTop: 4, 
            textAlign: isMine ? "right" : "left",
            padding: "0 4px"
          }}>
            {sentTime}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout style={{ height: "calc(100vh - 64px)", background: "#fff" }}>
      <Sider
        width={320}
        theme="light"
        style={{ borderRight: "1px solid #f0f0f0" }}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}>
          <Title level={4} style={{ margin: 0 }}>Tin nhắn</Title>
          <Input 
            prefix={<Search size={16} style={{ color: "#bfbfbf" }} />} 
            placeholder="Tìm kiếm hội thoại..." 
            style={{ marginTop: 12, borderRadius: 20 }}
          />
        </div>
        <List
          dataSource={conversations}
          renderItem={(item) => (
            <List.Item
              onClick={() => navigate(`/chat/${item.conversationId}`)}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                backgroundColor: String(item.conversationId) === String(id) ? "#e6f7ff" : "transparent",
                transition: "all 0.3s"
              }}
              className="conversation-item"
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserIcon size={20} />} style={{ backgroundColor: "#1890ff" }} />}
                title={<Text strong>{item.otherUsername || "Người dùng"}</Text>}
                description={
                  <Text type="secondary" ellipsis style={{ maxWidth: 180 }}>
                    {item.lastMessage || "Nhấn để xem tin nhắn"}
                  </Text>
                }
              />
              <div style={{ fontSize: 11, color: "#bfbfbf" }}>
                {new Date(item.updatedAt).toLocaleDateString("vi-VN", { month: 'numeric', day: 'numeric' })}
              </div>
            </List.Item>
          )}
        />
      </Sider>

      <Layout>
        {id ? (
          <>
            <Header style={{ 
              background: "#fff", 
              padding: "0 24px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              borderBottom: "1px solid #f0f0f0",
              height: 64
            }}>
              <Space>
                <Button 
                  type="text" 
                  icon={<ArrowLeft size={20} />} 
                  onClick={() => navigate("/inbox")}
                  style={{ marginRight: 8 }}
                />
                <Avatar icon={<UserIcon size={20} />} style={{ backgroundColor: "#87d068" }} />
                <div>
                  <Title level={5} style={{ margin: 0 }}>{activeConversation?.otherUsername || "Đang tải..."}</Title>
                  <Text type="success" style={{ fontSize: 12 }}>● Đang hoạt động</Text>
                </div>
              </Space>
              <Space>
                <Button type="text" icon={<MoreVertical size={20} />} />
              </Space>
            </Header>

            <Content style={{ 
              background: "#fff", 
              overflowY: "auto", 
              display: "flex", 
              flexDirection: "column",
              padding: "16px 0"
            }}>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                  <Spin tip="Đang tải tin nhắn..." />
                </div>
              ) : messages.length === 0 ? (
                <Empty description="Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!" style={{ marginTop: 60 }} />
              ) : (
                messages.map(renderMessage)
              )}
              <div ref={bottomRef} />
            </Content>

            <Footer style={{ background: "#fff", padding: "16px 24px", borderTop: "1px solid #f0f0f0" }}>
              <Space.Compact style={{ width: "100%" }}>
                <Button icon={<Paperclip size={18} />} type="text" style={{ height: 46 }} />
                <Input
                  ref={inputRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  onPressEnter={handleSend}
                  style={{ 
                    borderRadius: "23px 0 0 23px", 
                    height: 46, 
                    borderRight: "none",
                    paddingLeft: 20
                  }}
                  suffix={<Smile size={20} style={{ color: "#bfbfbf", cursor: "pointer" }} />}
                />
                <Button 
                  type="primary" 
                  onClick={handleSend} 
                  loading={sending}
                  style={{ 
                    height: 46, 
                    width: 60, 
                    borderRadius: "0 23px 23px 0",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  icon={<Send size={18} />}
                />
              </Space.Compact>
            </Footer>
          </>
        ) : (
          <Content style={{ display: "flex", justifyContent: "center", alignItems: "center", background: "#f9f9f9" }}>
            <Empty description="Chọn một cuộc trò chuyện để bắt đầu" />
          </Content>
        )}
      </Layout>

      <style>{`
        .conversation-item:hover {
          background-color: #f5f5f5 !important;
        }
      `}</style>
    </Layout>
  );
}
