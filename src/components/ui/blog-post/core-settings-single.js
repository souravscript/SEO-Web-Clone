import React, { useState } from 'react';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const CoreSettingsSingle = ({ register, errors, setValue }) => {
    const [articleSize, setArticleSize] = useState(400); // State for slider

    const handleSliderChange = (value) => {
        setArticleSize(value);
        setValue('coreSettings.articleSize', value); // Update React Hook Form state
    };

    return (
        <div className="w-[725px] mx-auto flex flex-wrap gap-4 p-6 border border-gray-300 rounded-lg shadow-sm">
            {/* AI Model */}
            <div className="flex flex-col w-[48%] space-y-2">
                <Label>AI Model</Label>
                <Select {...register('coreSettings.aiModel')}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select AI Model" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="openrouter">Default (mix of models & expertise)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Language */}
            <div className="flex flex-col w-[48%] space-y-2">
                <Label>Language</Label>
                <Select {...register('coreSettings.language')}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Target Country */}
            <div className="flex flex-col w-[48%] space-y-2">
                <Label>Target Country</Label>
                <Select {...register('coreSettings.targetCountry')}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USA">USA</SelectItem>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Tone of Voice */}
            <div className="flex flex-col w-[48%] space-y-2">
                <Label>Tone of Voice</Label>
                <Select 
                    {...register('coreSettings.toneOfVoice', { 
                        required: 'tone of voice is required' 
                    })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Tone" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Casual">Casual</SelectItem>
                        <SelectItem value="Creative">Creative</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Article Size */}
            <div className="flex flex-col w-[47%] space-y-2">
                <Label>Article Size</Label>
                <Slider
                    min={400}
                    max={2000}
                    step={50}
                    value={[articleSize]}
                    onValueChange={([value]) => handleSliderChange(value)}
                    className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Current Size: {articleSize} words</span>
                    <span>Range: 400 - 2000 words</span>
                </div>
            </div>

            {/* Audience */}
            <div className="flex flex-col w-[48%] space-y-2">
                <Label>Audience</Label>
                <Input
                    type="text"
                    placeholder="eg: AI professionals, developers, entrepreneurs"
                    {...register('coreSettings.audience', { 
                        required: 'audience is required' 
                    })}
                />
                {errors?.coreSettings?.audience && (
                    <span className="text-destructive text-sm">
                        {errors.coreSettings.audience.message}
                    </span>
                )}
            </div>
        </div>
    );
};

export default CoreSettingsSingle;
