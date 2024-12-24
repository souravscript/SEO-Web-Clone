"use client";
import CoreSettingsSingle from "@/components/ui/blog-post/core-settings-single";
import Details from "@/components/ui/blog-post/details";
import SEO from "@/components/ui/blog-post/seo";
import LinkComponent from "@/components/ui/blog-post/link-component";
import Publish from "@/components/ui/blog-post/publish";
import { useState } from "react";
import singleBlogPost from "@/../public/single-blog-post.png";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import SingleBlogForm from "./single-blog-form";
import { redirect } from "next/navigation";
import { generateBlog } from "@/lib/generateBlog";
import ToastComponent from "@/components/ui/blog-post/toast-component";
//import Cookies from "universal-cookie"
//import SingleBlogForm from "./single-blog-form";

//const cookies=new Cookies()
const tabs = [
        {
            name: "Core Settings",
            component: CoreSettingsSingle,
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
const SinglePageUI = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [submitted, setSubmitted] = useState(false); // Track submission state
    const [toastData, setToastData] = useState(null);
    const CurrentComponent = tabs[currentIndex].component;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            mainKeyword: '',
            title: '',
            coreSettings: {
                aiModel: 'GPT-4',
                language: 'English',
                targetCountry: 'USA',
                toneOfVoice: 'Professional',
                articleSize: 'Medium',
            },
            details: {
                includeDetails: '',
                structure: '',
                openingSentence: '',
                elements: [],
            },
            seo: {
                keywords: '',
            },
            link: {
                connectToWeb: 'None',
                url: '',
            },
            publish: {
                isPublish:false
            },
        },
    });

    // Form submission handler
    const submitHandler = async (data) => {
        try {
            setSubmitted(true); // Mark as submitted
            setCurrentIndex(tabs.length - 1); // Navigate to "Publish" tab
            //console.log("Form Submission Data:", data);
            
            // const content=generateBlog(data)
            // console.log("Content is : ",content)
            // // Destructure title and mainKeyword directly from the form data
            const { title} = data;
    
            if (!title) {
                throw new Error("Title or content is missing");
            }
    
            // Retrieve and parse the access token from localStorage
            const session = localStorage.getItem("session");
            if (!session) {
                throw new Error("Session data is not available in localStorage");
            }
    
            const { access_token } = JSON.parse(session); // Destructure the access_token
            if (!access_token) {
                throw new Error("Access token is missing in session data");
            }
    
            //console.log("Access token is:", access_token);
    
            // Make the POST request to the API
            const res = await fetch("/api/documents/single-blog", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify({ title }),
            });
    
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData?.error || "Failed to create document");
            }
            setToastData({ title });
            //console.log(res)
            //const result = await res;
            //console.log("Success: POST request to Document", result);
        } catch (err) {
            console.log("Error is:", err.message || err);
        }
    };
    const closeToast = () => setToastData(null);

    const backHandler = () => {
        if (!submitted && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const nextHandler = () => {
        if (currentIndex < tabs.length - 2) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const tabClickHandler = (index) => {
        if (!submitted) {
            setCurrentIndex(index); // Navigate to the clicked tab if not submitted
        } else if (index === tabs.length - 1) {
            setCurrentIndex(index); // Allow access to "Publish" tab after submission
        }
    };

    return (
        <>
        {toastData && <ToastComponent title={toastData.title} onClose={closeToast} />}
        <form onSubmit={handleSubmit(submitHandler)} className="relative top-[1rem] left-[10rem]">
            <SingleBlogForm watch={watch} errors={errors} register={register} />

            {/* Tab Navigation */}
            <div className="p-6 max-w-3xl mx-auto">
                <div className="flex gap-2 mb-5">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            type="button" // Prevent default submission
                            onClick={() => tabClickHandler(index)}
                            disabled={submitted && index !== tabs.length - 1} // Restrict access to other tabs post submission
                            className={`px-6 py-3 border rounded cursor-pointer ${
                                currentIndex === index
                                    ? "bg-paleYellow text-primaryYellow font-bold border-primaryYellow rounded-3xl"
                                    : "bg-gray-100 text-gray-600 border-gray-300 rounded-3xl"
                            } ${
                                submitted && index !== tabs.length - 1 ? "cursor-not-allowed" : ""
                            }`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex flex-col items-start">
                    <CurrentComponent
                        register={register}
                        watch={watch}
                        setValue={setValue}
                        getValues={getValues}
                        errors={errors}
                    />
                </div>

                {/* Navigation Buttons one
                <div className="flex float-end
                 items-end mt-5 relative left-20">
                    {currentIndex === tabs.length - 2 && (
                        <button
                            type="submit" // Submit the form only in the "Link" component
                            className="px-8 w-[10rem] py-2 mr-3 ml-3 text-2xl rounded bg-primaryYellow text-white cursor-pointer"
                        >
                            Generate
                        </button>
                    )}
                    {currentIndex < tabs.length - 2 && (
                        <button
                            type="button" // Prevent submission for "Next" buttons
                            onClick={nextHandler}
                            className={`px-8 w-[10rem] py-2 mr-3 ml-3 text-2xl rounded ${
                                currentIndex === tabs.length - 1
                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                    : "bg-primaryYellow text-white cursor-pointer"
                            }`}
                        >
                            Next
                        </button>
                    )}
                    {currentIndex > 0 && (
                        <button
                            type="button"
                            onClick={backHandler}
                            className="w-[10rem] px-8 py-2 mr-3 ml-3 bg-gray-400 text-2xl rounded text-white border-[#C8C0B5] cursor-pointer"
                        >
                            Back
                        </button>
                    )}
                </div> */}
                {/* Navigation Buttons  two*/}
                <div className="flex flex-row-reverse items-end mt-5">
                    {currentIndex === tabs.length - 2 && (
                        <button
                            type="submit" // Submit the form only in the "Link" component
                            className="px-8 w-[10rem] py-2 ml-3 text-2xl rounded bg-primaryYellow text-white cursor-pointer"
                        >
                            Generate
                        </button>
                    )}
                    {currentIndex < tabs.length - 2 && (
                        <button
                            type="button" // Prevent submission for "Next" buttons
                            onClick={nextHandler}
                            className={`px-8 w-[10rem] py-2 ml-3 text-2xl rounded ${
                                currentIndex === tabs.length - 1
                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                    : "bg-primaryYellow text-white cursor-pointer"
                            }`}
                        >
                            Next
                        </button>
                    )}
                    {currentIndex > 0 && (
                        <button
                            type="button"
                            onClick={backHandler}
                            className="px-8 w-[10rem] py-2 mr-3 text-2xl rounded bg-gray-400 text-white cursor-pointer"
                        >
                            Back
                        </button>
                    )}
                </div>

            </div>
        </form>
        {/* {
            currentIndex===tabs.length-1 && <div className="absolute left-[55rem] top-[31rem] ">
          <button onClick={()=>{alert("Publish feature not available"); redirect('/')}} className="bg-primaryYellow text-white cursor-pointer px-8 w-[10rem] py-2 mr-3 ml-3 text-2xl rounded">Publish</button>
          <button onClick={()=>{redirect('/')}} className="bg-gray-400 text-white cursor-pointer px-8 w-[10rem] py-2 mr-3 ml-3 text-2xl rounded">Exit</button>
        </div>
        } */}
        </>
    );
};

export default SinglePageUI;
