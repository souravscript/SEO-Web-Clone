
const { GoogleGenerativeAI } = require("@google/generative-ai");

export const generateRoundup = async (link) => {
    try {
        const prompt=`Generate a productroundup for an amazon product with details as a general user based on this product link: ${link}`
        //console.log("Generated Prompt:\n", prompt);

        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_AI_API);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


        const result = await model.generateContent(prompt);
        const content = result.response?.text() || "Fallback content if none found";
        //console.log("generated content: ",content)
        return content;
    } catch (error) {
        console.error("Error generating blog:", error.message);
        throw error;
    }
};