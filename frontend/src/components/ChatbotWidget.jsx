import { useEffect, useMemo, useRef, useState } from "react";
import { askGemini } from "../services/chatbotService";

const QUICK_PROMPTS = [
  "How do I checkout?",
  "How to review a seller?",
  "Show me seller profile",
];

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      content: "Xin chao, minh co the giup ban tim xe, checkout, review va chat voi seller.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const sendQuestion = async (questionText) => {
    const question = questionText.trim();
    if (!question) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const answer = await askGemini(question);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          content: answer,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      {isOpen && (
        <div style={panelStyle}>
          <div style={headerStyle}>
            <div>
              <strong>Gemini Assistant</strong>
              <p style={{ margin: 0, fontSize: "0.82rem", opacity: 0.8 }}>AI help for shopping flow</p>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} style={iconButtonStyle}>
              ×
            </button>
          </div>

          <div style={chatBodyStyle}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: "flex",
                  justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    ...bubbleStyle,
                    ...(message.role === "user" ? userBubbleStyle : botBubbleStyle),
                  }}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && <p style={{ margin: 0, color: "#667085" }}>Dang tra loi...</p>}
            <div ref={messagesEndRef} />
          </div>

          <div style={quickRowStyle}>
            {QUICK_PROMPTS.map((prompt) => (
              <button key={prompt} type="button" style={quickButtonStyle} onClick={() => sendQuestion(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <div style={inputRowStyle}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask something..."
              style={inputStyle}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  sendQuestion(input);
                }
              }}
            />
            <button type="button" onClick={() => sendQuestion(input)} disabled={!canSend} style={sendButtonStyle}>
              Send
            </button>
          </div>
        </div>
      )}

      <button type="button" onClick={() => setIsOpen((prev) => !prev)} style={fabStyle}>
        {isOpen ? "×" : "AI"}
      </button>
    </div>
  );
}

const containerStyle = {
  position: "fixed",
  right: "18px",
  bottom: "18px",
  zIndex: 50,
};

const fabStyle = {
  width: "58px",
  height: "58px",
  borderRadius: "999px",
  border: "none",
  background: "linear-gradient(135deg, #0c6cf2 0%, #7c3aed 100%)",
  color: "white",
  fontWeight: 800,
  boxShadow: "0 12px 30px rgba(12,108,242,0.35)",
  cursor: "pointer",
};

const panelStyle = {
  width: "min(92vw, 360px)",
  height: "min(70vh, 520px)",
  marginBottom: "12px",
  borderRadius: "18px",
  overflow: "hidden",
  backgroundColor: "#fff",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.22)",
  display: "flex",
  flexDirection: "column",
  border: "1px solid rgba(148,163,184,0.25)",
};

const headerStyle = {
  padding: "14px 16px",
  background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const iconButtonStyle = {
  border: "none",
  background: "transparent",
  color: "white",
  fontSize: "24px",
  cursor: "pointer",
  lineHeight: 1,
};

const chatBodyStyle = {
  flex: 1,
  padding: "14px",
  overflowY: "auto",
  display: "grid",
  gap: "10px",
  background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
};

const bubbleStyle = {
  maxWidth: "82%",
  borderRadius: "16px",
  padding: "10px 12px",
  fontSize: "0.92rem",
  lineHeight: 1.45,
  whiteSpace: "pre-wrap",
};

const userBubbleStyle = {
  backgroundColor: "#0c6cf2",
  color: "white",
  borderBottomRightRadius: "4px",
};

const botBubbleStyle = {
  backgroundColor: "#e2e8f0",
  color: "#0f172a",
  borderBottomLeftRadius: "4px",
};

const quickRowStyle = {
  display: "flex",
  gap: "8px",
  padding: "0 14px 10px",
  flexWrap: "wrap",
};

const quickButtonStyle = {
  border: "1px solid #cbd5e1",
  backgroundColor: "#fff",
  borderRadius: "999px",
  padding: "6px 10px",
  fontSize: "0.78rem",
  cursor: "pointer",
};

const inputRowStyle = {
  display: "flex",
  gap: "8px",
  padding: "14px",
  borderTop: "1px solid #e2e8f0",
  backgroundColor: "#fff",
};

const inputStyle = {
  flex: 1,
  borderRadius: "999px",
  border: "1px solid #cbd5e1",
  padding: "10px 14px",
  outline: "none",
};

const sendButtonStyle = {
  border: "none",
  borderRadius: "999px",
  padding: "10px 16px",
  background: "#0f172a",
  color: "white",
  cursor: "pointer",
  fontWeight: 700,
};

export default ChatbotWidget;
