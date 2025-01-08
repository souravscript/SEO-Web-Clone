

"use client";
import Details from "@/components/ui/blog-post/details";
import SEO from "@/components/ui/blog-post/seo";
import LinkComponent from "@/components/ui/blog-post/link-component";
import Publish from "@/components/ui/blog-post/publish";
import CoreSettingsBulk from "./core-settings-bulk";
import { useFieldArray, useForm } from "react-hook-form";
import { useState } from "react";
import BulkBlogForm from "./bulk-blog-form";
import { useRouter } from "next/navigation";
import { calculatePercentage, markTabChecked, markTabUnchecked, reset, setFieldCountDecrement, setFieldCountIncrement, setTabIndex } from "@/redux/singleBlogFormProgressSlice";
import { useDispatch } from "react-redux";
import { useGetAccessToken } from "@/hooks/use-get-accessToken";
import { InfinitySpin } from "react-loader-spinner";

const BulkPageUI = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const access_token = useGetAccessToken();
    
    const [submitted, setSubmitted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const tabs = [
        { name: "Core Settings", component: CoreSettingsBulk, next: "Next" },
        { name: "Details", component: Details, next: "Next" },
        { name: "SEO", component: SEO, next: "Next" },
        { name: "Link", component: LinkComponent, next: "Generate" },
        { name: "Publish", component: Publish, next: "Publish" },
    ];

    const { control, handleSubmit, register, watch, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            blogEntries: [{ mainKeyword: "", title: "" }],
            coreSettings: {
                aiModel: "GPT-4",
                language: "English",
                targetCountry: "USA",
                toneOfVoice: "Professional",
                articleSize: "Medium",
            },
            seo: {
                keywords: "",
            },
            link: {
                connectToWeb: "None",
                url: "",
            },
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "blogEntries", // Changed from 'blogs' to 'blogEntries'
    });

    const addMoreHandler = () => {
        append({ mainKeyword: "", title: "" });
    };

    const removeEntryHandler = (index) => {
        remove(index);
    };

    const submitHandler = async (data) => {
        try {
            setSubmitted(true);
            console.log("Form data:", data);

            // Extract blog entries from the form data
            const blogEntries = data.blogEntries.map(blog => ({
                title: blog.title.trim(),
                mainKeyword: blog.mainKeyword.trim()
            })).filter(blog => blog.title && blog.mainKeyword);

            if (blogEntries.length === 0) {
                console.error("No valid blog entries found.");
                return;
            }

            const payload = {
                blogEntries, // Changed from 'blogs' to 'blogEntries'
                coreSettings: data.coreSettings,
                seo: data.seo,
                link: data.link
            };

            console.log("Payload:", payload);


            const titles = payload.blogEntries.map(entry => entry.title)
            console.log("titles", titles)   

            const response = await fetch("/api/documents/bulk-blog", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify(titles),
            });

            if (!response.ok) {
                throw new Error("Failed to submit blogs.");
            }

            dispatch(setFieldCountIncrement(tabs[currentIndex].filledNum));
            dispatch(markTabChecked({ tabName: tabs[currentIndex].name }));
            dispatch(calculatePercentage());
            setCurrentIndex(tabs.length - 1);

        } catch (error) {
            console.error("Error submitting blogs:", error);
        }
    };

    const CurrentComponent = tabs[currentIndex].component;

    
        const backHandler = () => {
            if (currentIndex > 0) {
                setCurrentIndex(prevIndex => {
                    const newIndex = prevIndex - 1;
                    console.log("currentIndex from back ", newIndex);
                    dispatch(setFieldCountDecrement(tabs[prevIndex].filledNum));
                    dispatch(markTabUnchecked({ tabName: tabs[prevIndex].name }));
                    dispatch(setTabIndex(newIndex));
                    dispatch(calculatePercentage());
                    return newIndex;
                });
            }
        };
        
        const nextHandler = () => {
            if (currentIndex < tabs.length - 1) {
                setCurrentIndex(prevIndex => {
                    const newIndex = prevIndex + 1;
                    console.log("currentIndex from next ", newIndex);
                    dispatch(setFieldCountIncrement(tabs[prevIndex].filledNum));
                    dispatch(markTabChecked({ tabName: tabs[prevIndex].name }));
                    dispatch(setTabIndex(newIndex));
                    dispatch(calculatePercentage());
                    return newIndex;
                });
            }
        };
        
        const exitHandler = () => {
            dispatch(reset());
            router.push("/");
        };



    return (
        <div className="relative">
        {loading && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 9999 }}>
                            <div className="relative">
                                {/* <ThreeCircles
                                    visible={true}
                                    height="100"
                                    width="100"
                                    color="#f6B647"
                                    ariaLabel="three-circles-loading"
                                /> */}
                                <InfinitySpin
                                    visible={true}
                                    width="200"
                                    color="#f6B647"
                                    ariaLabel="infinity-spin-loading"
                                />
                            </div>
                        </div>
                    )}
        <form onSubmit={handleSubmit(submitHandler)} className="p-6 max-w-3xl relative mx-auto">
            <BulkBlogForm
                fields={fields}
                register={register}
                errors={errors}
                addMoreHandler={addMoreHandler}
                removeEntryHandler={removeEntryHandler}
            />
            
            {/* Rest of the JSX remains the same */}

            {/* Tab Navigation */}
             <div className="p-6 mt-6 max-w-3xl mx-auto">
                             <div className="flex gap-2 mb-5">
                                 {tabs.map((tab, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`px-6 py-3 border rounded ${
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

            {/* Navigation Buttons */}
            <div className="flex justify-end mt-8 ml-10 absolute bottom-[-3rem] right-[-5.5rem]">
                    {/* Back Button */}
                    {currentIndex > 0 && currentIndex < tabs.length - 1 && (
                        <button
                        type="button"
                        onClick={backHandler}
                        className="px-6 w-32 py-3 text-lg rounded bg-gray-400 text-white"
                        >
                        Back
                        </button>
                    )}

                    {/* Exit Button */}
                    {currentIndex === tabs.length - 1 && (
                        <button
                        type="button"
                        onClick={exitHandler}
                        className="px-6 w-32 py-3 text-lg rounded bg-gray-200 text-gray-700"
                        >
                        Exit
                        </button>
                    )}
                    
                    {/* Next Button */}
                    {currentIndex < tabs.length - 2 && (
                        <button
                        type="button"
                        onClick={nextHandler}
                        className="px-6 w-32 py-3 ml-3 text-lg rounded bg-primaryYellow text-white"
                        >
                        Next
                        </button>
                    )}

                    {/* Generate Button */}
                    {currentIndex === tabs.length - 2 && (
                        <button
                        type="submit"
                        //onClick={generateHandler}
                        className="px-6 w-32 py-3 ml-3 text-lg rounded bg-primaryYellow text-white"
                        >
                        Generate
                        </button>
                    )}
                    
                    {/* Publish Button */}
                    {currentIndex === tabs.length - 1 && (
                        <button
                        type="button"
                        //onClick={publishHandler}
                        className="px-6 w-32 py-3 ml-3 text-lg rounded bg-primaryYellow text-white"
                        >
                        Publish
                        </button>
                    )}
                </div>
        </form>
        </div>
    );
};

export default BulkPageUI;