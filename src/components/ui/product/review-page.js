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