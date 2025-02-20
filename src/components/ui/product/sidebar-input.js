"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import singleBlogPost from "@/../public/single-blog-post.png";
import tokenCoin from "@/../public/tokenCoin.png";

const SideBarInput = ({ handleGenerate, handleSave, productLink, setProductLink }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const value = String(e.target.value);
    setProductLink(value);

    // Basic URL validation
    if (value && !isValidAmazonUrl(value)) {
      setError("Please enter a valid Amazon product link");
    } else {
      setError("");
    }
  };

  // Simple Amazon URL validation function
  const isValidAmazonUrl = (url) => {
    const amazonUrlPattern = /^(https?:\/\/)?(www\.)?amazon\.(com|co\.uk|de|fr|jp|in)\/.*$/;
    return amazonUrlPattern.test(url);
  };

  const handleGeneration = async () => {
    // Clear previous errors
    setError("");

    // Validate product link
    if (!productLink.trim()) {
      setError("Product link is required");
      return;
    }

    if (!isValidAmazonUrl(productLink)) {
      setError("Please enter a valid Amazon product link");
      return;
    }

    setIsGenerating(true);
    console.log("Generated Link for:", productLink);

    try {
      await handleGenerate(productLink);
    } catch (error) {
      console.error("Error during generation:", error);
      setError("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAction = async () => {
    // Clear previous errors
    setError("");

    // Validate before saving
    if (!productLink.trim()) {
      setError("Product link is required before saving");
      return;
    }

    setIsSaving(true);
    try {
      await handleSave();
    } catch (error) {
      console.error("Error during saving:", error);
      setError("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-[780px] mx-auto mt-3">
      <div className="flex items-end gap-4 w-full mb-3">
        <div className="flex flex-col flex-grow">
          <label className="text-gray-700 font-medium">Amazon Product Link <span className="text-red-500">*</span></label>
          <input
            type="url"
            value={productLink}
            onChange={handleInputChange}
            placeholder="Enter Amazon Product Link"
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
          />
          {error && (
            <span className="text-red-500 text-sm mt-1">
              {error}
            </span>
          )}
        </div>
        <div className="flex-shrink-0 flex gap-2">
          <button
            type="button"
            onClick={handleSaveAction}
            disabled={isSaving}
            className={`px-4 py-2 text-primary border border-solid bg-paleYellow text-tabColor border-tabColor rounded-md 
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
              "Save"
            )}
          </button>
          <button
            type="button"
            onClick={handleGeneration}
            disabled={isGenerating}
            className={`px-4 py-2 text-primary border border-solid bg-paleYellow text-tabColor border-tabColor rounded-md 
                ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              "Generate"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBarInput;