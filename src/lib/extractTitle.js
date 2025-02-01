
const { GoogleGenerativeAI } = require("@google/generative-ai");

export const extractTitleFromContent = async (content) => {
  try {
    const prompt = `
You are an expert at creating engaging and concise titles for product-related content. 
The content provided could be a product review, a product roundup, or a detailed overview guide referenced from an Amazon link. 
Your task is to generate a title that is:
1. Clear and descriptive.
2. Engaging and attention-grabbing.
3. Optimized for readability and SEO.
4. No longer than 3-4 words.

Here is the content:
${content}

Please generate a title that best represents the content.
`;

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_AI_API);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


    const result = await model.generateContent(prompt);
    const generatedTitle = result.response?.text() || "Fallback content if none found";
    console.log("generated content: ",typeof generatedTitle)
    return generatedTitle;
} catch (error) {
    console.error("Error generating blog:", error.message);
    throw error;
}
  };