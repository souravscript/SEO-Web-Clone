"use client";
import SideBarInput from "@/components/ui/product/sidebar-input";
import ProductContent from "@/components/ui/product/product-content";
import { useState, useRef } from "react";
import { generateReview } from "@/lib/generateReview";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { markdownToEditorJS } from "@/components/ui/product/product-content";

const ReviewPage = () => {
  const [apiData, setApiData] = useState("");
  const [productLink, setProductLink] = useState("");
  const editorRef = useRef(null); // Ref to hold the EditorJS instance
  const router = useRouter();
  const { toast } = useToast();
  

  const handleSaveReview = async () => {
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
  
      const res = await fetch("/api/product/review/save-review", {
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
        title: "Review Saved",
        description: "The review has been saved successfully.",
      });
    } catch (err) {
      console.error("Error saving review:", err.message || err);
  
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };
  
  
  const handleReviewGeneration = async (product_url) => {
    try {
      const data = await generateReview(product_url);
      
      // Convert markdown to EditorJS blocks
      const { blocks } = markdownToEditorJS(data);
      
      // Set the generated data in the EditorJS instance
      setApiData({ blocks });
    } catch (error) {
      console.error('Error generating review:', error);
      toast({
        title: "Error",
        description: "Failed to generate review",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex">
      <SideBarInput
        productLink={productLink}
        setProductLink={setProductLink}
        handleGenerate={handleReviewGeneration}
        handleSave={handleSaveReview} // Pass the handleSaveReview function
      />
      <ProductContent
        featName="Review Generator"
        apiData={apiData}
        editorRef={editorRef} // Pass the editorRef to ProductContent
      />
    </div>
  );
};

export default ReviewPage;