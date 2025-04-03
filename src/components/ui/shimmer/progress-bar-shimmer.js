const SkeletonSEOChecklist = () => {
    return (
      <div className="p-4 relative top-[3rem] left-[48px] h-max bg-white rounded-md shadow-md w-64 z-20 animate-pulse">
        {/* Background Section */}
        <div className="absolute inset-0 p-4 h-[29rem] w-64 z-10">
          <div className="absolute inset-0 bg-gray-200"></div>
          <div className="absolute inset-0 bg-gray-300"></div>
        </div>
  
        {/* Progress Section */}
        <div className="relative z-20">
          <div className="flex items-center justify-between mb-4">
            <span className="h-4 w-20 bg-gray-300 rounded"></span>
            <span className="h-4 w-10 bg-gray-300 rounded"></span>
          </div>
  
          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-300 rounded-full mb-4">
            <div className="h-2 bg-gray-400 rounded-full w-1/2"></div>
          </div>
  
          {/* Sidebar Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
          </div>
  
          {/* Checklist */}
          <div>
            <h1 className="h-6 w-32 bg-gray-300 rounded mb-4"></h1>
            <div className="space-y-2">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                  <span className="h-4 w-24 bg-gray-300 rounded"></span>
                </div>
              ))}
            </div>
          </div>
  
          {/* Footer Notes */}
          <div className="mt-6">
            <p className="h-3 w-40 bg-gray-300 rounded mb-1"></p>
            <p className="h-3 w-36 bg-gray-300 rounded"></p>
          </div>
        </div>
      </div>
    );
  };
  
  export default SkeletonSEOChecklist;