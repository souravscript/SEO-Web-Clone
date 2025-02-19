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

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [step, setStep] = useState(1); // Controls which input field is visible

  const handleTitleGeneration = async () => {
    if (title.trim() === "") {
      console.error("Please enter a valid title.");
      return;
    }

    setIsGenerating(true);

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
      //await handleGenerate(data.title);
      setStep(2); // Move to the description input

    } catch (error) {
      console.error("Error during title generation:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDescriptionGeneration = async () => {
    if (description.trim() === "") {
      console.error("Please enter a valid description.");
      return;
    }


    setIsGenerating(true);

    try {
        const response = await fetch("/api/product/guide/description", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ titleInput: description }),
          });
    
          if (!response.ok) {
            throw new Error("Failed to generate title");
          }
    
          const data = await response.json();
          const cleanDescription = data.description.replace(/^"(.*)"$/, "$1").trim();
          console.log("Generated description:", cleanDescription);
          setDescription(cleanDescription);
      setStep(3); // Move to the article size selection
    } catch (error) {
      console.error("Error during description generation:", error);
    } finally {
      setIsGenerating(false);
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
    <Card className="relative left-[24px] top-[24px] h-screen w-[300px] mr-4 p-4">
      <CardContent className="space-y-4">
        {/* Step 1: Title Input */}
        {step >= 1 && (
          <div>
            <p className="font-sans text-xs opacity-40 mx-2 my-2">Enter Title*</p>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-[40px]"
              disabled={step > 1}
            />
            {step === 1 && (
              <Button
                className="mt-2 w-full bg-tabColor hover:bg-white hover:text-backButtonColors"
                onClick={handleTitleGeneration}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Title"}
              </Button>
            )}
          </div>
        )}

        {/* Step 2: Description Input (Appears after title generation) */}
        {step >= 2 && (
          <div>
            <p className="font-sans text-xs opacity-40 mx-2 my-2">Enter Description*</p>
            <Input
              type="text"
              value={!description? title : description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-[40px]"
              disabled={step > 2}
            />
            {step === 2 && (
              <Button
                className="mt-2 w-full bg-tabColor hover:bg-white hover:text-backButtonColors"
                onClick={handleDescriptionGeneration}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Description"}
              </Button>
            )}
          </div>
        )}

        {/* Step 3: Article Size Selection (Appears after description generation) */}
        {step >= 3 && (
          <div>
            <p className="font-sans text-xs opacity-40 mx-2 my-2">Select Article Size*</p>
            <Select onValueChange={setArticleSize} value={articleSize}>
              <SelectTrigger className="w-full h-[40px] border border-gray-300">
                <SelectValue placeholder="Choose Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="long">Long</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Final Generate Button (Appears after selecting article size) */}
        {step === 3 && (
          <Button
            className="mt-4 w-full bg-tabColor hover:bg-white hover:text-backButtonColors"
            onClick={handleFinalGeneration}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating Content..." : "Generate Content"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default GuideSidebar;
