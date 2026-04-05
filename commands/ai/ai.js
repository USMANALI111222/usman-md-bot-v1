const ai = {
  name: "ai",
  alias: ["gpt", "chatgpt", "bot", "usman"],
  description: "Chat with AI",
  category: "ai",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .ai your question");
    await reply("🤖 *Thinking...*");
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${global.config.gptKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are USMAN-MD, a helpful WhatsApp bot assistant. Be concise and helpful." },
            { role: "user", content: args.join(" ") },
          ],
          max_tokens: 500,
        }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const answer = data.choices?.[0]?.message?.content?.trim();
      if (!answer) throw new Error("No answer");

      reply(`🤖 *USMAN-MD AI:*\n\n${answer}`);
    } catch (e) {
      // Fallback free AI
      try {
        const res = await fetch(`https://api.ryzendesu.vip/api/ai/chatgpt?text=${encodeURIComponent(args.join(" "))}`);
        const data = await res.json();
        reply(`🤖 *AI:*\n\n${data.response || data.answer || data.text || "Could not get response"}`);
      } catch {
        reply("❌ AI unavailable. Please set GPT API key in config.js!");
      }
    }
  },
};

const gemini = {
  name: "gemini",
  alias: ["bard"],
  description: "Chat with Google Gemini",
  category: "ai",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .gemini your question");
    await reply("✨ *Gemini thinking...*");
    try {
      if (!global.config.geminiKey) throw new Error("No key");
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${global.config.geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: args.join(" ") }] }],
          }),
        }
      );
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No response");
      reply(`✨ *Gemini:*\n\n${text}`);
    } catch {
      // Fallback
      try {
        const res = await fetch(`https://api.ryzendesu.vip/api/ai/gemini?text=${encodeURIComponent(args.join(" "))}`);
        const data = await res.json();
        reply(`✨ *Gemini:*\n\n${data.response || "Please set Gemini API key!"}`);
      } catch {
        reply("❌ Gemini unavailable. Set key in config.js!");
      }
    }
  },
};

const codeai = {
  name: "codeai",
  description: "Get code help from AI",
  category: "ai",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .codeai how to make array in js");
    await reply("💻 *Generating code...*");
    try {
      const res = await fetch(`https://api.ryzendesu.vip/api/ai/chatgpt?text=${encodeURIComponent("Write code for: " + args.join(" ") + ". Give only code with brief explanation.")}`);
      const data = await res.json();
      reply(`💻 *Code AI:*\n\n${data.response || data.answer || "Could not generate code"}`);
    } catch {
      reply("❌ Code AI unavailable!");
    }
  },
};

const studyai = {
  name: "studyai",
  alias: ["professor"],
  description: "Study help AI",
  category: "ai",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .studyai explain photosynthesis");
    await reply("📚 *Studying...*");
    try {
      const res = await fetch(`https://api.ryzendesu.vip/api/ai/chatgpt?text=${encodeURIComponent("Explain simply for a student: " + args.join(" "))}`);
      const data = await res.json();
      reply(`📚 *Study AI:*\n\n${data.response || data.answer || "Could not get response"}`);
    } catch {
      reply("❌ Study AI unavailable!");
    }
  },
};

const imagine = {
  name: "imagine",
  description: "Generate AI image description",
  category: "ai",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .imagine a sunset over mountains");
    reply(
      `🎨 *Image Prompt:*\n\n"${args.join(" ")}"\n\n` +
      `💡 Use these AI image tools:\n` +
      `• https://deepai.org\n` +
      `• https://midjourney.com\n` +
      `• https://leonardo.ai`
    );
  },
};

module.exports = [ai, gemini, codeai, studyai, imagine];
    
