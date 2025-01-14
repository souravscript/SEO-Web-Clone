

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
//import { useGetAccessToken } from "@/hooks/use-get-accessToken";
import { InfinitySpin } from "react-loader-spinner";
import { useFormState } from "@/context/FormProgressContext";

const BulkPageUI = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    //const access_token = useGetAccessToken();
    
    const [submitted, setSubmitted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const pathName = usePathname();
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

        useEffect(()=>{
            resetFormState()
            },[pathName])

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
            // const session = localStorage.getItem("session");
            // if (!session) {
            //     throw new Error("Session data is not available in localStorage");
            // }

            // const { access_token } = JSON.parse(session);
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
                    //Authorization: `Bearer ${access_token}`,
                },
                credentials: 'include',
                body: JSON.stringify(titles),
            });

            if (!response.ok) {
                throw new Error("Failed to submit blogs.");
            }
            addFieldCount(tabs[prevIndex].filledNum)
            completeSection({tabName: tabs[prevIndex].name })
            setActiveTabIndex(newIndex)
            updateProgress()
            // dispatch(setFieldCountIncrement(tabs[currentIndex].filledNum));
            // dispatch(markTabChecked({ tabName: tabs[currentIndex].name }));
            // dispatch(calculatePercentage());
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
                    removeFieldCount(tabs[prevIndex].filledNum)
                    uncompleteSection({ tabName: tabs[prevIndex].name })
                    setActiveTabIndex(newIndex)
                    updateProgress()
                    // dispatch(setFieldCountDecrement(tabs[prevIndex].filledNum));
                    // dispatch(markTabUnchecked({ tabName: tabs[prevIndex].name }));
                    // dispatch(setTabIndex(newIndex));
                    // dispatch(calculatePercentage());
                    return newIndex;
                });
            }
        };
        
        const nextHandler = () => {
            if (currentIndex < tabs.length - 1) {
                setCurrentIndex(prevIndex => {
                    const newIndex = prevIndex + 1;
                    console.log("currentIndex from next ", newIndex);
                    addFieldCount(tabs[prevIndex].filledNum)
                    completeSection({tabName: tabs[prevIndex].name })
                    setActiveTabIndex(newIndex)
                    updateProgress()
                    // dispatch(setFieldCountIncrement(tabs[prevIndex].filledNum));
                    // dispatch(markTabChecked({ tabName: tabs[prevIndex].name }));
                    // dispatch(setTabIndex(newIndex));
                    // dispatch(calculatePercentage());
                    return newIndex;
                });
            }
        };
        
        const exitHandler = () => {
            resetFormState()
            //dispatch(reset());
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
                addMoreHandler={addMoreHandler}
                removeEntryHandler={removeEntryHandler}
            />
            
            {/* Rest of the JSX remains the same */}

            {/* Tab Navigation */}
             <div className="p-6 mt-6 max-w-3xl">
             <div className="flex gap-[24px] mb-5">
                            {tabs.map((tab, index) => (
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


                            <div className="flex justify-end mt-8 ml-10 absolute bottom-[-3rem] gap-[16px] right-[1.7rem]">
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



                </div>

        </form>
        </div>
    );
};

export default BulkPageUI;