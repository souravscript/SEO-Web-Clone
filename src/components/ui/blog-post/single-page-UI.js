"use client";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// Import the toast from your project's specific location
// If you haven't set up shadcn/ui toast yet, you can install it with:
// // npx shadcn-ui@latest add toast
// import { toast } from "@/components/ui/toast";
import { toast } from "sonner";
// For loading indicator, you can use:
// npx shadcn-ui@latest add loader
import { Loader2 } from "lucide-react";

// Custom Components (assuming these will be refactored to use shadcn internally)
import CoreSettingsSingle from "@/components/ui/blog-post/core-settings-single";
import Details from "@/components/ui/blog-post/details";
import SEO from "@/components/ui/blog-post/seo";
import LinkComponent from "@/components/ui/blog-post/link-component";
import Publish from "@/components/ui/blog-post/publish";
import SingleBlogForm from "./single-blog-form";

// Redux and Context
import { 
  setFieldCountIncrement, 
  calculatePercentage, 
  setFieldCountDecrement, 
  markTabChecked, 
  markTabUnchecked, 
  reset, 
  setTabIndex 
} from "@/redux/singleBlogFormProgressSlice";
import { setTokenAfterAction } from "@/redux/tokenSlice";
import { useFormState } from "@/context/FormProgressContext";
import BlogBuilderNotification from "./blog-notification";

// Configuration
const TABS = [
  {
    id: "core-settings",
    name: "Core Settings",
    component: CoreSettingsSingle,
    next: "Next",
    filledNum: 3
  },
  {
    id: "details",
    name: "Details",
    component: Details,
    next: "Next",
    filledNum: 2,
  },
  {
    id: "seo",
    name: "SEO",
    component: SEO,
    next: "Next",
    filledNum: 1
  },
  {
    id: "link",
    name: "Link",
    component: LinkComponent,
    next: "Generate",
    filledNum: 2
  },
  // Publish tab commented out in original code
  // {
  //   id: "publish",
  //   name: "Publish",
  //   component: Publish,
  //   next: "Publish",
  //   filledNum: 1,
  // },
];

// Default form values
const DEFAULT_FORM_VALUES = {
  mainKeyword: '',
  title: '',
  coreSettings: {
    aiModel: 'Open Router',
    language: 'English',
    targetCountry: 'USA',
    toneOfVoice: 'Professional',
    articleSize: 400,
    audience: 'Tech Professionals',
    additionalInfo: ''
  },
  details: {
    includeDetails: '',
    structure: '',
    openingSentence: '',
    elements: [],
    videoUrls: [],
    videoQuantity: 0
  },
  seo: {
    keywords: '',
  },
  link: {
    connectToWeb: "yes",
    links: [],
  },
  publish: {
    isPublish: false
  },
};

const SinglePageUI = () => {
  const [currentTabId, setCurrentTabId] = useState(TABS[0].id);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const dispatch = useDispatch();
  const pathName = usePathname();
  // No need to destructure with the direct import
  
  const { resetFormState } = useFormState();
  
  // Find current tab index
  const currentIndex = TABS.findIndex(tab => tab.id === currentTabId);
  
  // Get current tab component
  const CurrentComponent = TABS[currentIndex]?.component;

  // Initialize form
  const methods = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
  });
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    getValues, 
    trigger, 
    formState: { errors } 
  } = methods;

  // Reset form state when pathname changes
  // useEffect(() => {
  //   resetFormState();
  //   dispatch(reset());
  // }, [pathName, resetFormState, dispatch]);

  // Create request payload from form data
  const createRequestPayload = (data) => {
    const { title, coreSettings } = data;
    const { elements, videoUrls = [], videoQuantity = 0 } = data.details;
    
    return {
      title: title,
      structure_dict: {
        conclusion: elements.includes("conclusion"),
        tables: elements.includes("tables"),
        video_urls: videoUrls.filter(url => url && url.trim() !== ''),
        video_quantity: videoQuantity,
        layout: "comprehensive",
        h3: elements.includes("h3"),
        lists: elements.includes("lists"),
        italics: elements.includes("italics"),
        quotes: elements.includes("quotes"),
        key_takeaways: elements.includes("KeyTakeaways"),
        faq: elements.includes("faqs"),
        bold: elements.includes("bold"),
      },
      article_size: coreSettings.articleSize,
      arguments: {
        web_search_bool: false,
        video_search_bool: false,
        image_gen_bool: false,
        web_search: "BS4",
        tone: coreSettings.toneOfVoice.toLowerCase(),
        audience: coreSettings.audience,
        "Additional Info": coreSettings.additionalInfo
      },
      improve_context: false,
      llm: "openrouter"
    };
  };

  // Handle form submission
  const submitHandler = async (data) => {
    try {
      setLoading(true);
      
      const { title } = data;
      if (!title) {
        throw new Error("Title is missing");
      }
      
      const reqJSONdata = createRequestPayload(data);
      
      const res = await fetch("/api/documents/single-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reqJSONdata }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to create document");
      }
      
      // Update UI state
      updateUIAfterSubmission(title);
      
      // Set submitted state to show success UI
      setSubmitted(true);
      
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Update UI after successful form submission
  const updateUIAfterSubmission = (title) => {
    dispatch(setFieldCountIncrement(TABS[currentIndex].filledNum));
    dispatch(markTabChecked({ tabName: TABS[currentIndex].name }));
    dispatch(calculatePercentage());
    dispatch(setTokenAfterAction(1));
    
    // Navigate to last tab (which would be publish if uncommented)
    const lastTabId = TABS[TABS.length - 1].id;
    setCurrentTabId(lastTabId);
    dispatch(setTabIndex(TABS.length - 1));
    toast.success(`${title} has been pushed to the queue.`);

  };

  // Navigation handlers
  const handleTabChange = (newTabId) => {
    const newIndex = TABS.findIndex(tab => tab.id === newTabId);
    const oldIndex = currentIndex;
    
    if (newIndex > oldIndex) {
      // Moving forward
      dispatch(setFieldCountIncrement(TABS[oldIndex].filledNum));
      dispatch(markTabChecked({ tabName: TABS[oldIndex].name }));
    } else if (newIndex < oldIndex) {
      // Moving backward
      dispatch(setFieldCountDecrement(TABS[oldIndex].filledNum));
      dispatch(markTabUnchecked({ tabName: TABS[oldIndex].name }));
    }
    
    dispatch(setTabIndex(newIndex));
    dispatch(calculatePercentage());
    setCurrentTabId(newTabId);
  };

  const nextHandler = () => {
    if (currentIndex < TABS.length - 1) {
      const nextTabId = TABS[currentIndex + 1].id;
      handleTabChange(nextTabId);
    }
  };

  const backHandler = () => {
    if (currentIndex > 0) {
      const prevTabId = TABS[currentIndex - 1].id;
      handleTabChange(prevTabId);
    }
  };

  const exitHandler = () => {
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
      <div className={`relative ${loading ? 'opacity-50' : ''}`} style={{ zIndex: 1 }}>
        <form onSubmit={handleSubmit(submitHandler)} className="relative top-[1rem] left-[10rem]">
          <FormProvider {...methods}>
            <SingleBlogForm watch={watch} errors={errors} register={register} />
          </FormProvider>

          <div className="p-6 max-w-3xl">
            <div className="flex gap-[24px] mb-3">
              {TABS.map((tab, index) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex justify-center items-center px-2 text-md py-2 border rounded-full 
                    ${currentTabId === tab.id
                      ? "bg-paleYellow text-tabColor font-bold border-tabColor"
                      : "bg-gray-100 text-gray-600 border-gray-300"
                    } ${submitted && index !== TABS.length - 1 ? "cursor-not-allowed" : ""}`}
                  style={{
                    width: '360px',
                    height: '36px',
                    boxSizing: 'border-box',
                  }}
                  disabled={submitted && index !== TABS.length - 1}
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

              <div className="flex justify-end mt-8 ml-10 absolute bottom-[-3rem] gap-[16px] right-[1.6rem]">
                {currentIndex > 0 && currentIndex < TABS.length && (
                  <button
                    type="button"
                    onClick={backHandler}
                    className="w-[180px] py-3 font-sans font-bold text-base rounded-md leading-5 flex justify-center items-center bg-white text-backButtonColors border border-backButtonColors"
                  >
                    Back
                  </button>
                )}

                {currentIndex < TABS.length - 1 && (
                  <button
                    type="button"
                    onClick={nextHandler}
                    className="w-[180px] py-3 font-sans font-bold text-base rounded-md leading-5 flex justify-center items-center bg-tabColor text-white"
                  >
                    Next
                  </button>
                )}

                {currentIndex === TABS.length - 1 && (
                  <button
                    type="submit"
                    className="w-[180px] py-3 font-sans font-bold text-base rounded-md leading-5 flex justify-center items-center bg-tabColor text-white"
                  >
                    Generate
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SinglePageUI;