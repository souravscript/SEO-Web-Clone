// import { useGetAccessToken } from "@/hooks/use-get-accessToken";
// import React, { useEffect, useState } from "react";
// import { X, Trash2, Edit2, MoreVertical, Check, Copy } from "lucide-react";
// import Markdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { useCookieValue } from "@/hooks/useCookie";

// const DocumentModal = ({ document, isOpen, onClose, onDelete }) => {
//   const [data, setData] = useState({ title: "", content: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [copied, setCopied] = useState(false);
//   //const access_token = useGetAccessToken();
//   const access_token =useCookieValue('access_token')

//   useEffect(() => {
//     const fetchModalData = async () => {
//       if (!isOpen || !document) return;

//       setLoading(true);
//       setError("");

//       try {
//         const apiUrl = `/api/documents/single-blog/${document._id}`;
//         const response = await fetch(apiUrl, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             //Authorization: `Bearer ${access_token}`,
//           },
//           credentials: 'include',
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch document data");
//         }

//         const result = await response.json();
//         setData(result);
//       } catch (err) {
//         console.error("Error fetching modal data:", err);
//         setError("Failed to load content. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchModalData();
//   }, [isOpen, document, access_token]);

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(document.content);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error("Failed to copy content:", err);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       const response = await fetch(`/api/documents/single-blog/${document._id}`, {
//         method: "DELETE",
//         headers: {
//           //Authorization: `Bearer ${access_token}`,
//         },
//         credentials: 'include',
//       });
//       console.log("delete doc called ",response)
//       if (!response.ok) {
//         throw new Error("Failed to delete the document");
//       }

//       onDelete?.(document._id);
//       onClose();
//     } catch (error) {
//       console.error("Error deleting document:", error);
//       setError("Failed to delete document. Please try again.");
//     }
//   };

//   const handleEdit = () => {
//     // Add your edit navigation logic here
//     console.log("Edit document:", document._id);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50">
//       {/* Backdrop with blur effect */}
//       <div
//         className="fixed inset-0 bg-black/30 backdrop-blur-sm"
//         onClick={() => {
//           setShowDropdown(false);
//           onClose();
//         }}
//       />

//       {/* Delete Confirmation Modal */}
//       {isDeleteConfirmOpen && (
//         <div className="fixed inset-0 flex items-center justify-center z-60">
//           <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4">
//             <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete this document? This action cannot be undone.
//             </p>
//             <div className="flex justify-end space-x-4">
//               <button
//                 onClick={() => setIsDeleteConfirmOpen(false)}
//                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal Container */}
//       <div 
//         className="relative bg-white rounded-xl shadow-2xl w-[95%] max-w-4xl max-h-[90vh] flex flex-col"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-900">
//             {loading ? (
//               <div className="animate-pulse bg-gray-200 h-6 w-32 rounded" />
//             ) : error ? (
//               "Error Loading Document"
//             ) : (
//               document.title || "Document"
//             )}
//           </h2>
//           <div className="flex items-center space-x-2">
//             {/* Copy Button */}
//           <button
//               onClick={handleCopy}
//               className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
//               title={copied ? "Copied!" : "Copy content"}
//             >
//               {copied ? (
//                 <Check className="h-5 w-5 text-green-500" />
//               ) : (
//                 <Copy className="h-5 w-5 text-gray-500" />
//               )}
//             </button>
//             {/* Actions Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowDropdown(!showDropdown)}
//                 className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
//               >
//                 <MoreVertical className="h-5 w-5 text-gray-500" />
//               </button>
              
//               {showDropdown && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
//                   <button
//                     onClick={handleEdit}
//                     className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
//                   >
//                     <Edit2 className="h-4 w-4 mr-2" />
//                     Edit Document
//                   </button>
//                   <button
//                     onClick={() => setIsDeleteConfirmOpen(true)}
//                     className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
//                   >
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Delete Document
//                   </button>
//                 </div>
//               )}
//             </div>
            
//             {/* Close Button */}
//             <button
//               onClick={onClose}
//               className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
//             >
//               <X className="h-5 w-5 text-gray-500" />
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto p-6">
//           {loading ? (
//             <div className="space-y-4">
//               <div className="animate-pulse bg-gray-200 h-8 w-3/4 rounded" />
//               <div className="animate-pulse bg-gray-200 h-4 w-full rounded" />
//               <div className="animate-pulse bg-gray-200 h-4 w-5/6 rounded" />
//               <div className="animate-pulse bg-gray-200 h-4 w-4/6 rounded" />
//             </div>
//           ) : error ? (
//             <div className="flex flex-col items-center justify-center py-12">
//               <div className="text-red-500 font-medium mb-2">{error}</div>
//               <button 
//                 onClick={() => fetchModalData()}
//                 className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors duration-200"
//               >
//                 Try Again
//               </button>
//             </div>
//           ) : (
//             <article className="prose prose-gray max-w-none">
//               <h1 className="text-2xl font-bold text-gray-900 mb-4">
//                 {document.title}
//               </h1>
//               <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
//                 <Markdown remarkPlugins={[remarkGfm]}>{document.content}</Markdown>
                
//               </div>
//             </article>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DocumentModal;

import { useGetAccessToken } from "@/hooks/use-get-accessToken";
import React, { useEffect, useState } from "react";
import { X, Trash2, Check, Copy } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useCookieValue } from "@/hooks/useCookie";

const DocumentModal = ({ document, isOpen, onClose, onDelete,refreshDocuments }) => {
  const [data, setData] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const access_token = useCookieValue("access_token");

  useEffect(() => {
    const fetchModalData = async () => {
      if (!isOpen || !document) return;

      setLoading(true);
      setError("");

      try {
        const apiUrl = `/api/documents/single-blog/${document._id}`;
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch document data");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching modal data:", err);
        setError("Failed to load content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchModalData();
  }, [isOpen, document, access_token]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(document.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy content:", err);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/documents/single-blog/${document._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the document");
      }

      onDelete?.(document._id);

      if (refreshDocuments) refreshDocuments();

      onClose();
    } catch (error) {
      console.error("Error deleting document:", error);
      setError("Failed to delete document. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative bg-white rounded-xl shadow-2xl w-[95%] max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-6 w-32 rounded" />
            ) : error ? (
              "Error Loading Document"
            ) : (
              document.title || "Document"
            )}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
              title={copied ? "Copied!" : "Copy content"}
            >
              {copied ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <Copy className="h-5 w-5 text-gray-500" />
              )}
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-full hover:bg-red-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-200"
              title="Delete document"
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-4">
              <div className="animate-pulse bg-gray-200 h-8 w-3/4 rounded" />
              <div className="animate-pulse bg-gray-200 h-4 w-full rounded" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-red-500 font-medium mb-2">{error}</div>
            </div>
          ) : (
            <article className="prose prose-gray max-w-none">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {document.title}
              </h1>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                <Markdown remarkPlugins={[remarkGfm]}>{document.content}</Markdown>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;

