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
import { useCookieValue } from "@/hooks/useCookie";
//import { useGetAccessToken } from "@/hooks/use-get-accessToken";
import { InfinitySpin } from "react-loader-spinner";
import { useFormState } from "@/context/FormProgressContext";
import { setTokenAfterBlog } from "@/redux/tokenSlice";

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
        { name: "Publish", component: Publish, next: "Publish" },
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
            setSubmitted(true);
            console.log("Form data:", data);

            // Extract blog entries from the form data
            const blogEntries = data.blogEntries.map(blog => ({
                title: blog.title.trim(),
                mainKeyword: blog.mainKeyword.trim()
            })).filter(blog => blog.title && blog.mainKeyword);

            if (blogEntries.length === 0) {
                throw new Error("No valid blog entries found.");
            }

            // Safe checking for elements
            const elements = Array.isArray(data.details?.elements)
                ? data.details.elements
                : (data.details?.elements?.checkType || []);

            const reqJSONdata = {
                titles: blogEntries.map(entry => entry.title),
                structure_dict: {
                    conclusion: elements.includes("conclusion") ? true : false,
                    tables: data.details?.elements?.numType?.tables || 0,
                    video_urls: data.link?.links || [],
                    video_quantity: data.link?.links?.length || 0,
                    layout: data.details?.structure || "comprehensive",
                    h3: data.details?.elements?.numType?.h3 || 0,
                    lists: data.details?.elements?.numType?.lists || 0,
                    italics: elements.includes("italics") ? true : false,
                    quotes: elements.includes("quotes") ? true : false,
                    key_takeaways: elements.includes("keyTakeaways") ? true : false,
                    faq: elements.includes("faqs") ? true : false,
                    bold: elements.includes("bold") ? true : false,
                },
                article_size: data.coreSettings?.articleSize || 1500,
                arguments: {
                    web_search_bool: data.coreSettings?.webSearch || false,
                    video_search_bool: data.link?.connectToWeb === "yes" ? true : false,
                    image_gen_bool: data.coreSettings?.imageGeneration || false,
                    web_search: data.coreSettings?.webSearchEngine || "BS4",
                    tone: data.coreSettings?.tone || "professional",
                    audience: data.coreSettings?.audience || "tech professionals",
                    "Additional Info": data.details?.additionalInfo || ""
                },
                improve_context: data.coreSettings?.improveContext || false,
                llm: data.coreSettings?.llm || "openrouter"
            };

            console.log("Request JSON data:", reqJSONdata);

            const response = await fetch("/api/documents/bulk-blog", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify(reqJSONdata)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to submit blogs");
            }

            const responseData = await response.json();

            dispatch(setFieldCountIncrement(tabs[currentIndex].filledNum));
            dispatch(markTabChecked({ tabName: tabs[currentIndex].name }));
            dispatch(calculatePercentage());
            dispatch(setTokenAfterBlog(blogEntries.length));

            setCurrentIndex(tabs.length - 1);

        } catch (error) {
            console.error("Error submitting blogs:", error);
            // Optional: Show error toast or notification
            // setErrorToast(error.message);
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

                {/* Rest of the JSX remains the same */}

                {/* Tab Navigation */}
                <div className="p-6 mt-2 max-w-3xl">
                    <div className="flex gap-[24px] mb-5">
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`flex justify-center items-center px-2 text-md py-2 border rounded-full 
                                        ${currentIndex === index
                                        ? "bg-paleYellow text-tabColor font-bold border-tabColor"
                                        : "bg-gray-100 text-gray-600 border-gray-300"
                                    } ${submitted && index !== tabs.length - 1 ? "cursor-not-allowed" : ""
                                    }`}
                                style={{
                                    width: '360px',
                                    height: '36px',
                                    boxSizing: 'border-box',
                                }}
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

                    <div className="flex w-full px-8 justify-end mt-8 ml-10 gap-[16px]">
                        {currentIndex > 0 && currentIndex < tabs.length - 1 && (
                            <button
                                type="button"
                                onClick={backHandler}
                                className=" w-[180px] py-3 font-sans font-bold text-base rounded-md leading-5 flex justify-center items-center bg-white text-backButtonColors border border-backButtonColors"
                            >
                                Back
                            </button>
                        )}

                        {currentIndex === tabs.length - 1 && (
                            <button
                                type="button"
                                onClick={exitHandler}
                                className=" w-[180px] py-3 font-sans font-bold text-base rounded-md leading-5 flex justify-center items-center bg-white text-backButtonColors border border-[#C8C9B5]"
                            >
                                Exit
                            </button>
                        )}

                        {currentIndex < tabs.length - 2 && (
                            <button
                                type="button"
                                onClick={nextHandler}
                                className="w-[180px] py-3 font-sans font-bold text-base rounded-md leading-5 flex justify-center items-center bg-tabColor text-white"
                            >
                                Next
                            </button>
                        )}

                        {currentIndex === tabs.length - 2 && (
                            <button
                                type="submit"
                                className=" w-[180px] py-3 font-sans font-bold text-base rounded-md leading-5 flex justify-center items-center bg-tabColor text-white"
                            >
                                Generate
                            </button>
                        )}

                        {currentIndex === tabs.length - 1 && (
                            <button
                                type="button"
                                className="w-[180px] py-3 font-sans font-bold text-base rounded-md leading-5 flex justify-center items-center bg-tabColor text-white"
                            >
                                Publish
                            </button>
                        )}
                    </div>
                </div>

            </form>
        </div>
    );
};

export default BulkPageUI;