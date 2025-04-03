import React from 'react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

const BlogBuilderNotification = () => {
  return (
    <div className="relative left-[10rem] top-[8rem] max-w-2xl mx-auto rounded-lg overflow-hidden shadow-lg border border-yellow-200 bg-gradient-to-br from-white to-yellow-50">
      {/* Progress Bar */}
      <div className="w-full bg-gray-100 h-2">
        <div className="bg-yellow-500 h-2 w-2/3 rounded-r-full"></div>
      </div>
      
      {/* Content */}
      <div className="p-8">
        <div className="flex items-center mb-4">
          <CheckCircle className="text-yellow-500 mr-3" size={28} />
          <h2 className="text-2xl font-bold text-yellow-700">Your Blog Post is Building</h2>
        </div>
        
        <p className="text-gray-600 mb-8 text-lg">
          We&apos;re putting the finishing touches on your content. You can track the progress or create another post while you wait.
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/blog-builder">
              <button className="px-6 py-3 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-600 transition-colors shadow-md">
                Go to Blog Builder
              </button>
            </Link>
            <Link href="/single-blog">
              <button className="px-6 py-3 bg-white text-yellow-600 font-medium rounded-md border border-yellow-200 hover:bg-yellow-50 transition-colors">
                Create Another
              </button>
            </Link>
        </div>
      </div>
      
      {/* Estimated Time */}
      <div className="bg-yellow-50 px-8 py-3 border-t border-yellow-100">
        <p className="text-yellow-600 text-sm">
          Estimated completion time: <span className="font-semibold">2 minutes</span>
        </p>
      </div>
    </div>
  );
};

export default BlogBuilderNotification;