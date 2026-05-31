// ...existing code...
const Groq = require("groq-sdk");

// Use environment variable when available. Do NOT hardcode secrets in source.
const rawGroqKey = process.env.GROQ_API_KEY;
const GROQ_API_KEY = typeof rawGroqKey === "string" ? rawGroqKey.trim() : "";

// Fail fast if key is missing to avoid confusing "invalid key" runtime errors
if (!GROQ_API_KEY) {
  throw new Error(
    "GROQ_API_KEY is not set. Add GROQ_API_KEY to environment (Railway/Vercel) or backend/.env for local dev and restart the server."
  );
}

// create client only after validation
const client = new Groq({ apiKey: GROQ_API_KEY });

const DIFFICULTY_INSTRUCTIONS = {
  simple: `Use very simple language. Explain like the student is 20 years old.
Avoid jargon. Use relatable analogies. Keep sentences short.
Always end with a fun fact or encouraging note.`,

  medium: `Use clear, student-friendly language suitable for high school or early college.
Balance simplicity with accuracy. Use examples and analogies.
Introduce proper terminology but always explain it.`,

  advanced: `Use precise academic language appropriate for upper-level college students.
Include technical depth, formal definitions, theoretical underpinnings,
detailed derivations, mathematical explanations, worked examples,
real-world applications, and comprehensive analysis.`,
};

const TOPIC_CONTEXT = {
  Mathematics:
    "Focus on mathematical rigor, proofs, formulas, and worked examples.",

  "Computer Science":
    "Include code snippets in markdown where relevant. Explain algorithms step by step.",

  Science:
    "Reference scientific principles, laws, and real-world applications.",

  History:
    "Provide historical context, dates, key figures, and cause-effect relationships.",

  Language:
    "Include grammar rules, examples, and usage in sentences.",

  General: "",
  Other: "",
};

const SYSTEM_PROMPT = (difficulty, topic) => `
You are an expert AI study assistant and personal tutor named StudyMind.
Your mission is to help students truly understand academic concepts.

DIFFICULTY LEVEL: ${difficulty.toUpperCase()}
${DIFFICULTY_INSTRUCTIONS[difficulty]}

SUBJECT AREA: ${topic}
${TOPIC_CONTEXT[topic] || ""}

CORE BEHAVIORS:
1. Always explain WHY, not just WHAT
2. Use the Feynman technique: break complex ideas into simple building blocks
3. Provide 1-2 concrete real-world examples per concept
4. Format responses with clear structure using markdown.
   - Avoid using markdown tables for main content. Prefer headings, short paragraphs, and bullet/numbered lists.
   - Only use tables when the user explicitly asks for tabular data.
5. End responses with a "💡 Quick Check" — a single question to verify understanding.
6. Be encouraging and positive.

RESPONSE LENGTH RULES:
- For normal questions, provide concise answers.
- If the user asks for detailed/advanced explanation (phrases like "explain in detail", "teach me", "step by step", "with derivation", "complete notes"), provide a comprehensive academic response including:
  1) Definition
  2) Core Concept
  3) Important Formulas
  4) Mathematical Foundation
  5) Step-by-Step Explanation
  6) Derivation (if applicable)
  7) Worked Example
  8) Real-World Applications
  9) Common Mistakes
 10) Summary
 11) Quick Check Question
`;


const callLLM = async (messages, difficulty = "medium", topic = "General") => {
  try {
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const params = {
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      max_tokens: 3000,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT(difficulty, topic),
        },
        ...formattedMessages,
      ],
    };

    const requestOptions = {
      timeout: 30 * 1000,
    };

    const response = await client.chat.completions.create(params, requestOptions);

    const extractContent = (res) => {
      if (!res) return null;

      const c1 = res.choices?.[0]?.message?.content;
      if (typeof c1 === "string" && c1.trim().length) return c1.trim();

      const c2 = res.output?.[0]?.content?.[0]?.text;
      if (typeof c2 === "string" && c2.trim()) return c2.trim();

      const c3 = res.output?.[0]?.text;
      if (typeof c3 === "string" && c3.trim()) return c3.trim();

      const c4 = res.message?.content;
      if (typeof c4 === "string" && c4.trim()) return c4.trim();

      return null;
    };

    const assistantText = extractContent(response);

    if (!assistantText) {
      console.error("Unexpected LLM response shape:", JSON.stringify(response, null, 2));
      throw new Error("AI service returned an unexpected response.");
    }

    // Post-process: convert simple markdown tables into headings + bullet lists
    const tableToList = (text) => {
      const tableRegex = /(^|\n)(\|?.+\|.+\n)\|?\s*[-:]+\s*\|[-| :]+\n([\s\S]*?)(?=\n\S|$)/gm;
      return text.replace(tableRegex, (match) => {
        try {
          const lines = match.trim().split("\n").filter(Boolean);
          if (lines.length < 2) return match;

          const header = lines[0].replace(/^\|/, "").replace(/\|$/, "").split("|").map((h) => h.trim());
          const rows = lines.slice(2).map((r) => r.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim()));

          const parts = [];
          rows.forEach((row) => {
            const items = row.map((cell, i) => `**${header[i] || "Field"}:** ${cell}`).join("  \n");
            parts.push(`- ${items}`);
          });

          return "\n" + parts.join("\n") + "\n";
        } catch (e) {
          return match;
        }
      });
    };

    const finalText = tableToList(assistantText);
    return finalText;
  } catch (error) {
    const status =
      error?.status ??
      error?.statusCode ??
      error?.response?.status ??
      error?.response?.statusCode ??
      null;

    const respBody = error?.response?.data ?? error?.response ?? null;

    console.error("Groq API Error:", {
      message: error?.message,
      status,
      responseBody: respBody ? (typeof respBody === "object" ? respBody : String(respBody)) : null,
    });

    if (status === 401)
      throw new Error("Invalid Groq API key (401 Unauthorized). Check GROQ_API_KEY and restart the server.");

    if (status === 429) throw new Error("Rate limit exceeded. Try again in a moment.");

    throw new Error(`AI service error: ${error?.message || String(error)}`);
  }
};

const generateQuiz = async (topic, difficulty = "medium") => {
  const prompt = `
Generate a quiz with 5 multiple choice questions about:
"${topic}"

Format each question as:

**Q[n]. [Question text]**
A) [Option]
B) [Option]
C) [Option]
D) [Option]

Answer: [Letter]) [Brief explanation]

Make questions ${difficulty} difficulty level.
`;

  return await callLLM([{ role: "user", content: prompt }], difficulty, "General");
};

module.exports = {
  callLLM,
  generateQuiz,
};
// ...existing code...