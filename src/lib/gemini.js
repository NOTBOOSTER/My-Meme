"use server";

import { GoogleGenAI, Modality } from "@google/genai";

const generateMeme = async (prompt) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `You are a professional meme designer AI. Your job is to generate a complete meme with a funny, short caption directly rendered inside a meme-style image.

Theme: "${prompt}"

Instructions:
- Create a single meme image that visually represents the theme in a humorous, sarcastic, or ironic way.
- The image only be a funny image not normal image.
- The image MUST contain a bold, highly readable caption overlaid directly within it.
- The caption must be exactly one to two lines long, funny, and relevant to the theme.
- Use only standard English letters (A-Z, a-z, 0-9). DO NOT use symbols, emojis, or non-standard characters in the caption.
- The meme should resemble popular viral content found on social media platforms like Instagram, Reddit, or WhatsApp.
- The ONLY text to appear in the image is the generated caption. Do NOT add any other text, watermarks, or unnecessary elements.
- Ensure the text within the image is clear, legible, and has no spelling mistakes. Double-check for accuracy.
- Focus on relatable humor or double meanings.
- Absolutely avoid:
    ❌ NSFW content
    ❌ Hate speech, politics, or religion
    ❌ Broken or unreadable text characters

Output Requirements:
- Provide the exact caption that appears in the generated image as plain text first.
- Then, provide the meme image as base64 inline data.
`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-preview-image-generation",
    contents,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  let caption = "";
  let image = null;

  for (const part of response.candidates[0].content.parts) {
    if (part.text) caption = part.text;
    if (part.inlineData?.data) image = part.inlineData.data;
  }
  const captionPrefixRegex = /^\s*(\*\*?)?Caption\s*:?\s*(\*\*?)?\s*/i;

  caption = caption.replace(captionPrefixRegex, "");

  return { caption, image };
};

export default generateMeme;
