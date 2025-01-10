"use client";
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
}) => {
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
                <div className="flex items-start mt-6 gap-4 mb-5">
                    <Image src={singleBlogPost} alt="single blog post" height={40} width={40} className="rounded-md" />
                    <div className="flex flex-row">
                        <h1 className="text-xl font-semibold text-gray-800">Blog Post</h1>
                        <Image src={tokenCoin} alt="single blog post" className="rounded-md h-5 w-5 ml-2 mt-1" />
                        <span className="text-gray-500 text-sm ml-1 mt-1">10 Tokens</span>
                    </div>
                </div>

            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-wrap gap-4 items-end">
                        {/* Main Keyword Input */}
                        <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                            <label className="text-gray-700 text-sm">
                                Main Keyword<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter main keyword"
                                {...register(`blogEntries.${index}.mainKeyword`, {
                                    required: "Main Keyword is required"
                                })}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                            />
                            {errors?.blogEntries?.[index]?.mainKeyword && (
                                <span className="text-red-500 text-xs">
                                    {errors.blogEntries[index].mainKeyword.message}
                                </span>
                            )}
                        </div>

                        {/* Title Input */}
                        <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                            <label className="text-gray-700 text-sm">
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
                                <span className="text-red-500 text-xs">
                                    {errors.blogEntries[index].title.message}
                                </span>
                            )}
                        </div>

                        {/* Remove Button */}
                        {fields.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeEntryHandler(index)}
                                className="text-red-500 border border-red-500 px-3 py-2 rounded-md hover:bg-red-50"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Add More Button */}
            <div className="flex justify-end gap-4 mt-6 relative right-3">
                <button
                    type="button"
                    onClick={addMoreHandler}
                    className="px-4 py-2 text-orange-500 border border-orange-500 rounded-md hover:bg-orange-50 transition-colors"
                >
                    Add more
                </button>
                <button
                    type="button"
                    onClick={() => {}}
                    className="px-4 py-2 text-white bg-primaryYellow rounded-md hover:bg-paleYellow hover:text-primaryYellow hover:border-primaryYellow transition-colors"
                >
                    Generate
                </button>
            </div>
        </div>
    );
};

export default BulkBlogForm;