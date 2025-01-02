const BulkBlogForm = ({
    blogEntries,
    addMoreHandler,
    removeEntryHandler,
    updateEntryHandler,
    errors,
    register,
    setValue,  // To update the value if needed
}) => {
    return (
        <div className="p-6 w-full max-w-3xl mx-auto">
            {/* Breadcrumb and Header Section... */}

            {/* Dynamic Form Fields */}
            <div className="space-y-4">
                {blogEntries.map((field, index) => (
                    <div key={field.id} className="flex flex-wrap gap-4 items-end">
                        {/* Main Keyword Input */}
                        <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                            <label className="text-gray-700 text-sm">
                                Main Keyword<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter main keyword"
                                {...register(`blogEntries[${index}].mainKeyword`, { required: "Main Keyword is required" })}
                                defaultValue={field.mainKeyword}
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
                                {...register(`blogEntries[${index}].title`, { required: "Title is required" })}
                                defaultValue={field.title}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                            />
                            {errors?.blogEntries?.[index]?.title && (
                                <span className="text-red-500 text-xs">
                                    {errors.blogEntries[index].title.message}
                                </span>
                            )}
                        </div>

                        {/* Remove Button */}
                        {blogEntries.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeEntryHandler(field.id)}
                                className="text-red-500 border border-red-500 px-3 py-2 rounded-md hover:bg-red-50"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Add More Button */}
            <div className="flex gap-4 mt-6 float-end">
                <button
                    type="button"
                    onClick={addMoreHandler}
                    className="px-4 py-2 text-orange-500 border border-orange-500 rounded-md hover:bg-orange-50 transition-colors"
                >
                    Add more
                </button>
                <div>
                    <button
                        type="button"
                        onClick={()=>{}}
                        className="px-4 py-2 text-white bg-primaryYellow rounded-md hover:bg-paleYellow hover:text-primaryYellow hover:border-primaryYellow transition-colors" 
                    >
                        Generate
                    </button>
                </div>
            </div>
        </div>
    );
};
export default BulkBlogForm