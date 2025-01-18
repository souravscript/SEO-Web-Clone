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
    { id: "tables", label: "Tables", type:"number"  },
    { id: "h3", label: "H3",type:"number" },
    { id: "lists", label: "Lists", type:"number" },
    { id: "conclusion", label: "Conclusion", type:"checkbox", },
    { id: "italics", label: "Italics", type:"checkbox" },
    { id: "quotes", label: "Quotes", type:"checkbox" },
    { id: "faqs", label: "FAQs", type:"checkbox" },
    { id: "keyTakeaways", label: "Key Takeaways", type:"checkbox" },
    { id: "bold", label: "Bold", type:"checkbox" },
  ];

  // Watch for selected elements
  const selectedElements = watch("details.elements", []);

  return (
    <div className="p-6 space-y-6 border border-gray-300 rounded-lg shadow-sm w-[725px] mx-auto">
      {/* Details Section */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="details"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
           Additional Information
          </label>
          <textarea
            {...register("details.additionalInfo", {
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
    <div key={element.id} className="flex flex-col gap-4">
        {element.type === 'checkbox' ? (
            <div className="flex items-center gap-4">
              <label
                    htmlFor={element.id}
                    className="text-sm font-medium text-gray-600 mt-1"
                >
                    {element.label}
                </label>
                <input
                    {...register(`details.elements.checkType`)}
                    type="checkbox"
                    value={element.id}
                    id={element.id}
                    className="w-4 h-4 mt-1"
                />
                
            </div>
        ) : element.type === 'number' ? (
            <div className="flex items-center gap-4 ">
                <label
                    htmlFor={element.id}
                    className="text-sm font-medium text-gray-600"
                >
                    {element.label}
                </label>
                <input
                    {...register(`details.elements.numType.${element.id}`)}
                    type="number"
                    min={0}
                    max={10}
                    defaultValue={0}
                    id={element.id}
                    className="w-[80px] h-[28px] border border-gray-300 rounded px-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
            </div>
        ) : null}
    </div>
))}

</div>

        </div>
      </div>
    </div>
  );
};

export default Details;
