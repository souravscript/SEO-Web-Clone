import { toast } from "sonner";
//const { GoogleGenerativeAI } = require("@google/generative-ai");
const DEFAULT_LLM = "openrouter";

export const generateReview = async (product_url) => {
    try {
        console.log("Generating review for URL:", product_url);
        
        const response = await fetch("/api/product/review/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ 
                product_url, 
                llm: DEFAULT_LLM 
            }),
        });

        // Detailed error handling
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Review Generation Error:", errorData);
            
            // Show error toast and return
            toast.error(
                "Failed to generate review", {
                    description: "Please try again"
                }
            );
            return null;
        }

        // Parse the response
        const data = await response.json();
        console.log("Generated Review:\n", data);
        
        // Return the technical review or a fallback message
        const content = data?.technical_review || "Unable to generate review at this time.";
        // Clean up markdown markers
        return content.replace(/^```markdown\n?/, '').replace(/```$/, '').trim();

    } catch (error) {
        console.error("Review Generation Process Error:", error);
        
        // Show error toast and return
        toast.error("Review Generation Failed", {
            description: error.message
        });
        return null;
    }
};
