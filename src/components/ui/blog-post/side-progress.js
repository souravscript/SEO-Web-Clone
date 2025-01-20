"use client";
import Image from "next/image";
import sidebarIcon from "@/../public/sidebar-icon.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { markTabChecked, markTabUnchecked } from "@/redux/singleBlogFormProgressSlice";
import { Circle, CircleCheck } from 'lucide-react';
import { useFormState } from "@/context/FormProgressContext";
import Cookies from "js-cookie";

const SideProgress = () => {
  const [progressPercent, setProgressPercent] = useState(0);
  const percentArr = JSON.parse(Cookies.get("progressState")); 
  const [percentState, setPercentState] = useState(percentArr);

  // Extracting values from the Redux store
  const { currentTabIndex, tabs } = useSelector((state) => state.formProgress);

  return (
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
          <span className="text-sm font-semibold text-gray-800">{`${percentState[currentTabIndex]}%`}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-300 rounded-full mb-4">
          <div
            className="h-2 bg-green-500 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${percentState[currentTabIndex]}%` }}
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
              <div key={tab.name} className="flex items-center gap-2">
                <span className="mx-2 transition-opacity duration-300 ease-in-out">
                  {tab.isCheckedOut ? <CircleCheck color="green" /> : <Circle />}
                </span>
                <span className="text-sm font-medium text-gray-700">
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
