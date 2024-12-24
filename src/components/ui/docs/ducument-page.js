"use client";
import React, { useState, useEffect } from "react";
import DocumentCard from "@/components/ui/docs/document-card";
import DocumentModal from "@/components/ui/docs/document-modal";
import DocShimmerGrid from "../shimmer/doc-shimmer";

const DocumentsPage = () => {
  const [documentsData, setDocumentsData] = useState([]);
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [isDraft, setIsDraft] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading,setIsLoading]=useState(false) 

  const handleDelete = (id) => {
    setSavedDrafts((prevDocs) => prevDocs.filter((doc) => doc.id !== id));
    setDocumentsData((prevDocs) => prevDocs.filter((doc) => doc.id !== id));
  };

  const handleOpenModal = (document) => {
    console.log("Selected document:", document); 
    setSelectedDocument(document); 
    setModalOpen(true); 
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true)
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
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        {/* Headers for Published and Drafts */}
        <div className="flex space-x-4 mb-4">
          <h2
            onClick={() => setIsDraft(false)}
            className={`cursor-pointer text-2xl font-bold ${
              !isDraft ? "text-black" : "text-gray-400"
            }`}
          >
            Published
          </h2>
          <h2
            onClick={() => setIsDraft(true)}
            className={`cursor-pointer text-2xl font-bold ${
              isDraft ? "text-black" : "text-gray-400"
            }`}
          >
            Saved Drafts
          </h2>
        </div>

        {/* Render based on isDraft and data availability */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {!isDraft ? (
            documentsData.length > 0 ? (
              documentsData.map((document) => (
                <DocumentCard 
                  onClick={() => handleOpenModal(document)}
                  key={document?._id} 
                  document={document}
                  onDelete={handleDelete} 
                />
              ))
            ) : (
              <p className="text-gray-500 col-span-full">
                No published documents available
              </p>
            )
          ) : savedDrafts.length > 0 ? (
            savedDrafts.map((document) => (
              <DocumentCard 
                className="cursor-pointer"
                onClick={() => handleOpenModal(document)} 
                key={document?._id} 
                document={document}
                onDelete={handleDelete} 
              />
            ))
          ) : (
            <p className="text-gray-500 col-span-full">
              No draft documents available
            </p>
          )} 
        </div> */}
        <div className="container mx-auto py-8">
  {isLoading ? (
    <DocShimmerGrid />  // Show shimmer effect when loading
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {!isDraft ? (
        documentsData.length > 0 ? (
          documentsData.map((document) => (
            <DocumentCard 
              onClick={() => handleOpenModal(document)}
              key={document?._id} 
              document={document}
              onDelete={handleDelete} 
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full">
            No published documents available
          </p>
        )
      ) : savedDrafts.length > 0 ? (
        savedDrafts.map((document) => (
          <DocumentCard 
            className="cursor-pointer"
            onClick={() => handleOpenModal(document)} 
            key={document?._id} 
            document={document}
            onDelete={handleDelete} 
          />
        ))
      ) : (
        <p className="text-gray-500 col-span-full">
          No draft documents available
        </p>
      )} 
    </div>
  )}
</div>

      </div>

      {modalOpen && <DocumentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)} 
        document={selectedDocument} 
      />}
    </div>
  );
};

export default DocumentsPage;
