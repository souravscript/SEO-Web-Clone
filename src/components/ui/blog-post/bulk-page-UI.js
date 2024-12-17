"use client";
import Details from "@/components/ui/blog-post/details";
import SEO from "@/components/ui/blog-post/seo";
import LinkComponent from "@/components/ui/blog-post/link-component";
import Publish from "@/components/ui/blog-post/publish";
import CoreSettingsBulk from "./core-settings-bulk";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import BulkBlogForm from "./bulk-blog-form";

const BulkPageUI = () => {
    const tabs = [
        { name: "Core Settings", component: CoreSettingsBulk, next: "Next" },
        { name: "Details", component: Details, next: "Next" },
        { name: "SEO", component: SEO, next: "Next" },
        { name: "Link", component: LinkComponent, next: "Generate" },
        { name: "Publish", component: Publish, next: "Publish" },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [blogEntries, setBlogEntries] = useState([
        { id: uuidv4(), title: "", mainKeyword: "" },
    ]);

    const { handleSubmit, register, watch, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
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
            blogs: blogEntries,  // Adding blog entries to default values
        },
    });

    // Add a new blog entry
    const addMoreHandler = () => {
        const newEntry = { id: uuidv4(), title: "", mainKeyword: "" };
        setBlogEntries((prevEntries) => [...prevEntries, newEntry]);

        // Update form's default values as well
        setValue("blogs", [...blogEntries, newEntry]);
    };

    // Remove a blog entry by ID
    const removeEntryHandler = (id) => {
        const updatedEntries = blogEntries.filter((entry) => entry.id !== id);
        setBlogEntries(updatedEntries);

        // Update form's default values
        setValue("blogs", updatedEntries);
    };

    // Update a specific blog entry
    const updateEntryHandler = (id, field, value) => {
        const updatedEntries = blogEntries.map((entry) =>
            entry.id === id ? { ...entry, [field]: value } : entry
        );
        setBlogEntries(updatedEntries);

        // Update form's default values
        setValue("blogs", updatedEntries);
    };

    // Handle form submission
    const submitHandler = async (data) => {
        try {
            const payload = {
                coreSettings: data.coreSettings,
                blogs: data.blogs,  // Using updated blogs from form data
            };
            console.log("Submitting Bulk Blog Data:", payload);

            // Example API call
            const response = await fetch("/api/bulk-blogs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to submit blogs.");
            }
            console.log("Successfully submitted blogs.");
        } catch (error) {
            console.error("Error submitting blogs:", error);
        }
    };

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
        <form onSubmit={handleSubmit(submitHandler)} className="p-6 max-w-3xl mx-auto">
            <BulkBlogForm
                blogEntries={blogEntries}
                addMoreHandler={addMoreHandler}
                removeEntryHandler={removeEntryHandler}
                updateEntryHandler={updateEntryHandler}
                register={register}
                errors={errors}
            />

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-5">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        type="button"
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
                <CurrentComponent
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    getValues={getValues}
                    errors={errors}
                />
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-row-reverse items-end mt-5">
                <button
                    type={currentIndex === tabs.length - 1 ? "submit" : "button"}
                    onClick={currentIndex === tabs.length - 1 ? null : nextHandler}
                    disabled={currentIndex === tabs.length - 1}
                    className="px-8 w-[10rem] py-2 ml-3 text-2xl rounded bg-primaryYellow text-white"
                >
                    {tabs[currentIndex].next}
                </button>
                <button
                    type="button"
                    onClick={backHandler}
                    disabled={currentIndex === 0}
                    className="px-8 w-[10rem] py-2 mr-3 text-2xl rounded bg-gray-400 text-white"
                >
                    Back
                </button>
            </div>
        </form>
    );
};
export default BulkPageUI