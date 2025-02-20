// "use client";
// import SideBarInput from "@/components/ui/product/sidebar-input";
// import ReviewContent from "@/components/ui/product/product-content";
// import { useState } from "react";
// import { generateReview } from "@/lib/generateReview";
// import ProductContent from "@/components/ui/product/product-content";
// import { useRouter } from "next/navigation";
// import { useToast } from "@/hooks/use-toast";



// const ReviewPage=()=>{
//     const [apiData,setApiData]=useState("")
//     const router=useRouter()
//     const { toast } = useToast();

//     const handleSaveReview = async (content) => {
//         console.log("Saved Link:", productLink);
    
    
//                 try {
//                     setIsSaving(true)
//                     if (!content) {
//                         throw new Error("Content is missing");
//                     }
//                     //console.log("req JSON data in frontend",reqJSONdata)
//                     const res = await fetch("/api/documents/product/review", {
//                         method: "POST",
//                         headers: {
//                             "Content-Type": "application/json",
//                             //Authorization: `Bearer ${access_token}`,
//                         },
//                         credentials: 'include',
//                         body: JSON.stringify({ content }),
//                     });
                    
//                     if (!res.ok) {
//                         const errorData = await res.json();
//                         throw new Error(errorData?.error || "Failed to create document");
//                     }
//                     setIsSaving(false)
//                     router.push('/')
//                     if (response.ok) {
//                         toast({
//                           title: "Review Generated",
//                           description: "The review for your amazon product generated successfully.",
//                         });
//                     } else {
//                         throw new Error("Failed to update profile");
//                     }
                    
//                 } catch (err) {
//                     console.log("Error is:", err.message || err);
//                     setIsSaving(false)
//                     toast({
//                         title: "Error",
//                         description: err.message,
//                         variant: "destructive",
//                       });
//                 }finally{
//                   setIsSaving(false)
//                   }
//       };
//     const handleReviewGeneration=async (url) =>{
//         // const response=await fetch('/api/product/review',{
//         //     method:"POST",
//         //     headers:{
//         //         'Content/Type': 'application/json'
//         //     },
//         //     credentials: 'include',
//         //     body: JSON.stringify({ url }),
//         // })
//         //const data=await response.json()
//         const data=await generateReview(url)
//         console.log("data fetched from gemini",data)
//         //setApiData(response.json())
//         setApiData({
//             blocks: [
//                 {
//                     type: "paragraph",
//                     data: { text: data }
//                 }
//             ]
//         });
        
//     }
//     return (
//         <div className="flex">
//             <SideBarInput handleSave={handleSaveReview} handleGenerate={handleReviewGeneration}/>
//             <ProductContent featName="Review Generator" apiData={apiData}/>
//         </div>
//     )
// }

// export default ReviewPage;

"use client";
import SideBarInput from "@/components/ui/product/sidebar-input";
import ProductContent from "@/components/ui/product/product-content";
import { useState, useRef } from "react";
import { generateReview } from "@/lib/generateReview";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";
import notebook from "@/../public/single-blog-post.png";
import tokenCoin from "@/../public/tokenCoin.png";

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
    //scrapeProductData()
    console.log("product link ", typeof productLink)
    const data = await generateReview(product_url);
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
        <span className="text-black text-xs">Review Generator</span>
      </p>
      <div className="flex items-start mt-6 gap-4 mb-5">
        <Image src={notebook} alt="single blog post" height={40} width={40} className="rounded-md" />
        <div className="flex flex-row">
          <h1 className="text-xl font-semibold text-gray-800">Review Generator</h1>
          <Image src={tokenCoin} alt="single blog post" className="rounded-md h-5 w-5 ml-2 mt-1" />
          <span className="text-gray-500 text-sm ml-1 mt-1">1 Token</span>
        </div>
      </div>
      <div className="bg-[#FFF0CC] p-3 rounded w-80">
        <p className="text-[#6E4D00] text-sm">You can edit generated content here.</p>
      </div>
      
    </div>
    <div className="flex flex-col justify-center items-center">
      
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
    </>
  );
};

export default ReviewPage;