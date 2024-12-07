import { IoIosLink } from "react-icons/io";
import { IoChevronDownOutline } from "react-icons/io5";

const LinkComponent = ({register}) => {
  return (
    <div className="space-y-6 p-6 border border-gray-300 rounded-lg bg-white shadow-md w-[828px] mx-auto">
      {/* Connect to web section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Connect to web</h3>
        <button className="w-[40%] flex items-center justify-between px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50 transition-all duration-300 ease-in-out">
          <span className="text-sm">None</span>
          <IoChevronDownOutline className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Add links section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Add links</h3>
        <div className="relative">
          <input
            {...register('link.url')}
            type="url"
            placeholder="Paste your URL here"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400 transition-all ease-in-out duration-300"
          />
          <IoIosLink 
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
          />
        </div>
      </div>
    </div>
  );
};

export default LinkComponent;
