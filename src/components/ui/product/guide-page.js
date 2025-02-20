"use client";
import ProductContent from "@/components/ui/product/product-content";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import GuideSidebar from "./guide-sidebar";
import Image from "next/image";
import Link from "next/link";
import notebook from "@/../public/single-blog-post.png";
import tokenCoin from "@/../public/tokenCoin.png";

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
    <>

<div className="relative left-[21rem] mt-6">
      <p className="relative mt-2 mb-9">
        <Link href="/">
          <span className="text-[#A1A1A1] text-xs">Home</span>
        </Link>
        <span className="text-gray-400 mx-1">/</span>
        <span className="text-black text-xs">How to guide</span>
      </p>
      <div className="flex items-start mt-6 gap-4 mb-5">
        <Image src={notebook} alt="single blog post" height={40} width={40} className="rounded-md" />
        <div className="flex flex-row">
          <h1 className="text-xl font-semibold text-gray-800"> How to guide</h1>
          <Image src={tokenCoin} alt="single blog post" className="rounded-md h-5 w-5 ml-2 mt-1" />
          <span className="text-gray-500 text-sm ml-1 mt-1">1 Token</span>
        </div>
      </div>
      <div className="bg-[#FFF0CC] p-3 rounded w-80">
        <p className="text-[#6E4D00] text-sm">You can edit generated content here.</p>
      </div>
      
    </div>
    <div className="flex flex-col justify-center items-center">
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
    </>
  );
};

export default GuidePage;