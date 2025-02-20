"use client";
import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import singleBlogPost from "@/../public/single-blog-post.png";
import tokenCoin from "@/../public/tokenCoin.png";

const BulkBlogForm = ({
    fields,
    register,
    errors,
    addMoreHandler,
    removeEntryHandler,
    setValue,
    watch
}) => {
    const [generatingTitleIndex, setGeneratingTitleIndex] = useState(null);

    const generateSingleTitle = async (index) => {
        const mainKeyword = watch(`blogEntries.${index}.mainKeyword`);

        // Validate keyword
        if (!mainKeyword || mainKeyword.trim() === '') {
            console.error('No keyword to generate title');
            return;
        }

        try {
            setGeneratingTitleIndex(index);
            const result = await fetch('/api/titles/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ keywords: mainKeyword })
            });

            if (!result.ok) {
                console.error('Failed to generate title');
                return;
            }

            const data = await result.json();
            
            // Clean and set the generated title
            if (data && data.title) {
                const cleanedTitle = data.title.trim().replace(/^["'\s]+|["'\s]+$/g, '');
                setValue(`blogEntries.${index}.title`, cleanedTitle);
            }
        } catch (error) {
            console.error('Error in title generation:', error);
        } finally {
            setGeneratingTitleIndex(null);
        }
    };

    return (
        <div className="p-6 w-[780px] mx-auto">
            <p className="absolute top-[2px] mb-[2rem]">
                <Link href="/">
                    <span className="text-[#A1A1A1] text-sm">Home</span>
                </Link>
                <span className="text-gray-400 mr-1 ml-1">/</span>
                <span className="text-black text-sm">Bulk Blog post</span>
            </p>
            
            {/* Header Section */}
            <div className="flex items-center mt-6 gap-4 mb-5">
                <Image src={singleBlogPost} alt="single blog post" height={40} width={40} className="rounded-md" />
                <div className="flex flex-row">
                    <h1 className="text-xl font-semibold text-gray-800">Blog Post</h1>
                    <Image src={tokenCoin} alt="single blog post" className="rounded-md h-5 w-5 ml-2 mt-1" />
                    <span className="text-gray-500 text-sm ml-1 mt-1">1 Token</span>
                </div>
            </div>

            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                        {/* Main Keyword Section */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 text-sm mb-2">
                                Main Keyword<span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter main keyword"
                                    {...register(`blogEntries.${index}.mainKeyword`, {
                                        required: "Main Keyword is required"
                                    })}
                                    className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                                />
                                <button
                                    type="button"
                                    onClick={() => generateSingleTitle(index)}
                                    disabled={generatingTitleIndex === index}
                                    className={`px-4 py-2 text-primary border border-solid bg-paleYellow text-tabColor border-tabColor rounded-md 
                                        ${generatingTitleIndex === index ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {generatingTitleIndex === index ? (
                                        <div className="flex items-center justify-center">
                                            <svg 
                                                className="animate-spin h-5 w-5 mr-2" 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                fill="none" 
                                                viewBox="0 0 24 24"
                                            >
                                                <circle 
                                                    className="opacity-25" 
                                                    cx="12" 
                                                    cy="12" 
                                                    r="10" 
                                                    stroke="currentColor" 
                                                    strokeWidth="4"
                                                ></circle>
                                                <path 
                                                    className="opacity-75" 
                                                    fill="currentColor" 
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Generating...
                                        </div>
                                    ) : (
                                        "Generate a Title"
                                    )}
                                </button>
                            </div>
                            {errors?.blogEntries?.[index]?.mainKeyword && (
                                <span className="text-red-500 text-xs mt-1">
                                    {errors.blogEntries[index].mainKeyword.message}
                                </span>
                            )}
                        </div>

                        {/* Title Section */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 text-sm mb-2">
                                Title<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter title"
                                {...register(`blogEntries.${index}.title`, {
                                    required: "Title is required"
                                })}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                            />
                            {errors?.blogEntries?.[index]?.title && (
                                <span className="text-red-500 text-xs mt-1">
                                    {errors.blogEntries[index].title.message}
                                </span>
                            )}
                        </div>

                        {/* Remove Button */}
                        {fields.length > 1 && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => removeEntryHandler(index)}
                                    className="text-red-500 hover:bg-red-50 p-2 rounded-full group"
                                    aria-label="Remove entry"
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-5 w-5 group-hover:text-red-700 transition-colors" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                                        />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Add More Button */}
            <div className="flex justify-end gap-4 mt-6">
                <button
                    type="button"
                    onClick={addMoreHandler}
                    className="px-4 py-2 text-orange-500 border border-orange-500 rounded-md hover:bg-orange-50 transition-colors"
                >
                    Add more
                </button>
            </div>
        </div>
    );
};

export default BulkBlogForm;