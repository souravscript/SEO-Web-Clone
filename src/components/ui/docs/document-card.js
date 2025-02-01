"use client";

import React from 'react';
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BsThreeDotsVertical } from "react-icons/bs";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const DocumentCard = ({ onClick, document, isDraft }) => {
  const truncatedDescription = document?.content?.slice(0, 75) + "...";

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Function to determine document type
  const getDocumentType = (document) => {
    const docTypeMap = {
      'blog': 'Blog post',
      'review': 'Product Review',
      'roundup': 'Product Roundup',
      'guide': 'How to Guide'
    };
    return docTypeMap[document.docType] || 'Blog post'; // Default to "Blog post" if docType is not provided
  };

  return (
    <Card 
      onClick={onClick} 
      className="w-68 h-max cursor-pointer hover:shadow-lg transition-shadow duration-200"
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
            className="ml-2 bg-yellow-100 px-5 py-2 rounded-full text-black font-thin"
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
          <p>
          <Markdown remarkPlugins={[remarkGfm]}>
            {truncatedDescription}
          </Markdown>
          </p>
        </div>

        <div className="flex items-center mt-4 text-sm text-gray-400">
          <svg 
            className="w-4 h-4 mr-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <span>{isDraft? "Saved" : "Published"} {formatDate(document.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;