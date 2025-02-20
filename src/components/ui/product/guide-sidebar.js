"use client";
import { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const GuideSidebar = ({ handleGenerate, handleSave, setApiData }) => {
  const [keywords, setKeywords] = useState(""); // New state for keywords
  const [title, setTitle] = useState(""); // Stores title input
  const [description, setDescription] = useState(""); // Stores description input
  const [articleSize, setArticleSize] = useState(""); // Stores article size selection

  const [isKeywordsGenerating, setIsKeywordsGenerating] = useState(false);
  const [isTitleGenerating, setIsTitleGenerating] = useState(false);
  const [isDescriptionGenerating, setIsDescriptionGenerating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleKeywordsGeneration = async () => {
    if (keywords.trim() === "") {
      console.error("Please enter valid keywords.");
      return;
    }

    setIsKeywordsGenerating(true);

    try {
      const response = await fetch("/api/product/guide/title", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keywords }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate title from keywords");
      }

      const data = await response.json();
      console.log("Generated title from keywords:", data.title);
      let cleanTitle = data.title.replace(/^"(.*)"$/, "$1").trim();
      console.log("Cleaned title:", cleanTitle);
      setTitle(cleanTitle);

    } catch (error) {
      console.error("Error during keywords generation:", error);
    } finally {
      setIsKeywordsGenerating(false);
    }
  };

  const handleTitleGeneration = async () => {
    if (title.trim() === "") {
      console.error("Please enter a valid title.");
      return;
    }

    setIsTitleGenerating(true);

    try {
      const response = await fetch("/api/product/guide/description", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titleInput: title }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate description");
      }
      
      const data = await response.json();
      console.log("Generated description:", data?.description);
      const cleanDescription = data?.description?.replace(/^"(.*)"$/, "$1").trim();
      console.log("Generated description:", cleanDescription);
      setDescription(cleanDescription);

    } catch (error) {
      console.error("Error during description generation:", error);
    } finally {
      setIsTitleGenerating(false);
    }
  };

  const handleFinalGeneration = async () => {
    if (!articleSize) {
      console.error("Please select an article size.");
      return;
    }

    setIsGenerating(true);

    try {
        await handleGenerate(title,description,articleSize);
    } catch (error) {
      console.error("Error during final generation:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-[780px] mx-auto mt-3">
      <div className="flex items-end gap-4 w-full mb-3">
        <div className="flex flex-col flex-grow">
          <label className="text-gray-700 font-medium">Keywords <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="Enter Keywords for Guide..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
          />
        </div>
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={handleKeywordsGeneration}
            disabled={isKeywordsGenerating || keywords.trim() === ""}
            className={`px-4 py-2 text-primary border border-solid bg-paleYellow text-tabColor border-tabColor rounded-md 
              ${(isKeywordsGenerating || keywords.trim() === "") ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isKeywordsGenerating ? (
              <div className="flex items-center justify-center">
                <svg 
                  className="animate-spin h-5 w-5 mr-2" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  ></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating Title...
              </div>
            ) : (
              "Generate Title"
            )}
          </button>
        </div>
      </div>

      <div className="flex items-end gap-4 w-full mb-3">
        <div className="flex flex-col flex-grow">
          <label className="text-gray-700 font-medium">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="Enter Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
          />
        </div>
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={handleTitleGeneration}
            disabled={isTitleGenerating || title.trim() === ""}
            className={`px-4 py-2 text-primary border border-solid bg-paleYellow text-tabColor border-tabColor rounded-md 
              ${(isTitleGenerating || title.trim() === "") ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isTitleGenerating ? (
              <div className="flex items-center justify-center">
                <svg 
                  className="animate-spin h-5 w-5 mr-2" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  ></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating Description...
              </div>
            ) : (
              "Generate Description"
            )}
          </button>
        </div>
      </div>

      <div className="flex items-end gap-4 w-full mb-3">
        <div className="flex flex-col flex-grow">
          <label className="text-gray-700 font-medium">Description <span className="text-red-500">*</span></label>
          <Textarea
            placeholder="Enter a detailed description for your guide..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-y min-h-[100px]"
          />
        </div>
      </div>

      <div className="flex flex-col flex-grow mb-3">
        <label className="text-gray-700 font-medium mb-2">Select Article Size <span className="text-red-500">*</span></label>
        <Select
          value={articleSize}
          onValueChange={setArticleSize}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Article Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 justify-end mt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={`px-4 py-2 text-primary border border-solid bg-white text-tabColor border-tabColor rounded-md 
            ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSaving ? (
            <div className="flex items-center justify-center">
              <svg 
                className="animate-spin h-5 w-5 mr-2" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </div>
          ) : (
            "Save Content"
          )}
        </button>
        <button
          type="button"
          onClick={handleFinalGeneration}
          disabled={isGenerating || !articleSize || !title || !description}
          className={`px-4 py-2 text-primary border border-solid bg-tabColor text-white border-tabColor rounded-md 
            ${(isGenerating || !articleSize || !title || !description) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <svg 
                className="animate-spin h-5 w-5 mr-2" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating...
            </div>
          ) : (
            "Generate Content"
          )}
        </button>
      </div>
    </div>
  );
};

export default GuideSidebar;
