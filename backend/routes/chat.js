const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const ChatSession = require("../models/ChatSession");
const { callLLM, generateQuiz } = require("../services/llmService");
const authMiddleware = require("../middleware/authMiddleware");


// POST /api/chat — Send a message and get AI response
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { message, sessionId, difficulty = "medium", topic = "General" } = req.body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ success: false, error: "Message is required." });
    }

    if (message.trim().length > 2000) {
      return res.status(400).json({ success: false, error: "Message too long. Max 2000 characters." });
    }

    const validDifficulties = ["simple", "medium", "advanced"];
    const validTopics = ["General", "Mathematics", "Computer Science", "Science", "History", "Language", "Other"];

    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({ success: false, error: "Invalid difficulty level." });
    }
    if (!validTopics.includes(topic)) {
      return res.status(400).json({ success: false, error: "Invalid topic." });
    }

    // Get or create chat session
    let session;
    const activeSessionId = sessionId || uuidv4();

    if (sessionId) {
      session = await ChatSession.findOne({ sessionId, userId: req.user.id });
      if (!session) {
        return res.status(404).json({ success: false, error: "Chat session not found." });
      }
    } else {
      session = new ChatSession({
        userId: req.user.id,
        sessionId: activeSessionId,
        difficulty,
        topic,
        messages: [],
      });
    }


    // Add user message to history
    session.messages.push({ role: "user", content: message.trim() });

    // Build conversation history for context (last 20 messages max)
    const historyForLLM = session.messages.slice(-20).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Call AI
    const aiResponse = await callLLM(historyForLLM, session.difficulty, session.topic);

    // Save AI response
    session.messages.push({ role: "assistant", content: aiResponse });

    // Update difficulty/topic if changed (only on new sessions or explicit change)
    if (!sessionId) {
      session.difficulty = difficulty;
      session.topic = topic;
    }

    await session.save();

    res.status(200).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        response: aiResponse,
        title: session.title,
        messageCount: session.messageCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/chat/sessions — Get all chat sessions (summary list)
router.get("/sessions", authMiddleware, async (req, res, next) => {
  try {
    const sessions = await ChatSession.find(
      { userId: req.user.id },
      { sessionId: 1, title: 1, topic: 1, difficulty: 1, messageCount: 1, updatedAt: 1 }
    )
      .sort({ updatedAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    next(error);
  }
});

// GET /api/chat/sessions/:sessionId — Get full chat history for a session
router.get("/sessions/:sessionId", authMiddleware, async (req, res, next) => {
  try {
    const session = await ChatSession.findOne({ sessionId: req.params.sessionId, userId: req.user.id });

    if (!session) {
      return res.status(404).json({ success: false, error: "Session not found." });
    }

    res.status(200).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/chat/sessions/:sessionId — Delete a session
router.delete("/sessions/:sessionId", authMiddleware, async (req, res, next) => {
  try {
    const session = await ChatSession.findOneAndDelete({ sessionId: req.params.sessionId, userId: req.user.id });

    if (!session) {
      return res.status(404).json({ success: false, error: "Session not found." });
    }

    res.status(200).json({ success: true, message: "Session deleted successfully." });
  } catch (error) {
    next(error);
  }
});

// POST /api/chat/quiz — Generate a quiz on a topic
router.post("/quiz", authMiddleware, async (req, res, next) => {
  try {
    const { topic, difficulty = "medium" } = req.body;

    if (!topic || topic.trim() === "") {
      return res.status(400).json({ success: false, error: "Topic is required for quiz generation." });
    }

    const quiz = await generateQuiz(topic.trim(), difficulty);

    res.status(200).json({ success: true, data: { quiz } });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/chat/sessions/:sessionId/settings — Update session difficulty/topic
router.patch("/sessions/:sessionId/settings", authMiddleware, async (req, res, next) => {
  try {
    const { difficulty, topic } = req.body;
    const updateData = {};

    if (difficulty) updateData.difficulty = difficulty;
    if (topic) updateData.topic = topic;

    const session = await ChatSession.findOneAndUpdate(
      { sessionId: req.params.sessionId, userId: req.user.id },
      updateData,
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ success: false, error: "Session not found." });
    }

    res.status(200).json({ success: true, data: { difficulty: session.difficulty, topic: session.topic } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
