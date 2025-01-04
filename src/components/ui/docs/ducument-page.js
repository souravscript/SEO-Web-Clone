// "use client";
// import React, { useState, useEffect } from "react";
// import DocumentCard from "@/components/ui/docs/document-card";
// import DocumentModal from "@/components/ui/docs/document-modal";
// import DocShimmerGrid from "../shimmer/doc-shimmer";
// import { useGetAccessToken } from "@/hooks/use-get-accessToken";

// const DocumentsPage = () => {
//   const [documentsData, setDocumentsData] = useState([]);
//   const [savedDrafts, setSavedDrafts] = useState([]);
//   const [isDraft, setIsDraft] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedDocument, setSelectedDocument] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   //const access_token=useGetAccessToken()

//   const handleDelete = (id) => {
//     setSavedDrafts((prevDocs) => prevDocs.filter((doc) => doc.id !== id));
//     setDocumentsData((prevDocs) => prevDocs.filter((doc) => doc.id !== id));
//   };

//   const handleOpenModal = (document) => {
//     console.log("Document data: ", document);
//     setSelectedDocument(document);
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setSelectedDocument(null);
//   };

//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   const fetchDocuments = async () => {
//     try {
//       setIsLoading(true);
//       const session = localStorage.getItem("session");
//       if (!session) {
//         throw new Error("Session data is not available in localStorage");
//       }

//       const { access_token } = JSON.parse(session);
//       if (!access_token) {
//         throw new Error("Access token is missing in session data");
//       }
//       const response = await fetch("/api/documents/single-blog", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${access_token}`,
//         },
//       });
//       const { documents } = await response.json();
//       console.log("Document data: ", documents);

//       setDocumentsData(documents.filter((doc) => doc?.isPublished));
//       setSavedDrafts(documents.filter((doc) => !doc?.isPublished));
//     } catch (error) {
//       console.log("Error fetching documents:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto py-8">
//       <div className="mb-8">
//         <div className="flex space-x-4 mb-4 ml-2">
//           <h2
//             onClick={() => setIsDraft(false)}
//             className={`cursor-pointer text-2xl font-bold ${
//               !isDraft ? "text-black" : "text-gray-400"
//             }`}
//           >
//             Published
//           </h2>
//           <h2
//             onClick={() => setIsDraft(true)}
//             className={`cursor-pointer text-2xl font-bold ${
//               isDraft ? "text-black" : "text-gray-400"
//             }`}
//           >
//             Saved Drafts
//           </h2>
//         </div>

//         <div className="container mx-auto py-8">
//           {isLoading ? (
//             <DocShimmerGrid />
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
//               {!isDraft ? (
//                 documentsData.length > 0 ? (
//                   documentsData.map((document) => (
//                     <DocumentCard
//                       onClick={() => handleOpenModal(document)}
//                       key={document?._id}
//                       document={document}
//                       onDelete={handleDelete}
//                     />
//                   ))
//                 ) : (
//                   <p className="text-gray-500 col-span-full">
//                     No published documents available
//                   </p>
//                 )
//               ) : savedDrafts.length > 0 ? (
//                 savedDrafts.map((document) => (
//                   <DocumentCard
//                     className="cursor-pointer"
//                     onClick={() => handleOpenModal(document)}
//                     key={document?._id}
//                     document={document}
//                     onDelete={handleDelete}
//                   />
//                 ))
//               ) : (
//                 <p className="text-gray-500 col-span-full">
//                   No draft documents available
//                 </p>
//                 )}
//             </div>
//           )}
//         </div>
//       </div>

//       {modalOpen && selectedDocument && (
//         <DocumentModal
//           isOpen={modalOpen}
//           onClose={handleCloseModal}
//           document={selectedDocument}
//         />
//       )}
//     </div>
//   );
// };

// export default DocumentsPage;
"use client";
import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DocumentCard from "@/components/ui/docs/document-card";
import DocumentModal from "@/components/ui/docs/document-modal";
import DocShimmerGrid from "../shimmer/doc-shimmer";
import { useGetAccessToken } from "@/hooks/use-get-accessToken";

const DocumentsPage = () => {
  const [documentsData, setDocumentsData] = useState([]);
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [isDraft, setIsDraft] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  //const access_token=useGetAccessToken()

  const handleDelete = (id) => {
    setSavedDrafts((prevDocs) => prevDocs.filter((doc) => doc.id !== id));
    setDocumentsData((prevDocs) => prevDocs.filter((doc) => doc.id !== id));
  };

  const handleOpenModal = (document) => {
    console.log("Document data: ", document);
    setSelectedDocument(document);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDocument(null);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const session = localStorage.getItem("session");
      if (!session) {
        throw new Error("Session data is not available in localStorage");
      }

      const { access_token } = JSON.parse(session);
      if (!access_token) {
        throw new Error("Access token is missing in session data");
      }
      const response = await fetch("/api/documents/single-blog", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });
      const { documents } = await response.json();
      console.log("Document data: ", documents);

      setDocumentsData(documents.filter((doc) => doc?.isPublished));
      setSavedDrafts(documents.filter((doc) => !doc?.isPublished));
    } catch (error) {
      console.log("Error fetching documents:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="drafts" className="w-full">
        <div className="mb-8">
          <TabsList className="border-b w-full justify-start rounded-none bg-transparent p-0">
            <TabsTrigger 
              value="drafts"
              className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black rounded-none border-transparent px-4 pb-2 pt-2 text-xl font-semibold"
            >
              Saved Drafts
            </TabsTrigger>
            <TabsTrigger 
              value="published"
              className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black rounded-none border-transparent px-4 pb-2 pt-2 text-xl font-semibold"
            >
              Published
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <div className="flex gap-4 mb-6">
              {['All', 'Blog', 'Review Generator', 'Product Roundup', 'How to guide'].map((filter) => (
                <button
                  key={filter}
                  className={`rounded-full px-4 py-1 text-sm ${
                    filter === 'All' ? 'bg-paleYellow text-primaryYellow border-primaryYellow border-2 font-bold' : 'bg-gray-100'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {isLoading ? (
              <DocShimmerGrid />
            ) : (
              <TabsContent value="drafts">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {savedDrafts.length > 0 ? (
                    savedDrafts.map((document) => (
                      <DocumentCard
                        key={document._id}
                        document={document}
                        onClick={() => handleOpenModal(document)}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-full">No draft documents available</p>
                  )}
                </div>
              </TabsContent>
            )}

            <TabsContent value="published">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {documentsData.length > 0 ? (
                  documentsData.map((document) => (
                    <DocumentCard
                      key={document._id}
                      document={document}
                      onClick={() => handleOpenModal(document)}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 col-span-full">No published documents available</p>
                )}
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>

      {modalOpen && selectedDocument && (
        <DocumentModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          document={selectedDocument}
        />
      )}
    </div>
  );
};

export default DocumentsPage;