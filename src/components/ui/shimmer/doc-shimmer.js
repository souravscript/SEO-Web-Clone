// Shimmer UI Component
import React from "react";

const ShimmerCard = () => {
  return (
    <div className="shimmer-card bg-white relative shadow-md rounded-lg overflow-hidden w-80 px-2 border-gray-300 border-[0.1px] cursor-pointer animate-pulse">
      <div className="h-20 bg-gray-300 rounded mb-4"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded mb-1"></div>
        <div className="h-4 bg-gray-300 rounded mb-1 w-3/4"></div>
      </div>
    </div>
  );
};

const DocShimmerGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
      {/* Render multiple shimmer cards */}
      {Array.from({ length: 12 }).map((_, index) => (
        <ShimmerCard key={index} />
      ))}
    </div>
  );
};

export default DocShimmerGrid;
