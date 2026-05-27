# 🧠 StudyMind — AI-Based Study Helper Chatbot

A full-stack AI-powered study assistant built with React, Node.js, Express, MongoDB, and Claude AI (Anthropic). Students can ask academic questions, get concept explanations, generate quizzes, and maintain full chat history — all in a sleek, responsive UI.

---

## 📁 Folder Structure

```
study-helper/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── errorHandler.js    # Global error handling
│   ├── models/
│   │   └── ChatSession.js     # MongoDB schema
│   ├── routes/
│   │   └── chat.js            # API routes
│   ├── services/
│   │   └── llmService.js      # Claude AI integration
│   ├── .env.example           # Environment template
│   ├── package.json
│   └── server.js              # Express entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx        # Session history panel
│   │   │   ├── MessageBubble.jsx  # Chat message (user/bot)
│   │   │   ├── TypingIndicator.jsx
│   │   │   ├── ChatInput.jsx      # Input + quick prompts
│   │   │   ├── SettingsBar.jsx    # Difficulty + topic picker
│   │   │   └── WelcomeScreen.jsx  # Starter prompts
│   │   ├── hooks/
│   │   │   └── useChat.js         # All chat state logic
│   │   ├── utils/
│   │   │   └── api.js             # Axios API calls
│   │   ├── styles/
│   │   │   └── globals.css        # Design system + tokens
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** (local or MongoDB Atlas)
- **Anthropic API Key** → get one at https://console.anthropic.com

---

## 🚀 Setup & Run

### Step 1: Clone / unzip the project

```bash
cd study-helper
```

### Step 2: Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/study-helper
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
NODE_ENV=development
```

Start backend:
```bash
npm run dev      # Development (with auto-reload via nodemon)
# or
npm start        # Production
```

### Step 3: Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | Send message, get AI response |
| `GET` | `/api/chat/sessions` | List all chat sessions |
| `GET` | `/api/chat/sessions/:id` | Get full session history |
| `DELETE` | `/api/chat/sessions/:id` | Delete a session |
| `POST` | `/api/chat/quiz` | Generate quiz on a topic |
| `PATCH` | `/api/chat/sessions/:id/settings` | Update difficulty/topic |
| `GET` | `/health` | Server health check |

### POST /api/chat — Request Body
```json
{
  "message": "Explain recursion with examples",
  "sessionId": "optional-uuid-for-context",
  "difficulty": "medium",
  "topic": "Computer Science"
}
```

---

## 🎓 Features

- **Difficulty levels**: Simple (ELI10), Medium, Advanced
- **Subject topics**: Math, CS, Science, History, Language
- **Quick prompts**: Quiz me, Summarize, ELI5, Give Example
- **Context-aware**: Full chat history sent to AI for coherent multi-turn conversations
- **Markdown rendering**: Bold, code blocks, tables, lists
- **Chat history**: Persisted in MongoDB, listed in sidebar
- **Dark/Light theme**: Toggle in header
- **Error handling**: Graceful error display + recovery

---

## 🧪 Special AI Commands

Type these in the chat:
- `quiz me` → Generates a quiz on recent topic
- `ELI5` or `explain simply` → Switches to childlike explanation
- `summarize` → Bullet-point summary
- `give example` → Real-world examples

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, ReactMarkdown |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| AI | Claude claude-sonnet-4-20250514 (Anthropic) |
| Styling | Pure CSS with CSS Variables |
| HTTP Client | Axios |

---

## 📝 MongoDB Schema

```js
ChatSession {
  sessionId: String (unique),
  title: String,
  topic: Enum[General, Mathematics, CS, Science, History, Language, Other],
  difficulty: Enum[simple, medium, advanced],
  messages: [{ role: "user"|"assistant", content: String, timestamp: Date }],
  messageCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```
