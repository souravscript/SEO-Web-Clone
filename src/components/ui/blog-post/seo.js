const SEO = ({ register }) => {
  return (
    <div className="space-y-4 p-6 border border-gray-300 rounded-lg bg-white shadow-md w-[765px] mx-auto">
      <label className="block text-lg font-semibold text-gray-700">
        Keywords to include in text
      </label>
      <textarea
        {...register("seo.keywords", { required: "This field is required" })}
        placeholder="Enter keywords or phrase"
        className="w-full min-h-[120px] p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400 transition-all ease-in-out duration-300"
      />
    </div>
  );
};

export default SEO;
