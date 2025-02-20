"use client";
import ProductContent from "@/components/ui/product/product-content";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { scrapeProductData } from "@/lib/scrappingData";
import { generateProductGuide } from "@/lib/generateProductGuide";
import GuideSidebar from "./guide-sidebar";

const GuidePage = () => {
  const [apiData, setApiData] = useState("");
  const [productLink, setProductLink] = useState("");
  const editorRef = useRef(null); // Ref to hold the EditorJS instance
  const router = useRouter();
  const { toast } = useToast();
  

  const handleSaveGuide = async () => {
    try {
      if (!productLink.trim()) {
        throw new Error("Please enter a valid product link.");
      }
  
      if (!editorRef.current) {
        throw new Error("Editor instance is not available");
      }
  
      console.log("product link ", productLink)
      const savedData = await editorRef.current.save();
      console.log("Saved Data:", savedData.blocks[0].data.text);
  
      const content = JSON.stringify(savedData.blocks[0].data.text);
  
      const res = await fetch("/api/product/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });
  
      let responseData = null;
      const responseText = await res.text();
  
      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
        } catch (jsonError) {
          console.error("Invalid JSON response:", responseText);
          throw new Error("Unexpected server response");
        }
      }
  
      if (!res.ok) {
        throw new Error(responseData?.error || "Failed to save document");
      }
  
      router.push("/");
  
      toast({
        title: "How to Guide Saved",
        description: "The Guide has been saved successfully.",
      });
    } catch (err) {
      console.error("Error saving guide:", err.message || err);
  
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };
  
  
  const handleGuideGeneration = async (title,description,articleSize) => {
    //scrapeProductData()
    const response = await fetch("/api/product/guide/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title:title,article_size:articleSize, description: description }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate title");
    }

    const data = await response.json().content;
    console.log("Generated title:", data.description);
    //console.log("Data fetched from Gemini:", data);

    // Set the generated data in the EditorJS instance
    setApiData({
      blocks: [
        {
          type: "paragraph",
          data: { text: data },
        },
      ],
    });
  };

  return (
    <div className="flex">
      <GuideSidebar
        productLink={productLink}
        setProductLink={setProductLink}
        handleGenerate={handleGuideGeneration}
        handleSave={handleSaveGuide} // Pass the handleSaveReview function
      />
      <ProductContent
        featName="How to guide"
        apiData={apiData}
        editorRef={editorRef} // Pass the editorRef to ProductContent
      />
    </div>
  );
};

export default GuidePage;