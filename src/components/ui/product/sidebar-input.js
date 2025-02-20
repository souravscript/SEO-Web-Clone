"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <Card className="relative w-[780px] mt-8 mr-4">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="space-y-2">
            {/* Input Field for Amazon Product Link */}
            <p className="font-sans text-xs opacity-40 mx-2 my-2">
              Enter Amazon Product link*
            </p>
            <Input
              type="url"
              value={productLink}
              onChange={handleInputChange}
              className="w-full h-[40px]"
            />
          </div>
        </div>
        {/* Button  */}
        <div className="relative float-right mr-3 left-6 bottom-4 mt-6 flex flex-wrap p-2 gap-3 space-y-2">
          <Button
            variant="outline"
            className="w-[7rem] mt-2 border border-tabColor text-tabColor"
            onClick={handleSaveAction}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </div>
            ) : "Save"}
          </Button>
          <Button
            className="w-[7rem] bg-tabColor hover:bg-white hover:text-backButtonColors hover:border hover:border-[#C8C9B5]"
            onClick={handleGeneration}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </div>
            ) : (
              "Generate"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SideBarInput;