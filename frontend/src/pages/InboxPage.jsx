import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  getCachedConversations,
  getMessages,
  upsertCachedConversation,
} from "../services/chatService";

function InboxPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInbox = useCallback(async () => {
    setLoading(true);
    setError("");

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
              .find(
                (message) => Number(message.senderId) !== Number(user?.userId),
              );

            const otherUsername =
              item.otherUsername ||
              otherSender?.senderUsername ||
              "Unknown user";

            upsertCachedConversation({
              ...item,
              otherUsername,
              updatedAt: lastMessage?.sentAt || item.updatedAt,
            });

            return {
              ...item,
              otherUsername,
              lastMessage: lastMessage?.content || "No messages yet",
              lastMessageAt: lastMessage?.sentAt || item.updatedAt,
            };
          } catch {
            return {
              ...item,
              lastMessage: "Cannot load messages",
              lastMessageAt: item.updatedAt,
            };
          }
        }),
      );

      setConversations(
        enrichedItems.sort(
          (a, b) =>
            new Date(b.lastMessageAt).getTime() -
            new Date(a.lastMessageAt).getTime(),
        ),
      );
    } catch {
      setError("Khong tai duoc inbox.");
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  const hasItems = useMemo(() => conversations.length > 0, [conversations]);

  return (
    <main style={{ maxWidth: "900px", margin: "24px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ marginTop: 0 }}>Inbox</h1>
        <button type="button" onClick={loadInbox} style={secondaryButtonStyle}>
          Refresh
        </button>
      </div>

      {error && (
        <div style={errorBoxStyle}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Dang tai hoi thoai...</p>
      ) : !hasItems ? (
        <section style={emptyStyle}>
          <p style={{ marginTop: 0 }}>Chua co hoi thoai nao.</p>
          <p style={{ marginBottom: 0, color: "#667085" }}>
            Nhan "Contact Seller" trong trang chi tiet xe de tao chat.
          </p>
        </section>
      ) : (
        <div style={{ display: "grid", gap: "10px" }}>
          {conversations.map((conversation) => (
            <button
              key={conversation.conversationId}
              type="button"
              onClick={() => navigate(`/chat/${conversation.conversationId}`)}
              style={cardButtonStyle}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                <strong>{conversation.otherUsername || "Unknown user"}</strong>
                <span style={{ color: "#667085", fontSize: "0.82rem" }}>
                  {conversation.lastMessageAt
                    ? new Date(conversation.lastMessageAt).toLocaleString("vi-VN")
                    : "-"}
                </span>
              </div>
              <p
                style={{
                  marginBottom: 0,
                  marginTop: "6px",
                  color: "#475467",
                  textAlign: "left",
                }}
              >
                {conversation.lastMessage || "No messages yet"}
              </p>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}

const cardButtonStyle = {
  border: "1px solid #eaecf0",
  borderRadius: "12px",
  padding: "12px",
  backgroundColor: "#fff",
  cursor: "pointer",
  textAlign: "left",
};

const emptyStyle = {
  border: "1px dashed #d0d5dd",
  borderRadius: "10px",
  padding: "24px",
  textAlign: "center",
  backgroundColor: "#fcfcfd",
};

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

export default InboxPage;
