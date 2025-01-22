
"use client";
import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DocumentCard from "@/components/ui/docs/document-card";
import DocumentModal from "@/components/ui/docs/document-modal";
import DocShimmerGrid from "../shimmer/doc-shimmer";
//import { useGetAccessToken } from "@/hooks/use-get-accessToken";
import Link from 'next/link';
import { useCookieValue } from '@/hooks/useCookie';

const DocumentsPage = () => {
  const [documentsData, setDocumentsData] = useState([]);
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [isDraft, setIsDraft] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  //const access_token =useCookieValue('access_token')

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
      // const session = localStorage.getItem("session");
      // if (!session) {
      //   throw new Error("Session data is not available in localStorage");
      // }

      // const { access_token } = JSON.parse(session);
      
      // if (!access_token) {
      //   throw new Error("Access token is missing in session data");
      // }
      const response = await fetch("/api/documents/single-blog", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${access_token}`,
        },
        credentials: 'include',
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
    <div className="container mx-auto px-4 py-4 relative max-w-[1180px]">
      <p className="relative mt-2 mb-9">
                    <Link href="/">
                        <span className="text-[#A1A1A1] text-xs">Home</span>
                    </Link>
                    <span className="text-gray-400 mr-1 ml-1">/</span>
                    <span className="text-black text-xs">Documents</span>
        </p>
      <Tabs defaultValue="drafts" className="w-full">
        <div className="mb-8">
          {/* <TabsList className=" w-full justify-start rounded-none bg-transparent p-0">
            <TabsTrigger 
              value="drafts"
              className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black rounded-none border-transparent px-4 pb-2 pt-2 text-xl font-semibold text-gray-400"
            >
              Saved Drafts
            </TabsTrigger>
            <TabsTrigger 
              value="published"
              className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black rounded-none border-transparent px-4 pb-2 pt-2 text-xl font-semibold text-gray-400"
            >
              Published
            </TabsTrigger>
          </TabsList> */}

        <TabsList className="w-full justify-start rounded-none bg-transparent p-0 shadow-none relative left-[-16px]">
          <TabsTrigger 
            value="drafts"
            className="data-[state=active]:text-black rounded-none border-transparent px-4 pb-2 pt-2 text-xl font-semibold text-gray-400"
            style={{ boxShadow: "none" }}
          >
            Saved Drafts
            <span
              className="absolute bottom-0 left-1/2 w-[90%] -translate-x-1/2 border-b-2 border-transparent data-[state=active]:border-black"
            />
          </TabsTrigger>
          <div className="h-8 w-px bg-gray-300 mx-2" />
          <TabsTrigger 
            value="published"
            className="data-[state=active]:text-black rounded-none border-transparent px-4 pb-2 pt-2 text-xl font-semibold text-gray-400"
            style={{ boxShadow: "none" }}
          >
            Published
            <span
              className="absolute bottom-0 left-1/2 w-[90%] -translate-x-1/2 border-b-2 border-transparent data-[state=active]:border-black"
            />
          </TabsTrigger>
        </TabsList>

        <p className='text-[#666666] text-sm mt-6 mb-6'>Here you can see all your library of saved SEO documents.</p>

          <div className="mt-6">
            <div className="flex gap-4 mb-6">
              {['All', 'Blog', 'Review Generator', 'Product Roundup', 'How to guide'].map((filter) => (
                <button
                  key={filter}
                  className={`rounded-full px-4 py-1 text-sm ${
                    filter === 'All' ? 'bg-paleYellow text-tabColor border-tabColor border-2 font-bold' : 'bg-gray-100'
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                  {savedDrafts.length > 0 ? (
                    savedDrafts.map((document) => (
                      <DocumentCard
                        key={document._id}
                        document={document}
                        isDraft={true}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {documentsData.length > 0 ? (
                  documentsData.map((document) => (
                    <DocumentCard
                      isDraft={false}
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
          refreshDocuments={fetchDocuments}
          isOpen={modalOpen}
          onClose={handleCloseModal}
          document={selectedDocument}
        />
      )}
    </div>
  );
};

export default DocumentsPage;