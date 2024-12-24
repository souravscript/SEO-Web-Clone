
//const OPEN_AI_API_KEY="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"
const GEMINI_AI_API="AIzaSyAy6VSzNa5skOsptFbFAkZdr6df3NRKfUY"
const { GoogleGenerativeAI } = require("@google/generative-ai");

export const generateBlog = async (title) => {
    try {
        // Destructure data
        //const { mainKeyword, title, coreSettings, details, seo, link } = data;

        // Construct the prompt
//         const prompt = `
// Generate a blog post with the following specifications:
// - **Main Keyword**: ${mainKeyword || "Not provided"}
// - **Title**: ${title || "Create a compelling title based on the content"}
// - **AI Model**: ${coreSettings?.aiModel || "Default Model"}
// - **Language**: ${coreSettings?.language || "English"}
// - **Target Country**: ${coreSettings?.targetCountry || "Global"}
// - **Tone of Voice**: ${coreSettings?.toneOfVoice || "Neutral"}
// - **Article Size**: ${coreSettings?.articleSize || "Medium"}

// **Details:**
// - Include the following details: ${details?.includeDetails || "General details about the topic"}
// - Structure: ${details?.structure || "Introduction, main content, and conclusion"}
// - Opening Sentence: ${details?.openingSentence || "Start with an engaging sentence related to the main keyword"}
// - Specific Elements: ${details?.elements?.length > 0 ? details.elements.join(", ") : "None provided"}

// **SEO Keywords:**
// - ${seo?.keywords || "Focus on the main keyword for SEO optimization"}

// **Linking:**
// - Connection to Web: ${link?.connectToWeb || "None"}
// - URL: ${link?.url || "No external links required"}

// Write a professional, engaging, and informative blog post that adheres to these specifications. Ensure the blog is well-structured, coherent, and tailored for the target audience.

// ---

// Start the blog below:
// `;

        const prompt=`Generate a blog post with details as a professional blogger based on this title: ${title}`
        //console.log("Generated Prompt:\n", prompt);

        const genAI = new GoogleGenerativeAI(GEMINI_AI_API);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


        const result = await model.generateContent(prompt);
        //console.log("GENERATED CONTENT ",result.response.text());
        //const blog=result.response.text()
        //console.log("Generated Blog:\n", blog);
        //const content =  result.response.text() 
        // === 'string' 
        //                 ? result.response.text() 
        //                 : JSON.stringify(result.response.text());
        const content = result.response?.text() || "Fallback content if none found";
        console.log("generated content: ",content)
        return content;
    } catch (error) {
        console.error("Error generating blog:", error.message);
        throw error;
    }
};
