// backend/services/aiService.js
const axios = require("axios");

const generateReadme = async (context) => {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;

    const prompt = `
      You are an expert technical writer, "RepoDoc.ai".
      Your job is to generate a professional README.md file based on a project's file structure and key file contents.

      Analyze the following context, which contains file paths and their content:
      ---
      CONTEXT:
      ${context}
      ---

      Based ONLY on the context provided, generate a complete README.md file.
      Your response MUST be only the raw markdown content. Do not include \`\`\`markdown or any other text.

      The README must include:
      1. **Project Title**
      2. **Description**
      3. **Tech Stack**
      4. **Installation**
      5. **Usage**
    `;

    // ✅ Use official Gemini v1 endpoint
const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${API_KEY}`;

    const response = await axios.post(url, {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });

    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";

    return text;
  } catch (error) {
    console.error("Error generating README:", error.response?.data || error);
    throw new Error("AI generation failed.");
  }
};

module.exports = { generateReadme };
