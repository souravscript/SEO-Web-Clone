 "use client";
 
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

