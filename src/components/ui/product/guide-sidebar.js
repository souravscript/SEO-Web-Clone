"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const GuideSidebar = ({ handleGenerate, handleSave, setApiData }) => {
  const [title, setTitle] = useState(""); // Stores title input
  const [description, setDescription] = useState(""); // Stores description input
  const [articleSize, setArticleSize] = useState(""); // Stores article size selection

  const [isTitleGenerating, setIsTitleGenerating] = useState(false);
  const [isDescriptionGenerating, setIsDescriptionGenerating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  const handleTitleGeneration = async () => {
    if (title.trim() === "") {
      console.error("Please enter a valid title.");
      return;
    }

    setIsTitleGenerating(true);

    try {
      const response = await fetch("/api/product/guide/title", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titleInput: title }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate title");
      }

      const data = await response.json();
      console.log("Generated title:", data.title);
      let cleanTitle = data.title.replace(/^"(.*)"$/, "$1").trim();
      console.log("Cleaned title:", cleanTitle);
      setTitle(cleanTitle);

    } catch (error) {
      console.error("Error during title generation:", error);
    } finally {
      setIsTitleGenerating(false);
    }
  };

  const handleDescriptionGeneration = async () => {
    if (description.trim() === "") {
      console.error("Please enter a valid description.");
      return;
    }

    setIsDescriptionGenerating(true);

    try {
      console.log("title ", title)
        const response = await fetch("/api/product/guide/description", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ titleInput: title }),
          });
    
          if (!response.ok) {
            throw new Error("Failed to generate title");
          }
          
          const data = await response.json();
          console.log("Generated description:", data?.description);
          const cleanDescription = data?.description?.replace(/^"(.*)"$/, "$1").trim();
          console.log("Generated description:", cleanDescription);
          setDescription(cleanDescription);
    } catch (error) {
      console.error("Error during description generation:", error);
    } finally {
      setIsDescriptionGenerating(false);
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
    <Card className=" h-[23rem] mt-8 w-[780px] mr-4 p-4">
      <CardContent className="space-y-4">
        {/* Step 1: Title Input */}
          <div>
            <p className="font-sans text-xs opacity-40 mx-2 my-2">Title*</p>
            <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Enter Title Keywords..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-[40px]"
            />
              <Button
                className="mt-2 w-[13rem] relative top-[-0.5rem] py-5 bg-tabColor hover:bg-white hover:text-backButtonColors"
                onClick={handleTitleGeneration}
                disabled={isTitleGenerating}
              >
                {isTitleGenerating ? "Generating..." : "Generate Title"}
              </Button>
              </div>
          </div>

        {/* Step 2: Description Input (Appears after title generation) */}
          <div>
            <p className="font-sans text-xs opacity-40 mx-2 my-2">Description*</p>
            <div className="flex gap-4">
            <Input
              type="text"
              value={description}
              placeholder="Enter Description..."
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-[40px]"
            />
              <Button
                className="mt-2 w-[10rem] relative top-[-0.5rem] py-5 bg-tabColor hover:bg-white hover:text-backButtonColors"
                onClick={handleDescriptionGeneration}
                disabled={isDescriptionGenerating}
              >
                {isDescriptionGenerating ? "Generating..." : "Generate Description"}
              </Button>
              </div>
          </div>

        {/* Step 3: Article Size Selection (Appears after description generation) */}
        
          <div className="w-[589px]">
            <p className="font-sans text-xs opacity-40 mx-2 my-2">Select Article Size*</p>
            <Select className="w-full" onValueChange={setArticleSize} value={articleSize}>
              <SelectTrigger className="w-[524px] h-[40px] border border-gray-300">
                <SelectValue placeholder="Choose Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="long">Long</SelectItem>
              </SelectContent>
            </Select>
          </div>

        {/* Final Generate Button (Appears after selecting article size) */}
        <div className="flex gap-5 float-right mt-6 relative top-[1rem]">
          <Button
            className="mt-4 w-full hover:bg-white hover:text-backButtonColors border bg-white border-tabColor text-tabColor"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving Content..." : "Save Content"}
          </Button>
          <Button
            className="mt-4 w-full bg-tabColor hover:bg-white hover:text-backButtonColors"
            onClick={handleFinalGeneration}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating Content..." : "Generate Content"}
          </Button>
        
          </div>
      </CardContent>
    </Card>
  );
};

export default GuideSidebar;
