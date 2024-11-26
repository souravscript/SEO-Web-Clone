const Publish = () => {
  return (
    <div className="p-6 border border-gray-300 rounded-lg bg-white shadow-md w-[828px] mx-auto">
    <h3 className="text-sm font-semibold text-gray-700 mb-3">Publish to Wordpress</h3>
        <div className="flex gap-2">
            <label className="flex items-center space-x-4">
            <input
            type="radio"
            name="publish"
            value="yes"
            defaultChecked
            className="w-4 h-4 text-green-700 focus:ring-green-700 border-gray-300"
            />
            <span className="text-sm text-gray-700">Yes</span>
        </label>

        <label className="flex items-center space-x-4">
            <input
            type="radio"
            name="publish"
            value="no"
            className="w-4 h-4 text-green-700 focus:ring-green-700 border-gray-300"
            />
            <span className="text-sm text-gray-700">No</span>
        </label>
        </div>
    </div>
  );
};

export default Publish;
