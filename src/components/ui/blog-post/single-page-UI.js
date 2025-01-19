"use client";
import CoreSettingsSingle from "@/components/ui/blog-post/core-settings-single";
import Details from "@/components/ui/blog-post/details";
import SEO from "@/components/ui/blog-post/seo";
import LinkComponent from "@/components/ui/blog-post/link-component";
import Publish from "@/components/ui/blog-post/publish";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import SingleBlogForm from "./single-blog-form";
import { usePathname, useRouter } from "next/navigation";
import ToastComponent from "@/components/ui/blog-post/toast-component";
import { setFieldCountIncrement,calculatePercentage,setFieldCountDecrement, markTabChecked, markTabUnchecked, reset, setTabIndex } from "@/redux/singleBlogFormProgressSlice";
import { useDispatch } from "react-redux";
import { InfinitySpin, ThreeCircles } from "react-loader-spinner";
import { useCookieValue } from "@/hooks/useCookie";
import { useFormState } from "@/context/FormProgressContext";
import { setTokenAfterBlog } from "@/redux/tokenSlice";

const tabs = [
        {
            name: "Core Settings",
            component: CoreSettingsSingle,
            next: "Next",
            isCheckedOut:false,
            filledNum:3
        },
        {
            name: "Details",
            component: Details,
            next: "Next",
            isCheckedOut:false, 
            filledNum:2,
        },
        {
            name: "SEO",
            component: SEO,
            next: "Next",
            isCheckedOut:false, 
            filledNum:1
        },
        {
            name: "Link",
            component: LinkComponent,
            next: "Generate",
            isCheckedOut:false, 
            filledNum:2
        },
        {
            name: "Publish",
            component: Publish,
            next: "Publish",
            isCheckedOut:false, 
            filledNum:1,
        },
    ];





const SinglePageUI = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [toastData, setToastData] = useState(null);
    const [tabData, setTabData] = useState(tabs);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const CurrentComponent = tabs[currentIndex]?.component;
    //const access_token = useCookieValue('access_token');
    
    //const user = useGetUser("/api/profile");
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
    const pathName=usePathname();
    useEffect(()=>{
        resetFormState()
        },[pathName])

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        trigger,
        formState: { errors },
    } = useForm({
        defaultValues: {
            mainKeyword: '',
            title: '',
            coreSettings: {
                aiModel: 'Open Router',
                language: 'English',
                targetCountry: 'USA',
                toneOfVoice: 'Professional',
                articleSize: 400,
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
                connectToWeb: false,
                links: [],
            },
            publish: {
                isPublish: false
            },
        },
    });


    
    const submitHandler = async (data) => {
        const { title} = data;
        const {elements}=data.details
        const reqJSONdata={
            title:title,
            structure_dict: {
            conclusion: elements.includes("conclusion")?true:false,
            tables: elements.includes("tables")?1:0,
            video_urls: ["https://example.com/video1", "https://example.com/video2"],
            video_quantity: 2,
            layout: "comprehensive",
            h3: elements.includes("h3")?3:0,
            lists: elements.includes("lists")?2:0,
            italics: elements.includes("italics")?true:false,
            quotes: elements.includes("quotes")?true:false,
            key_takeaways: elements.includes("KeyTakeaways")?true:false,
            faq: elements.includes("faqs")?true:false,
            bold: elements.includes("bold")?true:false,   
            },
            article_size: 1500,
            arguments: {
                web_search_bool: false,
                video_search_bool: false,
                image_gen_bool: false,
                web_search: "BS4",
                tone: "professional",
                audience: "tech professionals",
                "Additional Info": ""
            },
            improve_context: false,
            llm: "openrouter"
        }
        try {
            setLoading(true)
            setSubmitted(true); // Mark as submitted
            setCurrentIndex(tabs.length - 1); // Navigate to "Publish" tab
            
            // // Destructure title and mainKeyword directly from the form data
            const { title} = data;
            if (!title) {
                throw new Error("Title or content is missing");
            }
            //console.log("req JSON data in frontend",reqJSONdata)
            const res = await fetch("/api/documents/single-blog", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    //Authorization: `Bearer ${access_token}`,
                },
                credentials: 'include',
                body: JSON.stringify({ reqJSONdata }),
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData?.error || "Failed to create document");
            }
            // const tokenRes = await fetch("/api/tokens", {
            //     method: "PUT",
            //     headers: {
            //         "Content-Type": "application/json",
            //         Authorization: `Bearer ${access_token}`,
            //     },
            //     //credentials: 'include',
            // })
            // if (tokenRes.ok) {
            //     dispatch(setProfile(user));
            // }
            dispatch(setFieldCountIncrement(tabs[currentIndex].filledNum));
            dispatch(markTabChecked({ tabName: tabs[currentIndex].name }));
            dispatch(calculatePercentage());
            dispatch(setTokenAfterBlog(1))
            setToastData({ title });
            setCurrentIndex(tabs.length - 1);
        } catch (err) {
            //console.log("Error is:", err.message || err);
        }finally{
            setLoading(false)}
    };
    const closeToast = () => setToastData(null);
    
    
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
        // resetFormState()
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
            
            <div className={` relative ${loading ? 'opacity-50' : ''}`} style={{ zIndex: 1 }}>
                {toastData && <ToastComponent title={toastData.title} onClose={closeToast} />}
                {!loading && (
                    <form onSubmit={handleSubmit(submitHandler)} className="relative top-[1rem] left-[10rem]">
                        <SingleBlogForm watch={watch} errors={errors} register={register} />

                        <div className="p-6 max-w-3xl">
                            <div className="flex gap-[24px] mb-3">
                            {tabData.map((tab, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`flex justify-center items-center px-2 text-md py-2 border rounded-full 
                                        ${
                                            currentIndex === index
                                                ? "bg-paleYellow text-tabColor font-bold border-tabColor"
                                                : "bg-gray-100 text-gray-600 border-gray-300"
                                        } ${
                                            submitted && index !== tabs.length - 1 ? "cursor-not-allowed" : ""
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

                            <div className="flex flex-col items-start">
                                <CurrentComponent
                                    register={register}
                                    watch={watch}
                                    setValue={setValue}
                                    getValues={getValues}
                                    errors={errors}
                                />
                            </div>

                            <div className="flex justify-end mt-8 ml-10 absolute bottom-[-3rem] gap-[16px] right-[1.6rem]">
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
                                        className="w-[180px] py-3 font-sans font-bold text-base rounded-md leading-5 flex justify-center items-center bg-tabColor text-white "
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
                            <div className="h-6 w-full"></div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SinglePageUI;






