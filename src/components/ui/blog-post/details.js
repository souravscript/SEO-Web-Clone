"use client";
import React from "react";

const Details = ({ register, errors, watch }) => {
  const structures = [
    { id: "introductory", label: "Introductory", isDefault: true },
    { id: "surprise", label: "Surprise" },
    { id: "inspire", label: "Inspire" },
    { id: "question", label: "Question" },
    { id: "surprise2", label: "Surprise" },
  ];

  const elements = [
    { id: "conclusion", label: "Conclusion", defaultChecked: true },
    { id: "tables", label: "Tables", defaultChecked: true },
    { id: "h3", label: "H3" },
    { id: "lists", label: "Lists" },
    { id: "italics", label: "Italics" },
    { id: "quotes", label: "Quotes" },
    { id: "faqs", label: "FAQs" },
    { id: "keyTakeaways", label: "Key Takeaways", defaultChecked: true },
    { id: "bold", label: "Bold", defaultChecked: true },
  ];

  // Watch for selected elements
  const selectedElements = watch("details.elements", []);

  return (
    <div className="p-6 space-y-6 border border-gray-300 rounded-lg shadow-sm w-[828px] mx-auto">
      {/* Details Section */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="details"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Include these details
          </label>
          <textarea
            {...register("details.includeDetails", {
              required: "Details are required",
            })}
            id="details"
            className="w-full min-h-[100px] p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Example: phone number 270-555-1234"
          />
          {errors.details?.includeDetails && (
            <p className="text-red-500 text-sm mt-1">
              {errors.details.includeDetails.message}
            </p>
          )}
        </div>

        {/* Structure Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Structure</h3>

          <div className="flex flex-wrap gap-4">
            {structures.map((structure) => (
              <div key={structure.id} className="flex items-center gap-2">
                <input
                  {...register("details.structure")}
                  type="radio"
                  value={structure.id}
                  id={structure.id}
                  defaultChecked={structure.isDefault}
                  className="w-4 h-4"
                />
                <label
                  htmlFor={structure.id}
                  className="text-sm font-medium text-gray-600"
                >
                  {structure.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Opening Sentence Textarea */}
        <div>
          <textarea
            {...register("details.openingSentence", {
              required: "Opening sentence is required",
            })}
            className="w-full min-h-[120px] p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter the type of opening sentence for blog"
          />
          {errors.details?.openingSentence && (
            <p className="text-red-500 text-sm mt-1">
              {errors.details.openingSentence.message}
            </p>
          )}
        </div>

        {/* Elements Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Elements</h3>
          <div className="flex flex-wrap gap-4">
            {elements.map((element) => (
              <div key={element.id} className="flex items-center gap-2">
                <input
                  {...register("details.elements")}
                  type="checkbox"
                  defaultChecked={false}
                  value={element.id}
                  id={element.id}
                  className="w-4 h-4"
                />
                <label
                  htmlFor={element.id}
                  className="text-sm font-medium text-gray-600"
                >
                  {element.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
