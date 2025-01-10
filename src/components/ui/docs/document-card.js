 "use client";
// import Image from "next/image";
// import notebookIcon from "@/../public/notebook-icon.png";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { useState, useEffect, useRef } from "react";
// import Markdown from "react-markdown";
// import remarkGfm from "remark-gfm";

// const DocumentCard = ({onClick, document, onDelete}) => {
//   const [dropDownOpen, setDropDownOpen] = useState(false);
//   const dropDownRef = useRef(null);

//   const truncatedDescription = document?.content?.slice(0, 75) + "...";

//   // // Close dropdown on outside click
//   // useEffect(() => {
//   //   if (typeof window !== "undefined") {
//   //     const handleOutsideClick = (event) => {
//   //       if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
//   //         setDropDownOpen(false);
//   //       }
//   //     };

//   //     window.addEventListener("mousedown", handleOutsideClick);

//   //     return () => {
//   //       window.removeEventListener("mousedown", handleOutsideClick);
//   //     };
//   //   }
//   // }, []);

//   const deleteDocument = async () => {
//     try {
//       console.log("HIIIIII")
//       console.log(`/api/documents/single-blog/${document._id}`)
//       const session = localStorage.getItem("session");
//       if (!session) {
//         throw new Error("Session data is not available in localStorage");
//       }

//       const { access_token } = JSON.parse(session); // Destructure the access_token
//       if (!access_token) {
//         throw new Error("Access token is missing in session data");
//       }
//       const response = await fetch(`/api/documents/single-blog/${document._id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${access_token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete the document");
//       }
//       console.log("Delete response: ",response)
//       // Notify parent component to update UI
//       onDelete(document._id);
//       setDropDownOpen(!dropDownOpen)
//     } catch (error) {
//       console.log("Error deleting document:", error.message);
//     }
//   };

  

//   return (
//     <div onClick={onClick} className="bg-white relative shadow-md rounded-lg overflow-hidden w-80 mx- px-2 border-gray-300 border-[0.1px] cursor-pointer">
//       <div className="h-20 flex items-center justify-between">
//         <Image src={notebookIcon} alt="text img" />
//         <span className="text-black text-sm bg-yellow-100 p-2 rounded-full">
//           How to guide
//         </span>
//       </div>
//       <div className="p-4">
//         <h2 className="text-2xl font-bold">{document.title}</h2>
//         <p className="text-gray-500 text-sm"><Markdown remarkPlugins={[remarkGfm]}>{truncatedDescription}</Markdown></p>
//       </div>
//       {/* {dropDownOpen && (
//         <div
//           ref={dropDownRef}
//           className="absolute right-[-5rem] top-0 mt-2 w-40 bg-white border border-gray-200 rounded"
//         >
//           <ul className="flex flex-col">
//             <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer">Edit</li>
//             <li onClick={deleteDocument} className="hover:bg-gray-100 px-4 py-2 cursor-pointer">Delete</li>
//           </ul>
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default DocumentCard;

import React from 'react';
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BsThreeDotsVertical } from "react-icons/bs";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const DocumentCard = ({ onClick, document }) => {
  const truncatedDescription = document?.content?.slice(0, 75) + "...";

  // Function to determine badge color based on document type
  const getBadgeVariant = (type) => {
    const types = {
      'How to Guide': 'warning',
      'Product Review': 'success',
      'Product Roundup': 'info',
      'Blog post': 'secondary'
    };
    return types[type] || 'default';
  };

  const getDocumentType = (document) => {
    // Add logic to determine document type
    return document.type || 'Blog post';
  };

  return (
    <Card 
      onClick={onClick} 
      className="w-70 cursor-pointer hover:shadow-lg transition-shadow duration-200"
    >
      <CardHeader className="pt-6 pb-2">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12">
            <Image
              src="/notebook-icon.png"
              alt="Document icon"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <Badge 
            variant={getBadgeVariant(getDocumentType(document))}
            className="ml-2 bg-yellow-100 px-5 py-2 rounded-full font-light"
          >
            {getDocumentType(document)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">
          {document.title}
        </h3>
        <div className="text-sm text-gray-500 line-clamp-2">
          <Markdown remarkPlugins={[remarkGfm]}>
            {truncatedDescription}
          </Markdown>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;

