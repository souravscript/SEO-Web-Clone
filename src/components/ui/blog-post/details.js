"use client";
import React from 'react';
//import { Card } from '@/components/ui/card';

const Details = () => {
  const structures = [
    { id: 'introductory', label: 'Introductory', isDefault: true },
    { id: 'surprise', label: 'Surprise' },
    { id: 'inspire', label: 'Inspire' },
    { id: 'question', label: 'Question' },
    { id: 'surprise2', label: 'Surprise' }
  ];

  const elements = [
    { id: 'conclusion', label: 'Conclusion', defaultChecked: true },
    { id: 'tables', label: 'Tables', defaultChecked: true },
    { id: 'h3', label: 'H3' },
    { id: 'lists', label: 'Lists' },
    { id: 'italics', label: 'Italics' },
    { id: 'quotes', label: 'Quotes' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'keyTakeaways', label: 'Key Takeaways', defaultChecked: true },
    { id: 'bold', label: 'Bold', defaultChecked: true }
  ];

  return (
    <div className="p-6 space-y-6 border border-gray-300 rounded-lg shadow-sm w-[828px] mx-auto">
      {/* Details Section */}
      <div className="space-y-4">
        <div>
          <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
            Include these details
          </label>
          <textarea
            id="details"
            className="w-full min-h-[100px] p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Example: phone number 270-555-1234"
          />
        </div>

        {/* Structure Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Structure</h3>
          <div className="flex flex-wrap gap-4">
            {structures.map(({ id, label, isDefault }) => (
              <label key={id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="structure"
                  id={id}
                  defaultChecked={isDefault}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                />
                <span className="text-sm text-gray-600">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Opening Sentence Textarea */}
        <div>
          <textarea
            className="w-full min-h-[120px] p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter the type of opening sentence for blog"
          />
        </div>

        {/* Elements Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Elements</h3>
          <div className="flex flex-wrap gap-4">
            {elements.map(({ id, label, defaultChecked }) => (
              <label key={id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={id}
                  defaultChecked={defaultChecked}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;