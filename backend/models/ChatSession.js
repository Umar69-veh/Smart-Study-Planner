const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      default: "New Chat",
    },
    topic: {
      type: String,
      enum: ["General", "Mathematics", "Computer Science", "Science", "History", "Language", "Other"],
      default: "General",
    },
    difficulty: {
      type: String,
      enum: ["simple", "medium", "advanced"],
      default: "medium",
    },
    messages: [messageSchema],
    messageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate title from first user message
chatSessionSchema.pre("save", function (next) {
  if (this.messages.length === 1 && this.messages[0].role === "user") {
    const firstMsg = this.messages[0].content;
    this.title = firstMsg.length > 50 ? firstMsg.substring(0, 50) + "..." : firstMsg;
  }
  this.messageCount = this.messages.length;
  next();
});

module.exports = mongoose.model("ChatSession", chatSessionSchema);
