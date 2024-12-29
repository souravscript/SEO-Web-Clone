import React, { useEffect } from "react";

const ToastComponent = ({ title, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Hide the toast after 3 seconds
    }, 4000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 w-64 bg-green-600 text-white p-4 rounded-lg shadow-lg transition-transform transform ease-in-out">
      <div className="flex items-center justify-between">
        <span className="mr-2">🎉 Generated Blog Post</span>
        <button
          onClick={onClose}
          className="ml-2 bg-transparent text-white text-lg leading-none focus:outline-none"
        >
          ✖
        </button>
      </div>
      <div className="mt-2 text-sm">{`Saved by the name "${title}"`}</div>
    </div>
  );
};

export default ToastComponent;
