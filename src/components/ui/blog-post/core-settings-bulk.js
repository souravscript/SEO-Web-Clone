const CoreSettingsBulk = ({register}) => {
    return (
        <div className="w-[828px] mx-auto flex flex-wrap gap-6 p-6 border border-gray-300 rounded-lg shadow-sm">
            {/* AI Model */}
            <div className="flex flex-col w-[48%]">
                <label className="text-gray-700 font-medium mb-1">AI Model</label>
                <select {...register('coreSettings.aiModel')} className="w-full h-[40px] border border-gray-300 rounded px-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>GPT-4</option>
                    <option>Dall-e</option>
                    <option>GPT-3.5</option>
                </select>
            </div>

            {/* Language */}
            <div className="flex flex-col w-[48%]">
                <label className="text-gray-700 font-medium mb-1">Language</label>
                <select {...register('coreSettings.language')} className="w-full h-[40px] border border-gray-300 rounded px-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                </select>
            </div>

            {/* Target Country */}
            <div className="flex flex-col w-[48%]">
                <label className="text-gray-700 font-medium mb-1">Target Country</label>
                <select {...register('coreSettings.aiModel')} className="w-full h-[40px] border border-gray-300 rounded px-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>USA</option>
                    <option>India</option>
                    <option>Germany</option>
                </select>
            </div>

            {/* Tone of Voice */}
            <div className="flex flex-col w-[48%]">
                <label className="text-gray-700 font-medium mb-1">Tone of Voice</label>
                <select className="w-full h-[40px] border border-gray-300 rounded px-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Professional</option>
                    <option>Casual</option>
                    <option>Creative</option>
                </select>
            </div>

            {/* Article Size */}
            <div className="flex flex-col w-[48%]">
                <label className="text-gray-700 font-medium mb-1">Article Size</label>
                <select className="w-full h-[40px] border border-gray-300 rounded px-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Short</option>
                    <option>Medium</option>
                    <option>Long</option>
                </select>
            </div>
        </div>
    );
};

export default CoreSettingsBulk;
