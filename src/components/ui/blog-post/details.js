"use client";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
          <Label htmlFor="details">Additional Information</Label>
          <Textarea
            {...register("details.additionalInfo", {
              required: "Details are required",
            })}
            id="details"
            placeholder="Example: phone number 270-555-1234"
            className="mt-2"
          />
          {errors.details?.includeDetails && (
            <p className="text-destructive text-sm mt-1">
              {errors.details.includeDetails.message}
            </p>
          )}
        </div>

        {/* Structure Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Structure</h3>

          <RadioGroup 
            {...register("details.structure")} 
            className="flex flex-wrap gap-4"
          >
            {structures.map((structure) => (
              <div key={structure.id} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={structure.id} 
                  id={structure.id} 
                  defaultChecked={structure.isDefault} 
                />
                <Label htmlFor={structure.id}>{structure.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Opening Sentence Textarea */}
        <div>
          <Textarea
            {...register("details.openingSentence", {
              required: "Opening sentence is required",
            })}
            placeholder="Enter the type of opening sentence for blog"
            className="mt-2"
          />
          {errors.details?.openingSentence && (
            <p className="text-destructive text-sm mt-1">
              {errors.details.openingSentence.message}
            </p>
          )}
        </div>

        {/* Elements Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Elements</h3>
          <div className="flex flex-wrap gap-4">
            {elements.map((element) => (
              <div key={element.id} className="flex flex-col gap-4 items-center justify-center">
                {element.type === 'checkbox' ? (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      {...register(`details.elements.checkType`)}
                      value={element.id}
                      id={element.id}
                    />
                    <Label htmlFor={element.id}>{element.label}</Label>
                  </div>
                ) : element.type === 'number' ? (
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={element.id}>{element.label}</Label>
                    <Input
                      {...register(`details.elements.numType.${element.id}`)}
                      type="number"
                      min={0}
                      max={10}
                      defaultValue={0}
                      id={element.id}
                      className="w-[80px]"
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
