"use client";
import Details from "@/components/ui/blog-post/details";
import SEO from "@/components/ui/blog-post/seo";
import LinkComponent from "@/components/ui/blog-post/link-component";
import Publish from "@/components/ui/blog-post/publish";
import CoreSettingsBulk from "./core-settings-bulk";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import BulkBlogForm from "./bulk-blog-form";
import { usePathname, useRouter } from "next/navigation";
import { calculatePercentage, markTabChecked, markTabUnchecked, reset, setFieldCountDecrement, setFieldCountIncrement, setTabIndex } from "@/redux/singleBlogFormProgressSlice";
import { useDispatch } from "react-redux";
import { useCookieValue } from "@/hooks/use-cookie";
//import { useGetAccessToken } from "@/hooks/use-get-accessToken";
import { InfinitySpin } from "react-loader-spinner";
import { useFormState } from "@/context/FormProgressContext";
import { setTokenAfterAction } from "@/redux/tokenSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import BlogBuilderNotification from "./blog-notification";

const BulkPageUI = () => {
    const access_token = useCookieValue('access_token');
    const dispatch = useDispatch();
    const router = useRouter();

    const [submitted, setSubmitted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const pathName = usePathname();
    const { progress,
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
        uncompleteSection, } = useFormState()

    useEffect(() => {
        resetFormState()
    }, [pathName])

    const tabs = [
        { name: "Core Settings", component: CoreSettingsBulk, next: "Next" },
        { name: "Details", component: Details, next: "Next" },
        { name: "SEO", component: SEO, next: "Next" },
        { name: "Link", component: LinkComponent, next: "Generate" },
        //{ name: "Publish", component: Publish, next: "Publish" },
    ];

    const { control, handleSubmit, register, watch, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            blogEntries: [{ mainKeyword: "", title: "" }],
            coreSettings: {
                aiModel: "openrouter",
                language: "English",
                targetCountry: "USA",
                toneOfVoice: "Professional",
                articleSize: 1200,
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
            console.log({ data })
            setLoading(true);
            const blogEntries = data.blogEntries || [];
            const titles = blogEntries.map(item => item.title); // Extract titles array
    
            // Format data for the new API structure
            const blogRequests = titles.map(title => ({
                title: title,
                // Include all the data previously in bulkBlogData as requestData properties
                structure_dict: {
                    conclusion: data.elements?.includes("conclusion") || false,
                    tables: data.elements?.includes("tables") ? 1 : 0,
                    video_urls: ["https://example.com/video1", "https://example.com/video2"],
                    video_quantity: 2,
                    layout: "comprehensive",
                    h3: data.elements?.includes("h3") ? 3 : 0,
                    lists: data.elements?.includes("lists") ? 2 : 0,
                    italics: data.elements?.includes("italics") || false,
                    quotes: data.elements?.includes("quotes") || false,
                    key_takeaways: data.elements?.includes("KeyTakeaways") || false,
                    faq: data.elements?.includes("faqs") || false,
                    bold: data.elements?.includes("bold") || false,
                },
                article_size: data.articleSize || 1500,
                arguments: {
                    web_search_bool: false,
                    video_search_bool: false,
                    image_gen_bool: false,
                    web_search: "BS4",
                    tone: data.tone || "professional",
                    audience: data.audience || "tech professionals",
                    "Additional Info": data.additionalInfo || ""
                },
                improve_context: false,
                llm: "openrouter"
            }));
    
            console.log("Sending request to /api/documents/bulk-blog with payload:", { blogRequests });
    
            const response = await fetch("/api/documents/bulk-blog", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify({ blogRequests }), // Changed from { blogs: bulkBlogData }
            });
    
            // Log the raw response for debugging
            const responseText = await response.text();
            console.log("Raw API response:", responseText);
    
            // If not JSON, handle appropriately
            if (!response.ok) {
                let errorMessage;
                try {
                    // Try to parse as JSON first
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.error || errorData.message || "Failed to create bulk blogs";
                } catch (parseError) {
                    // If not JSON, use the raw text with a limit
                    const truncated = responseText.substring(0, 100) + (responseText.length > 100 ? '...' : '');
                    errorMessage = `Server error (non-JSON response): ${truncated}`;
                }
                throw new Error(errorMessage);
            }
    
            // Safely parse the JSON response
            let responseData;
            try {
                responseData = JSON.parse(responseText);
            } catch (parseError) {
                throw new Error("Invalid JSON in successful response");
            }
    
            console.log("Bulk blog jobs created:", responseData);
    
            // You might want to store the job IDs for status checking
            if (responseData.jobs && responseData.jobs.length > 0) {
                // Optional: Store job IDs for later status checking
                localStorage.setItem('pendingBlogJobs', JSON.stringify(responseData.jobs));
            }
    
            dispatch(setFieldCountIncrement(tabs[currentIndex].filledNum));
            dispatch(markTabChecked({ tabName: tabs[currentIndex].name }));
            dispatch(calculatePercentage());
            dispatch(setTokenAfterAction(titles.length));
    
            setCurrentIndex(tabs.length - 1);
            setSubmitted(true);
            
            toast.success("Blogs Queued Successfully", {
                description: `${responseData.jobs?.length || titles.length} blogs have been queued for generation`
            });
    
        } catch (error) {
            console.error("Error submitting bulk blogs:", error);
            toast.error("Failed to create bulk blogs", {
                description: error.message || "Please try again"
            });
        } finally {
            setLoading(false);
        }
    };

    const CurrentComponent = tabs[currentIndex].component;

    const backHandler = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prevIndex => {
                const newIndex = prevIndex - 1;
                console.log("currentIndex from back ", newIndex);
                // removeFieldCount(tabs[prevIndex].filledNum)
                // uncompleteSection({ tabName: tabs[prevIndex].name })
                // setActiveTabIndex(newIndex)
                // updateProgress()
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
                // addFieldCount(tabs[prevIndex].filledNum)
                // completeSection({tabName: tabs[prevIndex].name })
                // setActiveTabIndex(newIndex)
                // updateProgress()
                dispatch(setFieldCountIncrement(tabs[prevIndex].filledNum));
                dispatch(markTabChecked({ tabName: tabs[prevIndex].name }));
                dispatch(setTabIndex(newIndex));
                dispatch(calculatePercentage());
                return newIndex;
            });
        }
    };

    const exitHandler = () => {
        //resetFormState()
        dispatch(reset());
        router.push("/");
    };

    return (
        <div className="relative left-4">
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 9999 }}>
                    <div className="relative">
                        <Loader2 className="h-16 w-16 animate-spin text-primaryYellow" />
                    </div>
                </div>
            )}
            {submitted && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 9999 }}>
                    <div className="relative bg-white rounded-lg shadow-xl" style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
                        <BlogBuilderNotification />
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit(submitHandler)} className="relative top-[1rem] left-[10rem]">
                <BulkBlogForm
                    fields={fields}
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                    addMoreHandler={addMoreHandler}
                    removeEntryHandler={removeEntryHandler}
                />

                <div className="p-6 mt-2 max-w-3xl">
                    {/* Tab Navigation */}
                    <div className="flex gap-[24px] mb-5">
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`flex justify-center items-center px-2 text-md py-2 border rounded-full 
                                    ${currentIndex === index
                                        ? "bg-paleYellow text-tabColor font-bold border-tabColor"
                                        : "bg-gray-100 text-gray-600 border-gray-300"
                                    }`}
                                style={{
                                    width: '360px',
                                    height: '36px',
                                    boxSizing: 'border-box',
                                }}
                                disabled={loading}
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

                    {/* Navigation Buttons */}
                    <div className="flex w-full px-8 justify-end mt-8 ml-10 gap-[16px]">
                        {currentIndex > 0 && (
                            <button
                                type="button"
                                onClick={backHandler}
                                disabled={loading}
                                className="w-[180px] py-3 font-sans font-bold text-base rounded-md leading-5 flex justify-center items-center bg-white text-backButtonColors border border-backButtonColors"
                            >
                                Back
                            </button>
                        )}

                        {currentIndex < tabs.length - 1 ? (
                            <button
                                type="button"
                                onClick={nextHandler}
                                disabled={loading}
                                className="w-[180px] py-3 font-sans font-bold text-base rounded-md leading-5 flex justify-center items-center bg-tabColor text-white"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-[180px] py-3 font-sans font-bold text-base rounded-md leading-5 flex justify-center items-center bg-tabColor text-white"
                            >
                                Generate
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BulkPageUI;