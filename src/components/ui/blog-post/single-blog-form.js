"use client";
import Link from "next/link";
import Image from "next/image";
import singleBlogPost from "@/../public/single-blog-post.png";
import tokenCoin from "@/../public/tokenCoin.png";

const SingleBlogForm = ({register,errors}) => {
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
                <div className="flex items-start mt-6 gap-4 mb-5">
                    <Image src={singleBlogPost} alt="single blog post" height={40} width={40} className="rounded-md" />
                    <div className="flex flex-row">
                        <h1 className="text-xl font-semibold text-gray-800">Single Blog Post</h1>
                        <Image src={tokenCoin} alt="single blog post" className="rounded-md h-5 w-5 ml-2 mt-1" />
                        <span className="text-gray-500 text-sm ml-1 mt-1">10 Tokens</span>
                    </div>
                </div>

                {/* Form Section */}
                <div className="flex flex-wrap gap-4">
                    {/* Main Keyword Input */}
                    <div className="flex flex-col gap-2 w-[410px] sm:w-[48%]">
                        <label className="text-gray-700 font-medium">Main Keyword <span className="text-red-500">*</span></label>
                        <input
                            // {...register('mainKeyword', { required: 'Main Keyword is required' })}
                            {...register('mainKeyword')}
                            type="text"
                            placeholder="Enter Main Keyword"
                            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                        />
                        {/* {errors?.mainKeyword && (
                            <span className="text-red-500 text-sm">
                                {errors.mainKeyword.message}
                            </span>
                        )} */}
                    </div>

                    {/* Title Input */}
                    <div className="flex flex-col gap-2 w-[410px] sm:w-[48%]">
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

