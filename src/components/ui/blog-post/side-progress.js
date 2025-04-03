"use client";
import Image from "next/image";
import sidebarIcon from "@/../public/sidebar-icon.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { markTabChecked, markTabUnchecked, reset } from "@/redux/singleBlogFormProgressSlice";
import { Circle, CircleCheck } from 'lucide-react';
import { useFormState } from "@/context/FormProgressContext";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import SkeletonSEOChecklist from "../shimmer/progress-bar-shimmer";

const SideProgress = () => {
  const [isProgressBar, setIsProgressBar] = useState(false);
  const pathName = usePathname();
  const dispatch = useDispatch();
  
  // Get form progress from Redux
  const { currentTabIndex, tabs } = useSelector((state) => state.formProgress);

  // Calculate progress percentage
  const calculateProgress = (tabIndex, tabs) => {
    const totalSteps = tabs.length;
    const completedSteps = tabs.slice(0, tabIndex + 1).filter(tab => tab.isCheckedOut).length;
    return Math.round((completedSteps / totalSteps) * 100);
  };

  // Initialize progress state
  const [progressState, setProgressState] = useState(() => {
    const savedProgress = Cookies.get("progressState");
    try {
      return savedProgress ? JSON.parse(savedProgress) : new Array(tabs.length).fill(0);
    } catch (e) {
      return new Array(tabs.length).fill(0);
    }
  });

  // Update progress when tabs change
  useEffect(() => {
    const newProgress = tabs.map((_, index) => calculateProgress(index, tabs));
    setProgressState(newProgress);
    Cookies.set("progressState", JSON.stringify(newProgress));
  }, [tabs]);

  // Reset progress on path change
  useEffect(() => {
    setIsProgressBar(true);
    dispatch(reset());
  }, [pathName, dispatch]);

  return (
    !isProgressBar ? <SkeletonSEOChecklist /> :
    <div className="p-4 relative top-[3rem] left-[48px] h-max bg-white rounded-md shadow-md w-64 z-20">
      {/* Background Section */}
      <div className="absolute inset-0 p-4 h-[29rem] w-64 z-10">
        <div className="absolute inset-0 bg-yellow-half"></div>
        <div className="absolute inset-0 bg-blue-half"></div>
      </div>

      {/* Progress Section */}
      <div className="relative z-20">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-sm font-semibold text-gray-800">{`${progressState[currentTabIndex] || 0}%`}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-300 rounded-full mb-4">
          <div
            className="h-2 bg-green-500 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progressState[currentTabIndex] || 0}%` }}
          ></div>
        </div>

        {/* Sidebar Icon */}
        <div className="flex justify-center mb-6">
          <Image src={sidebarIcon} alt="Sidebar Icon" width={50} height={50} />
        </div>

        {/* Checklist */}
        <div>
          <h1 className="text-lg font-semibold text-gray-800 mb-4">SEO Checklist</h1>
          <div className="space-y-2">
            {tabs.map((tab, index) => (
              <div 
                key={tab.name} 
                className="flex items-center gap-2"
              >
                <span className="mx-2 transition-opacity duration-300 ease-in-out">
                  {tab.isCheckedOut ? (
                    <CircleCheck className="text-green-500" />
                  ) : (
                    <Circle className="text-gray-400" />
                  )}
                </span>
                <span className={`text-sm font-medium ${tab.isCheckedOut ? 'text-gray-900' : 'text-gray-500'}`}>
                  {tab.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Notes */}
        <div className="mt-6">
          <p className="text-xs text-gray-500 mb-1">
            Settings like language and article size help make powerful SEO.
          </p>
          <p className="text-xs text-gray-500">
            A strong SEO makes your business visible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SideProgress;