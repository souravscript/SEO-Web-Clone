"use client";
import React, { useState } from "react";
import Image from "next/image";
import singleBlogPost from "@/../public/single-blog-post.png";
import Link from "next/link";

const BulkBlogForm = () => {
    const [formFields, setFormFields] = useState([
        { id: 1, mainKeyword: '', title: '' }
    ]);

    const handleAddMore = () => {
        setFormFields([
            ...formFields,
            { id: formFields.length + 1, mainKeyword: '', title: '' }
        ]);
    };

    const handleFormChange = (id, field, value) => {
        setFormFields(formFields.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleGenerate = () => {
        console.log('Form Data:', formFields);
        // Handle generation logic here
    };

    return (
        <div className="p-6 w-full max-w-3xl mx-auto">
            <p className="absolute top-[2px] mb-[2rem]">
                <Link href="/">
                    <span className="text-gray-400">Home</span>
                </Link>
                <span className="text-black">/Bulk Blog post</span>
            </p>
            {/* Header Section */}
            <div className="flex items-start gap-4 mt-6 mb-5">
                <Image 
                    src={singleBlogPost} 
                    alt="single blog post" 
                    height={40} 
                    width={40} 
                    className="rounded-md" 
                />
                <div className="flex flex-col">
                    <h1 className="text-xl font-semibold text-gray-800">Blog post</h1>
                    <span className="text-gray-500 text-sm ml-4 mt-1">10 Tokens</span>
                </div>
            </div>

            {/* Dynamic Form Fields */}
            <div className="space-y-4">
                {formFields.map((field) => (
                    <div key={field.id} className="flex flex-wrap gap-4">
                        {/* Main Keyword Input */}
                        <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                            <label className="text-gray-700 text-sm">
                                Main Keyword<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter main keyword"
                                value={field.mainKeyword}
                                onChange={(e) => handleFormChange(field.id, 'mainKeyword', e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                            />
                        </div>

                        {/* Title Input */}
                        <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                            <label className="text-gray-700 text-sm">
                                Title<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter title"
                                value={field.title}
                                onChange={(e) => handleFormChange(field.id, 'title', e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Buttons Section */}
            <div className="flex gap-4 mt-6">
                <button
                    onClick={handleAddMore}
                    className="px-4 py-2 text-orange-500 border border-orange-500 rounded-md hover:bg-orange-50 transition-colors"
                >
                    Add more
                </button>
                <button
                    onClick={handleGenerate}
                    className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                    Generate
                </button>
            </div>
        </div>
    );
};

export default BulkBlogForm;