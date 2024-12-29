// "use client";
// import React, { useEffect, useState } from 'react'


// import CoreSettingsSingle from "@/components/ui/blog-post/core-settings-single";
// import Details from "@/components/ui/blog-post/details";
// import SEO from "@/components/ui/blog-post/seo";
// import LinkComponent from "@/components/ui/blog-post/link-component";
// import Publish from "@/components/ui/blog-post/publish";

// import SinglePageUI from '@/components/ui/blog-post/single-page-UI';
// import SideProgress from '@/components/ui/blog-post/side-progress';
// import { useRouter } from 'next/navigation';
// const tabs = [
//   {
//       name: "Core Settings",
//       component: CoreSettingsSingle,
//       next: "Next",
//       isCheckedOut:false,
//       filledNum:6
//   },
//   {
//       name: "Details",
//       component: Details,
//       next: "Next",
//       isCheckedOut:false, 
//       filledNum:4,
//   },
//   {
//       name: "SEO",
//       component: SEO,
//       next: "Next",
//       isCheckedOut:false, 
//       filledNum:1
//   },
//   {
//       name: "Link",
//       component: LinkComponent,
//       next: "Generate",
//       isCheckedOut:false, 
//       filledNum:2
//   },
//   {
//       name: "Publish",
//       component: Publish,
//       next: "Publish",
//       isCheckedOut:false, 
//       filledNum:6
//   },
// ];

// const SingleBlogPage = () => {
//     const router = useRouter();
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [formFilled, setFormFilled] = useState(tabs[0].filledNum);
//     const [submitted, setSubmitted] = useState(false); // Track submission state
//     const [toastData, setToastData] = useState(null);
//     const [tabData, setTabData] = useState(tabs);
//     const totalFields=14;
//     const [progressPercent, setProgressPercent] = useState(0);

//   // Extracting values from the Redux store
//   //const { currentTabIndex, totalFields, filledFormFields } = useSelector((state) => state.formProgress);

//   // Calculate the progress percentage

//   useEffect(() => {
//     if (totalFields > 0) {
//       const percent = (formFilled / totalFields) * 100;
//       setProgressPercent(Math.min(percent, 100));
//     } else {
//       setProgressPercent(0); // To avoid NaN when totalFields is 0
//     }
//   }, [formFilled,currentIndex]);

//   const incrementFieldCount = (num) => { 
//     setFormFilled(prevState => prevState + num);
//   }
//   const decrementfieldCount = (num) => {
//     setFormFilled(prevState => prevState - num);
//   }
//   const tabMarking = (tabName) => {
//     const newTabData = tabData.map(tab => {
//         if (tab.name === tabName) {
//             tab.isCheckedOut = !tab.isCheckedOut;
//         }
//         return tab;
//     });
//     setTabData(newTabData);
//   }
// const submitHandler = async (data) => {
//         try {

//             setSubmitted(true); // Mark as submitted
//             setCurrentIndex(tabs.length - 1); // Navigate to "Publish" tab
            
//             // // Destructure title and mainKeyword directly from the form data
//             const { title} = data;
//             if (!title) {
//                 throw new Error("Title or content is missing");
//             }
//             // Retrieve and parse the access token from localStorage
//             // const session = localStorage.getItem("session");
//             // if (!session) {
//             //     throw new Error("Session data is not available in localStorage");
//             // }
    
//             // const { access_token } = JSON.parse(session); // Destructure the access_token
//             // if (!access_token) {
//             //     throw new Error("Access token is missing in session data");
//             // }
    
//             //console.log("Access token is:", access_token);
    
//             // Make the POST request to the API
//             const res = await fetch("/api/documents/single-blog", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${access_token}`,
//                 },
//                 body: JSON.stringify({ title }),
//             });
    
//             if (!res.ok) {
//                 const errorData = await res.json();
//                 throw new Error(errorData?.error || "Failed to create document");
//             }
//             //tabNavigation()
//             setToastData({ title });
//         } catch (err) {
//             console.log("Error is:", err.message || err);
//         }
//     };
//     //const closeToast = () => setToastData(null);

//     const backHandler = () => {
//         if (currentIndex > 0) {
//             // setCurrentIndex(prevIndex => {
//             //     const newIndex = prevIndex - 1;
//             //     console.log("currentIndex from back ",newIndex)
//             // dispatch(setFieldCountDecrement(tabData[prevIndex].filledNum));
//             // dispatch(markTabUnchecked({ tabName: tabData[prevIndex].name }));
//             // dispatch(markTabChecked({ tabName: tabData[prevIndex-1].name }));
//             // dispatch(setTabIndex(newIndex));
//             // return newIndex;
//             // });
//             setCurrentIndex(prevIndex=>prevIndex-1)
//             decrementfieldCount(tabData[currentIndex].filledNum)
//             tabMarking(tabData[currentIndex].name)
//         }
//     };
    
//     const nextHandler = async () => {
//         console.log(tabData)
//         if ( currentIndex < tabs.length - 1) {
//             // setCurrentIndex(prevIndex => {
//             //     const newIndex = prevIndex + 1;
//             //     console.log("currentIndex from next ", newIndex);
//             //     dispatch(setFieldCountIncrement(tabData[prevIndex].filledNum));
//             //     dispatch(markTabChecked({ tabName: tabData[prevIndex].name }));
//             //     dispatch(markTabChecked({ tabName: tabData[prevIndex].name }));
//             //     dispatch(setTabIndex(newIndex));
//             //     return newIndex;
//             // });
//             setCurrentIndex(prevIndex=>prevIndex-1)
//             incrementFieldCount(tabData[currentIndex].filledNum)
//             tabMarking(tabData[currentIndex].name)
//         }
//     };

//     const exitHandler = () => {
//       //dispatch(reset());
//       const newTabData=[...tabData]
//       for(val in newTabData){
//           newTabData[val].isCheckedOut=false
//       }
//       setTabData(newTabData)
//       router.push("/");
//   };
//   return (
//     <div className='flex'>
//         <SideProgress 
//           currentIndex={currentIndex} 
//           progressPercent={progressPercent}
//           tabData={tabData}
//         />
//         <SinglePageUI 
//           currentIndex={currentIndex}
//           submitted={submitted}
//           tabData={tabData} 
//           nextHandler={nextHandler} 
//           backHandler={backHandler} 
//           submitHandler={submitHandler}
//           exitHandler={exitHandler} 
//           toastData={toastData} 
//           setToastData={setToastData}
//         /> 
//     </div>
//   )
// }

// export default SingleBlogPage