import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const VideoLoadingScreen = ({ 
  videoSrc = "/api/placeholder/1920/1080", 
  loadingText = "Loading...", 
  spinnerColor = "text-white",
  textColor = "text-white"
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover"
        src={videoSrc}
      >
        Your browser does not support the video tag.
      </video>

      {/* Overlay to darken video and improve text visibility */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Loading Content */}
      <div className="relative z-10 text-center">
        {isLoading ? (
          <>
            <Loader2 
              className={`animate-spin mx-auto mb-4 ${spinnerColor}`} 
              size={48} 
            />
            <p className={`text-lg font-semibold ${textColor}`}>
              {loadingText}
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default VideoLoadingScreen;