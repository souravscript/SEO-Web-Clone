// Shimmer UI Component
import React from "react";

const ShimmerCard = () => {
  return (
    <div className="w-70 cursor-pointer hover:shadow-lg rounded-lg transition-shadow duration-200 animate-pulse">
      {/* Card Header Section */}
      <div className="pt-6 pb-2">
        <div className="flex justify-between items-start">
          {/* Placeholder for the icon */}
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          {/* Placeholder for the badge */}
          <div className="ml-2 bg-yellow-100 p-2 rounded-full w-16 h-6"></div>
        </div>
      </div>

      {/* Card Content Section */}
      <div className="pt-2">
        {/* Placeholder for the title */}
        <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
        {/* Placeholder for the description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};


const DocShimmerGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[1180px]">
      {/* Render multiple shimmer cards */}
      {Array.from({ length: 12 }).map((_, index) => (
        <ShimmerCard key={index} />
      ))}
    </div>
  );
};

export default DocShimmerGrid;
