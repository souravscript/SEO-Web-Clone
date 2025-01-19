"use client";

import { useState, useEffect } from "react";

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const targetDate = new Date("2024-01-01T00:00:00").getTime();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-primaryYellow to-paleYellow text-white">
      <div className="text-center space-y-6 animate-fade-in">
        <h1 className="text-6xl font-bold animate-bounce">Coming Soon</h1>
        <p className="text-xl">We&apos;re working hard to bring you something amazing!</p>
        <p className="text-lg">Stay tuned!</p>
      </div>
    </div>
  );
};

export default ComingSoon;