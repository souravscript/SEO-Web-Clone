import { useState } from "react";
import { Link } from "lucide-react";

const LinkComponent = ({ register, setValue, getValues, watch }) => {
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Function to validate URL
  const isValidURL = (url) => {
    const urlRegex = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
    return urlRegex.test(url);
  };

  // Watch for changes in the "link.connectToWeb" field
  const connectToWebValue = watch("link.connectToWeb");

  // Handle input submission
  const handleInput = (e) => {
    e.preventDefault();
    if (isValidURL(inputValue)) {
      const currentLinks = getValues("link.links") || [];
      const updatedLinks = [...currentLinks, inputValue];
      setValue("link.links", updatedLinks); // Update the React Hook Form state
      setInputValue(""); // Clear the input field
      setErrorMessage(""); // Clear the error message
    } else {
      setErrorMessage("Please enter a valid URL.");
    }
  };

  // Handle chip removal
  const removeLink = (linkToRemove) => {
    const currentLinks = getValues("link.links") || [];
    const updatedLinks = currentLinks.filter((link) => link !== linkToRemove);
    setValue("link.links", updatedLinks); // Update the React Hook Form state
  };

  return (
    <div className="space-y-6 p-6 border border-gray-300 rounded-lg bg-white shadow-md w-[725px] mx-auto">
      {/* Connect to web section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Connect to web</h3>
        <select
          {...register("link.connectToWeb")}
          className="w-[40%] px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-50 transition-all duration-300 ease-in-out"
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      {/* Add links section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Add Video URLs</h3>
        <div className="relative">
          <input
            type="url"
            disabled={connectToWebValue === "no"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleInput(e)}
            placeholder="Paste your URL here"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400 transition-all ease-in-out duration-300"
          />
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        </div>
        {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}

        {/* Chips to display added links */}
        <div className="flex flex-wrap gap-2 mt-4">
          {(watch("link.links") || []).map((link, index) => (
            <div
              key={index}
              className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
            >
              {link}
              <button
                type="button"
                onClick={() => removeLink(link)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinkComponent;
