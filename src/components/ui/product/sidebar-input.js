// "use client";
// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// const SideBarInput = ({ handleGenerate }) => {
//   const [productLink, setProductLink] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false); // State to track loading
//   const [isSaving,setIsSaving]=useState(false)

//   const handleInputChange = (e) => {
//     setProductLink(e.target.value);
//   };

  

//   const handleGeneration = async () => {
//     if (productLink.trim() === "") {
//       console.error("Please enter a valid Amazon product link.");
//       return;
//     }

//     setIsGenerating(true); // Start loading
//     console.log("Generated Link for:", productLink);

//     try {
//       // Simulate an async operation (e.g., API call)
//       await handleGenerate(productLink);
//     } catch (error) {
//       console.error("Error during generation:", error);
//     } finally {
//       setIsGenerating(false); // Stop loading
//     }
//   };

//   return (
//     <Card className="relative left-[24px] top-[8px] w-[300px] mr-4 h-[620px]">
//       <CardContent className="p-4">
//         <div className="space-y-2">
//           <div className="space-y-2">
//             {/* Input Field for Amazon Product Link */}
//             <p className="font-sans text-xs opacity-40 mx-2 my-2">
//               Enter Amazon Product link*
//             </p>
//             <Input
//               type="url"
//               value={productLink}
//               onChange={handleInputChange}
//               className="w-full h-[80px]"
//             />
//           </div>
//         </div>
//         <div className="absolute left-6 bottom-4 mt-4 flex p-2 gap-3 space-y-2">
//           <Button
//             variant="outline"
//             className="w-[7rem] mt-2 border border-tabColor text-tabColor"
//             onClick={handleSave(content)}
//           >
//             Save
//           </Button>
//           <Button
//             className="w-[7rem] bg-tabColor hover:bg-white hover:text-backButtonColors hover:border hover:border-[#C8C9B5]"
//             onClick={handleGeneration}
//             disabled={isGenerating} // Disable button while loading
//           >
//             {isGenerating ? (
//               <div className="flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//               </div>
//             ) : (
//               "Generate"
//             )}
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default SideBarInput;

"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SideBarInput = ({ handleGenerate, handleSave, productLink, setProductLink }) => {
  const [isGenerating, setIsGenerating] = useState(false); // State to track loading
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e) => {
    setProductLink(String(e.target.value));
  };

  const handleGeneration = async () => {
    if (productLink.trim() === "") {
      console.error("Please enter a valid Amazon product link.");
      return;
    }

    setIsGenerating(true); // Start loading
    console.log("Generated Link for:",  typeof productLink);

    try {
      // Simulate an async operation (e.g., API call)
      await handleGenerate(productLink);
    } catch (error) {
      console.error("Error during generation:", error);
    } finally {
      setIsGenerating(false); // Stop loading
    }
  };

  return (
    <Card className="relative left-[24px] top-[24px] w-[300px] mr-4 h-[620px]">
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
        <div className="absolute left-6 bottom-4 mt-4 flex flex-wrap p-2 gap-3 space-y-2">
          <Button
            variant="outline"
            className="w-[7rem] mt-2 border border-tabColor text-tabColor"
            onClick={handleSave} // Pass the handleSave function directly
            disabled={isSaving} // Disable button while saving
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
            disabled={isGenerating} // Disable button while loading
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