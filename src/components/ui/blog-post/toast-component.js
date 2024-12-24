import React, { useState, useEffect } from 'react';

const ToastComponent = ({ title, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Hide toast after 3 seconds
      onClose(); // Notify parent to remove toast
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  return (
    isVisible && (
      <div
        className={`fixed top-5 right-5 p-4 bg-green-600 text-white rounded-md shadow-lg transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center">
          <span className="mr-2">🎉</span>
          <span className="flex-1">
            Generated a blog post saved by the name <strong>{title}</strong>
          </span>
          <button
            onClick={handleClose}
            className="ml-4 text-sm font-bold text-white hover:text-gray-200 focus:outline-none"
          >
            ✖
          </button>
        </div>
      </div>
    )
  );
};

export default ToastComponent;
