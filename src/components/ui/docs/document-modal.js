import { useFetchModalData } from "@/hooks/use-fetch-single-doc";
import React, { useEffect, useState } from "react";


const DocumentModal = ({ document, isOpen, onClose }) => {
  const [data, setData] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getData = async () => {
      if (!isOpen || !document) return; // Check if the modal should open and if document exists

      setLoading(true);
      setError("");

      try {
        // Replace `apiUrl` with the actual document fetch API call
        const apiUrl = `/api/documents/single-blog/${document._id}`;
        const response = await fetch(apiUrl);
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch modal data:", err.message);
        setError("Failed to load content. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [isOpen, document]);

  if (!isOpen) return null; // Return nothing if modal is closed

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[-1]" onClick={onClose}></div>

      {/* Modal Box */}
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md max-h-[90%] overflow-hidden relative z-[1000]">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {loading ? "Loading..." : error ? "Error" : data.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            &times;
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <p className="text-gray-500">Loading content...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <h2>{data.title}</h2>
              <p>{data.content}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
