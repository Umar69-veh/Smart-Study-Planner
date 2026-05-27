const Groq = require("groq-sdk");

// Use environment variable when available. Do NOT hardcode secrets in source.
if (!process.env.GROQ_API_KEY) {
  console.warn(
    "GROQ_API_KEY is not set. Set GROQ_API_KEY in your environment or backend/.env for local development."
  );
}

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const DIFFICULTY_INSTRUCTIONS = {
  simple: `Use very simple language. Explain like the student is 10 years old.
Avoid jargon. Use relatable analogies. Keep sentences short.
Always end with a fun fact or encouraging note.`,

  medium: `Use clear, student-friendly language suitable for high school or early college.
Balance simplicity with accuracy. Use examples and analogies.
Introduce proper terminology but always explain it.`,

  advanced: `Use precise academic language appropriate for upper-level college students.
Include technical depth, formal definitions, and theoretical underpinnings.`,
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
4. Format responses with clear structure using markdown
5. End responses with a "💡 Quick Check" — a single question to verify understanding
6. Be encouraging and positive

IMPORTANT FORMATTING RULES:

- Always write mathematics in proper LaTeX format.

- Inline math must use single dollar signs:
$x^2 + y^2$

- Block equations must use double dollar signs:

$$
f(x)=x^2-4x+3
$$

- Never write equations like:
[ equation ]
or
( equation )

- Always use proper LaTeX commands:
\\frac{}
\\sqrt{}
\\boxed{}
\\infty
\\sum
\\pi

- Make all equations human-readable and beautifully formatted.

- Use markdown headings, bullet points, and tables when useful.

SPECIAL COMMANDS:
- "ELI5" → explain like I'm 5 years old
- "quiz me" → generate a quiz on the last discussed topic
- "summarize" → give a concise bullet-point summary
- "give example" → provide additional real-world examples
`;

const callLLM = async (
  messages,
  difficulty = "medium",
  topic = "General"
) => {
  try {
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const params = {
      model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",

      max_tokens: 800,

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

    const response = await client.chat.completions.create(
      params,
      requestOptions
    );

    const extractContent = (res) => {
      if (!res) return null;

      const c1 = res.choices?.[0]?.message?.content;
      if (typeof c1 === "string" && c1.trim().length)
        return c1.trim();

      const c2 = res.output?.[0]?.content?.[0]?.text;
      if (typeof c2 === "string" && c2.trim())
        return c2.trim();

      const c3 = res.output?.[0]?.text;
      if (typeof c3 === "string" && c3.trim())
        return c3.trim();

      const c4 = res.message?.content;
      if (typeof c4 === "string" && c4.trim())
        return c4.trim();

      return null;
    };

    const assistantText = extractContent(response);

    if (!assistantText) {
      console.error(
        "Unexpected LLM response shape:",
        JSON.stringify(response, null, 2)
      );

      throw new Error(
        "AI service returned an unexpected response."
      );
    }

    return assistantText;
  } catch (error) {
    console.error("Groq API Error:", error?.message || error);

    if (error.status === 401)
      throw new Error("Invalid Groq API key.");

    if (error.status === 429)
      throw new Error(
        "Rate limit exceeded. Try again in a moment."
      );

    throw new Error(
      `AI service error: ${error.message || String(error)}`
    );
  }
};

const generateQuiz = async (
  topic,
  difficulty = "medium"
) => {
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

  return await callLLM(
    [{ role: "user", content: prompt }],
    difficulty,
    "General"
  );
};

module.exports = {
  callLLM,
  generateQuiz,
};