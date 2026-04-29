import { useEffect, useMemo, useRef, useState } from "react";
import { askGemini, resetConversation } from "../services/chatbotService";

const QUICK_PROMPTS = [
  "Cách đặt mua xe?",
  "Theo dõi đơn hàng",
  "Đánh giá người bán",
  "Cách đăng bán xe?",
];

// Render markdown đơn giản: **bold**, *italic*, xuống dòng
function MarkdownText({ text }) {
  const rendered = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code style='background:#f1f5f9;padding:1px 5px;border-radius:4px;font-size:0.85em'>$1</code>")
    .replace(/\n/g, "<br/>");
  return (
    <span dangerouslySetInnerHTML={{ __html: rendered }} />
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div style={{ ...bubbleStyle, ...botBubbleStyle, display: "flex", gap: 5, alignItems: "center", padding: "12px 16px" }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: "#94a3b8",
              display: "inline-block",
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
        <style>{`
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      content:
        "Xin chào! 👋 Mình là trợ lý AI của **BikeMarket**.\n\nMình có thể giúp bạn tìm xe, đặt hàng, theo dõi đơn, chat với người bán và nhiều hơn nữa. Bạn cần hỗ trợ gì?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isOpen]);

  // Focus input khi mở
  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const sendQuestion = async (questionText) => {
    const question = questionText.trim();
    if (!question || loading) return;

    const userMsg = { id: Date.now(), role: "user", content: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const answer = await askGemini(question);
      const botMsg = { id: Date.now() + 1, role: "bot", content: answer };
      setMessages((prev) => [...prev, botMsg]);
      if (!isOpen) setUnread((n) => n + 1);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "bot", content: "Xin lỗi, mình gặp sự cố. Bạn thử lại nhé!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    resetConversation();
    setMessages([
      {
        id: Date.now(),
        role: "bot",
        content: "Cuộc hội thoại đã được đặt lại. Mình có thể giúp gì cho bạn? 😊",
      },
    ]);
  };

  return (
    <div style={containerStyle}>
      {isOpen && (
        <div style={panelStyle}>
          {/* Header */}
          <div style={headerStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={avatarStyle}>🤖</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>BikeMarket AI</div>
                <div style={{ fontSize: 11, opacity: 0.75, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                  Trực tuyến • Gemini 2.0 Flash
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                type="button"
                title="Xóa lịch sử chat"
                onClick={handleClearChat}
                style={iconButtonStyle}
              >
                🗑
              </button>
              <button type="button" onClick={() => setIsOpen(false)} style={{ ...iconButtonStyle, fontSize: 22 }}>
                ×
              </button>
            </div>
          </div>

          {/* Chat body */}
          <div style={chatBodyStyle}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-end",
                  gap: 8,
                }}
              >
                {msg.role === "bot" && (
                  <div style={smallAvatarStyle}>🤖</div>
                )}
                <div
                  style={{
                    ...bubbleStyle,
                    ...(msg.role === "user" ? userBubbleStyle : botBubbleStyle),
                  }}
                >
                  <MarkdownText text={msg.content} />
                </div>
              </div>
            ))}

            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 2 && (
            <div style={quickRowStyle}>
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  style={quickButtonStyle}
                  onClick={() => sendQuestion(prompt)}
                  disabled={loading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input row */}
          <div style={inputRowStyle}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi..."
              style={inputStyle}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendQuestion(input);
                }
              }}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => sendQuestion(input)}
              disabled={!canSend}
              style={{
                ...sendButtonStyle,
                opacity: canSend ? 1 : 0.45,
                cursor: canSend ? "pointer" : "not-allowed",
              }}
              title="Gửi (Enter)"
            >
              ➤
            </button>
          </div>

          <div style={{ textAlign: "center", padding: "4px 0 8px", fontSize: 10, color: "#94a3b8" }}>
            Được hỗ trợ bởi Google Gemini
          </div>
        </div>
      )}

      {/* FAB button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={fabStyle}
        title="Mở trợ lý AI"
      >
        {isOpen ? (
          <span style={{ fontSize: 24 }}>×</span>
        ) : (
          <>
            <span style={{ fontSize: 26 }}>🤖</span>
            {unread > 0 && (
              <span style={badgeStyle}>{unread}</span>
            )}
          </>
        )}
      </button>
    </div>
  );
}

/* ──────── Styles ──────── */

const containerStyle = {
  position: "fixed",
  right: "20px",
  bottom: "20px",
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
};

const fabStyle = {
  width: 60,
  height: 60,
  borderRadius: "50%",
  border: "none",
  background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
  color: "white",
  fontWeight: 800,
  boxShadow: "0 8px 24px rgba(29,78,216,0.45)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  transition: "transform 0.2s, box-shadow 0.2s",
  flexShrink: 0,
};

const badgeStyle = {
  position: "absolute",
  top: -4,
  right: -4,
  background: "#ef4444",
  color: "#fff",
  borderRadius: "50%",
  width: 18,
  height: 18,
  fontSize: 11,
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const panelStyle = {
  width: "min(94vw, 380px)",
  height: "min(75vh, 560px)",
  marginBottom: 12,
  borderRadius: 20,
  overflow: "hidden",
  backgroundColor: "#fff",
  boxShadow: "0 20px 60px rgba(15,23,42,0.20)",
  display: "flex",
  flexDirection: "column",
  border: "1px solid rgba(148,163,184,0.20)",
  animation: "slideUp 0.25s ease",
};

const headerStyle = {
  padding: "14px 16px",
  background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexShrink: 0,
};

const avatarStyle = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  background: "rgba(255,255,255,0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 18,
};

const smallAvatarStyle = {
  width: 28,
  height: 28,
  borderRadius: "50%",
  background: "#e2e8f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 14,
  flexShrink: 0,
};

const iconButtonStyle = {
  border: "none",
  background: "rgba(255,255,255,0.12)",
  color: "white",
  fontSize: 16,
  cursor: "pointer",
  lineHeight: 1,
  padding: "4px 8px",
  borderRadius: 8,
  transition: "background 0.2s",
};

const chatBodyStyle = {
  flex: 1,
  padding: "16px 14px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  background: "#f8fafc",
};

const bubbleStyle = {
  maxWidth: "80%",
  borderRadius: 18,
  padding: "10px 14px",
  fontSize: "0.9rem",
  lineHeight: 1.55,
  wordBreak: "break-word",
};

const userBubbleStyle = {
  background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
  color: "white",
  borderBottomRightRadius: 4,
};

const botBubbleStyle = {
  backgroundColor: "#fff",
  color: "#1e293b",
  borderBottomLeftRadius: 4,
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  border: "1px solid #e2e8f0",
};

const quickRowStyle = {
  display: "flex",
  gap: 6,
  padding: "0 12px 10px",
  flexWrap: "wrap",
  flexShrink: 0,
};

const quickButtonStyle = {
  border: "1px solid #c7d2fe",
  backgroundColor: "#eef2ff",
  color: "#4338ca",
  borderRadius: 20,
  padding: "5px 12px",
  fontSize: "0.77rem",
  cursor: "pointer",
  fontWeight: 600,
  transition: "background 0.15s",
};

const inputRowStyle = {
  display: "flex",
  gap: 8,
  padding: "10px 12px",
  borderTop: "1px solid #e2e8f0",
  backgroundColor: "#fff",
  flexShrink: 0,
};

const inputStyle = {
  flex: 1,
  borderRadius: 24,
  border: "1px solid #cbd5e1",
  padding: "10px 16px",
  outline: "none",
  fontSize: "0.9rem",
  background: "#f8fafc",
  transition: "border 0.2s",
};

const sendButtonStyle = {
  border: "none",
  borderRadius: "50%",
  width: 40,
  height: 40,
  background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
  color: "white",
  fontSize: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  transition: "opacity 0.2s",
};

export default ChatbotWidget;
