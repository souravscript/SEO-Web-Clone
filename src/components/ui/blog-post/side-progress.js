"use client";
import Image from "next/image";
import sidebarIcon from "@/../public/sidebar-icon.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { markTabChecked, markTabUnchecked } from "@/redux/singleBlogFormProgressSlice";
import { Circle, CircleCheck } from 'lucide-react';
import { useFormState } from "@/context/FormProgressContext";
const SideProgress = () => {
  // const dispatch = useDispatch();
   const [progressPercent, setProgressPercent] = useState(0);
   const {progress,
           activeTabIndex,
           totalInputs,
           completedFields,
           sections,
           updateProgress,
           addFieldCount,
           removeFieldCount,
           resetFormState,
           setActiveTabIndex,
           completeSection,
           uncompleteSection,}=useFormState()

  // Extracting values from the Redux store
  const { currentTabIndex,percent, totalFields, filledFormFields, tabs } = useSelector((state) => state.formProgress);
  console.log("progress Percent is ", progressPercent)
  // Calculate the progress percentage

  return (
    <div className="p-4 relative top-[2rem] h-max left-[48px] bg-white rounded-md shadow-md w-64">
      {/* Progress Section */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">Progress</span>
        <span className="text-sm font-semibold text-gray-800">{`${Math.round(Math.min(progress,93))}%`}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-300 rounded-full mb-4">
        <div
          className="h-2 bg-green-500 rounded-full"
          style={{ width: `${Math.min(progress,93)}%` }}
        ></div>
      </div>

      {/* Sidebar Icon */}
      <div className="flex justify-center mb-6">
        <Image src={sidebarIcon} alt="Sidebar Icon" width={50} height={50} />
      </div>

      {/* Checklist */}
      <div>
        <h1 className="text-lg font-semibold text-gray-800 mb-4">
          SEO Checklist
        </h1>
        <div className="space-y-2">
          {tabs.map((tab, index) => (
            <div key={tab.name} className="flex items-center gap-2">
              <span className="mx-2">{sections.isCheckedOut? <CircleCheck color="green"/>:<Circle/> }</span>
              <span
                className={`text-sm font-medium ${
                  tab.isCheckedOut ? "text-gray-700" : "text-gray-700"
                }`}
              >
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
  );
};

export default SideProgress;
