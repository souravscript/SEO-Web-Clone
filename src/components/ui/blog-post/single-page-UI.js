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
import { useGetAccessToken } from "@/hooks/use-get-accessToken";
import { InfinitySpin, ThreeCircles } from "react-loader-spinner";

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
    const access_token = useGetAccessToken();
    const pathName=usePathname();

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
                isPublish: false
            },
        },
    });

    // useEffect(() => {
    //     const handleRouteChange = () => {
    //         dispatch(reset());
    //     };

    //     // Set up the route change listener
    //     router.events.on("routeChangeStart", handleRouteChange);

    //     // Cleanup the listener on component unmount
    //     return () => {
    //         router.events.off("routeChangeStart", handleRouteChange);
    //     };
    // }, [router.events, dispatch]);

    // ... rest of the handlers remain the same ...

    const submitHandler = async (data) => {
        try {
            setLoading(true)
            setSubmitted(true); // Mark as submitted
            setCurrentIndex(tabs.length - 1); // Navigate to "Publish" tab
            
            // // Destructure title and mainKeyword directly from the form data
            const { title} = data;
            if (!title) {
                throw new Error("Title or content is missing");
            }
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

            dispatch(setFieldCountIncrement(tabs[currentIndex].filledNum));
            dispatch(markTabChecked({ tabName: tabs[currentIndex].name }));
            dispatch(calculatePercentage());
            
            setToastData({ title });
            setCurrentIndex(tabs.length - 1);
        } catch (err) {
            console.log("Error is:", err.message || err);
        }finally{
            setLoading(false)}
    };
    const closeToast = () => setToastData(null);
    
    
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
            
            <div className={`relative ${loading ? 'opacity-50' : ''}`} style={{ zIndex: 1 }}>
                {toastData && <ToastComponent title={toastData.title} onClose={closeToast} />}
                {!loading && (
                    <form onSubmit={handleSubmit(submitHandler)} className="relative top-[1rem] left-[10rem]">
                        <SingleBlogForm watch={watch} errors={errors} register={register} />

                        <div className="p-6 max-w-3xl mx-auto">
                            <div className="flex gap-2 mb-5">
                                {tabData.map((tab, index) => (
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

                            <div className="flex flex-col items-start">
                                <CurrentComponent
                                    register={register}
                                    watch={watch}
                                    setValue={setValue}
                                    getValues={getValues}
                                    errors={errors}
                                />
                            </div>

                            <div className="flex justify-end mt-8 ml-10 absolute bottom-[-3rem] right-[-5.5rem]">
                                {currentIndex > 0 && currentIndex < tabs.length - 1 && (
                                    <button
                                        type="button"
                                        onClick={backHandler}
                                        className="px-6 w-32 py-3 text-lg rounded bg-gray-400 text-white"
                                    >
                                        Back
                                    </button>
                                )}

                                {currentIndex === tabs.length - 1 && (
                                    <button
                                        type="button"
                                        onClick={exitHandler}
                                        className="px-6 w-32 py-3 text-lg rounded bg-gray-200 text-gray-700"
                                    >
                                        Exit
                                    </button>
                                )}

                                {currentIndex < tabs.length - 2 && (
                                    <button
                                        type="button"
                                        onClick={nextHandler}
                                        className="px-6 w-32 py-3 ml-3 text-lg rounded bg-primaryYellow text-white"
                                    >
                                        Next
                                    </button>
                                )}

                                {currentIndex === tabs.length - 2 && (
                                    <button
                                        type="submit"
                                        className="px-6 w-32 py-3 ml-3 text-lg rounded bg-primaryYellow text-white"
                                    >
                                        Generate
                                    </button>
                                )}

                                {currentIndex === tabs.length - 1 && (
                                    <button
                                        type="button"
                                        className="px-6 w-32 py-3 ml-3 text-lg rounded bg-primaryYellow text-white"
                                    >
                                        Publish
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SinglePageUI;






