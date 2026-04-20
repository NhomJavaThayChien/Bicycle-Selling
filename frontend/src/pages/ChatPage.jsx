import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  getCachedConversations,
  getMessages,
  markConversationRead,
  sendMessage,
  upsertCachedConversation,
} from "../services/chatService";

function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);

  const conversationMeta = useMemo(
    () => getCachedConversations().find((item) => String(item.conversationId) === String(id)),
    [id],
  );

  const loadMessages = useCallback(async () => {
    setError("");

    try {
      const response = await getMessages(id);
      const nextMessages = Array.isArray(response.data) ? response.data : [];
      setMessages(nextMessages);

      const lastMessage = nextMessages[nextMessages.length - 1];
      upsertCachedConversation({
        conversationId: Number(id),
        otherUsername: conversationMeta?.otherUsername,
        updatedAt: lastMessage?.sentAt || new Date().toISOString(),
      });

      await markConversationRead(id);
    } catch {
      setError("Khong tai duoc tin nhan.");
    } finally {
      setLoading(false);
    }
  }, [conversationMeta?.otherUsername, id]);

  useEffect(() => {
    setLoading(true);
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) {
      return;
    }

    setSending(true);
    setError("");

    try {
      await sendMessage({
        conversationId: Number(id),
        content: text.trim(),
      });

      setText("");
      await loadMessages();
    } catch {
      setError("Gui tin nhan that bai.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main style={{ maxWidth: "900px", margin: "24px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
        <h1 style={{ marginTop: 0 }}>
          Chat {conversationMeta?.otherUsername ? `- ${conversationMeta.otherUsername}` : ""}
        </h1>
        <button type="button" onClick={() => navigate("/inbox")} style={secondaryButtonStyle}>
          Back to Inbox
        </button>
      </div>

      {error && <div style={errorBoxStyle}>{error}</div>}

      <section
        style={{
          border: "1px solid #eaecf0",
          borderRadius: "12px",
          padding: "12px",
          minHeight: "360px",
          maxHeight: "460px",
          overflowY: "auto",
          backgroundColor: "#fcfcfd",
          marginBottom: "10px",
        }}
      >
        {loading ? (
          <p>Dang tai tin nhan...</p>
        ) : messages.length === 0 ? (
          <p>Chua co tin nhan nao.</p>
        ) : (
          messages.map((message) => {
            const isMine = Number(message.senderId) === Number(user?.userId);

            return (
              <div
                key={message.id}
                style={{
                  display: "flex",
                  justifyContent: isMine ? "flex-end" : "flex-start",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    maxWidth: "72%",
                    padding: "8px 10px",
                    borderRadius: "12px",
                    backgroundColor: isMine ? "#d1e9ff" : "#fff",
                    border: "1px solid #d0d5dd",
                  }}
                >
                  <div style={{ fontSize: "0.78rem", color: "#667085", marginBottom: "4px" }}>
                    {message.senderUsername} · {new Date(message.sentAt).toLocaleTimeString("vi-VN")}
                  </div>
                  <div>{message.content}</div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </section>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Type message..."
          style={{
            flex: 1,
            border: "1px solid #d0d5dd",
            borderRadius: "8px",
            padding: "10px",
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={sending}
          style={primaryButtonStyle}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </main>
  );
}

const errorBoxStyle = {
  marginBottom: "14px",
  border: "1px solid #fecdca",
  backgroundColor: "#fef3f2",
  color: "#b42318",
  borderRadius: "8px",
  padding: "10px 12px",
};

const secondaryButtonStyle = {
  border: "1px solid #d0d5dd",
  borderRadius: "8px",
  padding: "8px 12px",
  backgroundColor: "#fff",
  color: "#344054",
  fontWeight: 600,
  cursor: "pointer",
};

const primaryButtonStyle = {
  border: "none",
  borderRadius: "8px",
  padding: "10px 14px",
  backgroundColor: "#0c6cf2",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

export default ChatPage;
