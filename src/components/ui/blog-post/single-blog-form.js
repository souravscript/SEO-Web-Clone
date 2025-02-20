"use client";
import Link from "next/link";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import singleBlogPost from "@/../public/single-blog-post.png";
import tokenCoin from "@/../public/tokenCoin.png";

const SingleBlogForm = ({ register, errors, watch }) => {
    const { setValue } = useFormContext();
    const mainKeywordValue = watch('mainKeyword')
    const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

    const generateTitle = async () => {
        // Prevent multiple simultaneous calls
        if (isGeneratingTitle) return;

        try {
            setIsGeneratingTitle(true);
            const result = await fetch('/api/titles/generate', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ keywords: mainKeywordValue })
            })

            if (!result.ok) {
                console.error("Failed to generate title");
                return;
            }

            const data = await result.json()
            
            // Clean and set the generated title
            if (data && data.title) {
                const cleanedTitle = data.title.trim().replace(/^["'\s]+|["'\s]+$/g, '');
                setValue('title', cleanedTitle);
            }
        } catch (error) {
            console.error("Error generating title:", error);
        } finally {
            setIsGeneratingTitle(false);
        }
    }

    return (
        <div className="p-6 w-[780px] mx-auto">
            <p className="absolute top-[2px] mb-[2rem]">
                <Link href="/">
                    <span className="text-[#A1A1A1] text-sm">Home</span>
                </Link>
                <span className="text-gray-400 mr-1 ml-1">/</span>
                <span className="text-black text-sm">Single Blog post</span>
            </p>
            {/* Header Section */}
            <div className="flex items-center mt-6 gap-4 mb-5">
                <Image src={singleBlogPost} alt="single blog post" height={40} width={40} className="rounded-md" />
                <div className="flex flex-row">
                    <h1 className="text-xl font-semibold text-gray-800">Single Blog Post</h1>
                    <Image src={tokenCoin} alt="single blog post" className="rounded-md h-5 w-5 ml-2 mt-1" />
                    <span className="text-gray-500 text-sm ml-1 mt-1">1 Token</span>
                </div>
            </div>

            {/* Form Section */}
            <div className="flex flex-wrap gap-x-4">
                {/* Main Keyword Input */}
                <div className="flex items-end gap-4 w-full mb-3">
                    <div className="flex flex-col flex-grow">
                        <label className="text-gray-700 font-medium">Main Keyword <span className="text-red-500">*</span></label>
                        <input
                            {...register('mainKeyword')}
                            type="text"
                            placeholder="Enter Main Keyword"
                            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                        />
                    </div>
                    <div className="flex-shrink-0">
                        <button
                            type="button"
                            onClick={generateTitle}
                            disabled={isGeneratingTitle}
                            className={`px-4 py-2 text-primary border border-solid bg-paleYellow text-tabColor border-tabColor rounded-md 
                                ${isGeneratingTitle ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isGeneratingTitle ? (
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
                </div>

                {/* Title Input */}
                <div className="flex flex-col gap-2 w-full">
                    <label className="text-gray-700 font-medium">Title <span className="text-red-500">*</span></label>
                    <input
                        {...register('title', { required: 'Title is required' })}
                        type="text"
                        placeholder="Enter Title"
                        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                    />
                    {errors?.title && (
                        <span className="text-red-500 text-sm">
                            {errors.title.message}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SingleBlogForm;
