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

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 to-indigo-600 text-white">
      <div className="text-center space-y-6 animate-fade-in">
        <h1 className="text-6xl font-bold animate-bounce">Coming Soon</h1>
        <p className="text-xl">We&apos;re working hard to bring you something amazing!</p>
        <div className="flex justify-center space-x-4 text-3xl">
          <div className="flex flex-col items-center">
            <span className="font-bold">{timeLeft.days}</span>
            <span className="text-sm">Days</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold">{timeLeft.hours}</span>
            <span className="text-sm">Hours</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold">{timeLeft.minutes}</span>
            <span className="text-sm">Minutes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold">{timeLeft.seconds}</span>
            <span className="text-sm">Seconds</span>
          </div>
        </div>
        <p className="text-lg">Stay tuned!</p>
      </div>
    </div>
  );
};

export default ComingSoon;