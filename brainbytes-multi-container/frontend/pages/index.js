import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const apiBaseUrl = useMemo(() => {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiBaseUrl}/api/messages`);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text) return;

    setSubmitting(true);
    try {
      await axios.post(`${apiBaseUrl}/api/messages`, { text });
      setNewMessage("");
      await fetchMessages();
    } catch (err) {
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>BrainBytes Chat</h1>
      <p style={{ marginTop: 0, color: "#475569" }}>
        Frontend: Next.js · Backend: Node.js · Database: MongoDB
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 10,
            border: "1px solid #cbd5e1"
          }}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "none",
            background: submitting ? "#94a3b8" : "#0ea5e9",
            color: "white",
            cursor: submitting ? "not-allowed" : "pointer"
          }}
        >
          {submitting ? "Sending..." : "Send"}
        </button>
      </form>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Messages</h2>
        <button
          onClick={fetchMessages}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #cbd5e1",
            background: "white",
            cursor: "pointer"
          }}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p>No messages yet. Be the first to say something.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
          {messages.map((m) => (
            <li
              key={m._id || `${m.createdAt}-${m.text}`}
              style={{
                padding: 12,
                margin: "10px 0",
                background: "#f1f5f9",
                borderRadius: 12
              }}
            >
              <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
              <div style={{ marginTop: 6, fontSize: 12, color: "#64748b" }}>
                {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

