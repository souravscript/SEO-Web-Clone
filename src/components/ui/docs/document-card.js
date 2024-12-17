"use client";
import Image from "next/image";
import notebookIcon from "@/../public/notebook-icon.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";

const DocumentCard = ({ document, onDelete}) => {
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const dropDownRef = useRef(null);

  const truncatedDescription = document?.content?.slice(0, 75) + "...";

  // Close dropdown on outside click
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleOutsideClick = (event) => {
        if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
          setDropDownOpen(false);
        }
      };

      window.addEventListener("mousedown", handleOutsideClick);

      return () => {
        window.removeEventListener("mousedown", handleOutsideClick);
      };
    }
  }, []);

  const deleteDocument = async () => {
    try {
      console.log("HIIIIII")
      console.log(`/api/documents/single-blog/${document._id}`)
      const session = localStorage.getItem("session");
      if (!session) {
        throw new Error("Session data is not available in localStorage");
      }

      const { access_token } = JSON.parse(session); // Destructure the access_token
      if (!access_token) {
        throw new Error("Access token is missing in session data");
      }
      const response = await fetch(`/api/documents/single-blog/${document._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the document");
      }
      console.log("Delete response: ",response)
      // Notify parent component to update UI
      onDelete(document._id);
      setDropDownOpen(!dropDownOpen)
    } catch (error) {
      console.log("Error deleting document:", error.message);
    }
  };

  

  return (
    <div className="bg-white relative shadow-md rounded-lg overflow-hidden w-80 px-2 border-gray-300 border-[0.1px] cursor-pointer">
      <div className="h-20 flex items-center justify-between">
        <Image src={notebookIcon} alt="text img" />
        <span className="text-black text-sm bg-yellow-100 p-2 rounded-full">
          How to guide
        </span>
        <BsThreeDotsVertical onClick={() => setDropDownOpen(!dropDownOpen)} />
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-bold">{document.title}</h2>
        <p className="text-gray-500 text-sm">{truncatedDescription}</p>
      </div>
      {dropDownOpen && (
        <div
          ref={dropDownRef}
          className="absolute right-[-5rem] top-0 mt-2 w-40 bg-white border border-gray-200 rounded"
        >
          <ul className="flex flex-col">
            <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer">Edit</li>
            <li onClick={deleteDocument} className="hover:bg-gray-100 px-4 py-2 cursor-pointer">Delete</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentCard;
