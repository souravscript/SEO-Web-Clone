"use client";
import CoreSettingsBulk from "@/components/ui/blog-post/core-settings-single";
import Details from "@/components/ui/blog-post/details";
import SEO from "@/components/ui/blog-post/seo";
import LinkComponent from "@/components/ui/blog-post/link-component";
import Publish from "@/components/ui/blog-post/publish";
import { useState } from "react";

const BulkPageUI = () => {
    const tabs = [
        {
            name: "Core Settings",
            component: CoreSettingsBulk,
            next: "Next",
        },
        {
            name: "Details",
            component: Details,
            next: "Next",
        },
        {
            name: "SEO",
            component: SEO,
            next: "Next",
        },
        {
            name: "Link",
            component: LinkComponent,
            next: "Generate",
        },
        {
            name: "Publish",
            component: Publish,
            next: "Publish",
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const CurrentComponent = tabs[currentIndex].component;

    const backHandler = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const nextHandler = () => {
        if (currentIndex < tabs.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-5">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`px-6 py-3 border rounded cursor-pointer ${
                            currentIndex === index
                                ? "bg-paleYellow text-primaryYellow font-bold border-primaryYellow rounded-3xl"
                                : "bg-gray-100 text-gray-600 border-gray-300 rounded-3xl"
                        }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="flex flex-col items-start">
                <CurrentComponent />
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-row-reverse items-end mt-5 relative left-20 ">
                
                <button
                    onClick={nextHandler}
                    disabled={currentIndex === tabs.length - 1}
                    className={`px-8 w-[10rem] py-2 mr-3 ml-3 text-2xl rounded ${
                        currentIndex === tabs.length - 1
                            ? "bg-primaryYellow text-white cursor-not-allowed"
                            : "bg-primaryYellow text-white cursor-pointer"
                    }`}
                >
                    {tabs[currentIndex].next}
                </button>
                <button
                    onClick={backHandler}
                    disabled={currentIndex === 0}
                    className={`w-[10rem] px-8 py-2 mr-3 ml-3 text-2xl rounded text-white ${
                        currentIndex === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : " border-[#C8C0B5] text-[#C8C0B5] cursor-pointer"
                    }`}
                >
                    Back
                </button>
                
            </div>
        </div>
    );
};

export default BulkPageUI;
