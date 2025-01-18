import { Slider } from '@/components/ui/slider';
import React, { useState } from 'react';

const CoreSettingsSingle = ({ register, errors, setValue }) => {
    const [articleSize, setArticleSize] = useState(400); // State for slider

    const handleSliderChange = (value) => {
        setArticleSize(value);
        setValue('coreSettings.articleSize', value); // Update React Hook Form state
    };
    return (
        <div className="w-[725px] mx-auto flex flex-wrap gap-6 p-6 border border-gray-300 rounded-lg shadow-sm">
            {/* AI Model */}
            <div className="flex flex-col w-[48%]">
                <label className="text-gray-700 font-medium mb-1">AI Model</label>
                <select
                    {...register('coreSettings.aiModel')}
                    className="w-full h-[40px] border border-gray-300 rounded px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option>Open Router</option>
                </select>
            </div>

            {/* Language */}
            <div className="flex flex-col w-[48%]">
                <label className="text-gray-700 font-medium mb-1">Language</label>
                <select
                    {...register('coreSettings.language')}
                    className="w-full h-[40px] border border-gray-300 rounded px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                </select>
            </div>

            {/* Target Country */}
            <div className="flex flex-col w-[48%]">
                <label className="text-gray-700 font-medium mb-1">Target Country</label>
                <select
                    {...register('coreSettings.targetCountry')}
                    className="w-full h-[40px] border border-gray-300 rounded px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option>USA</option>
                    <option>India</option>
                    <option>Germany</option>
                </select>
            </div>

            {/* Tone of Voice */}
            <div className="flex flex-col w-[48%]">
                <label className="text-gray-700 font-medium mb-1">Tone of Voice</label>
                <select
                    {...register('coreSettings.toneOfVoice', { required: 'tone of voice is required' })}
                    className="w-full h-[40px] border border-gray-300 rounded px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option>Professional</option>
                    <option>Casual</option>
                    <option>Creative</option>
                </select>
            </div>

            {/* Article Size */}
            <div className="flex flex-col w-[47%]">
                <label className="text-gray-700 font-medium mb-1">Article Size</label>
                <Slider
                    min={400}
                    max={2000}
                    step={50}
                    value={[articleSize]}
                    onValueChange={([value]) => handleSliderChange(value)}
                    className="w-full"
                />
                <span className="text-sm text-gray-500 mt-1">Current Size: {articleSize} words</span>
                <span className="text-sm text-gray-500">Range: 400 - 2000 words</span>
            </div>

            {/* Audience */}
            <div className="flex flex-col w-[48%] ml-2">
                <label className="text-gray-700 font-medium mb-2">Audience</label>
                <input
                    type="text"
                    {...register('coreSettings.audience', { required: 'audience is required' })}
                    placeholder="Enter your audience"
                    className="w-full h-[40px] border border-gray-300 rounded px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    );
};

export default CoreSettingsSingle;
