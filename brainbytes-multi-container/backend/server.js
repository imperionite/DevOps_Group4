const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || "mongodb://mongo:27017/brainbytes";

mongoose
  .connect(mongoUri)
  .then(() => {})
  .catch(() => {});

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

const Message = mongoose.model("Message", messageSchema);

app.get("/", (_req, res) => {
  res.json({ message: "BrainBytes API is running" });
});

app.get("/api/messages", async (_req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load messages" });
  }
});

app.post("/api/messages", async (req, res) => {
  try {
    const text = typeof req.body?.text === "string" ? req.body.text : "";
    if (!text.trim()) {
      res.status(400).json({ error: "Message text is required" });
      return;
    }
    const saved = await new Message({ text }).save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to save message" });
  }
});

app.listen(port, () => {});

