"use client";
import { useState, useEffect } from "react";
import { Link as LinkIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const LinkComponent = ({ register, setValue, getValues, watch, errors }) => {
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Function to validate URL
  const isValidURL = (url) => {
    const urlRegex = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
    return urlRegex.test(url);
  };

  // Watch for changes in the "link.connectToWeb" field
  const connectToWebValue = watch("link.connectToWeb", "yes");

  // Reset input and links when connection is set to "no"
  useEffect(() => {
    if (connectToWebValue === "no") {
      setInputValue("");
      setValue("link.links", []);
    }
  }, [connectToWebValue, setValue]);

  // Handle input submission
  const handleInput = (e) => {
    e.preventDefault();
    if (connectToWebValue === "no") return;

    if (isValidURL(inputValue)) {
      const currentLinks = getValues("link.links") || [];
      const updatedLinks = [...currentLinks, inputValue];
      setValue("link.links", updatedLinks); // Update the React Hook Form state
      setInputValue(""); // Clear the input field
      setErrorMessage(""); // Clear the error message
    } else {
      setErrorMessage("Please enter a valid URL.");
    }
  };

  // Handle chip removal
  const removeLink = (linkToRemove) => {
    const currentLinks = getValues("link.links") || [];
    const updatedLinks = currentLinks.filter((link) => link !== linkToRemove);
    setValue("link.links", updatedLinks); // Update the React Hook Form state
  };

  return (
    <div className="space-y-6 p-6 border border-gray-300 rounded-lg bg-white shadow-md w-[725px] mx-auto">
      {/* Connect to web section */}
      <div>
        <Label className="text-sm font-semibold mb-3">Connect to web</Label>
        <Select 
          {...register("link.connectToWeb")}
          defaultValue="yes"
          value={connectToWebValue}
          onValueChange={(value) => setValue("link.connectToWeb", value)}
        >
          <SelectTrigger className="w-[40%]">
            <SelectValue placeholder="Select connection" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Add links section */}
      <div>
        <Label className="text-sm font-semibold mb-3">Add Video URLs</Label>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="url"
            disabled={connectToWebValue === "no"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleInput(e)}
            placeholder="Paste your URL here"
            className="pl-10"
          />
          {errorMessage && <p className="text-destructive text-sm mt-1">{errorMessage}</p>}
        </div>

        {/* Chips to display added links */}
        <div className="flex flex-wrap gap-2 mt-4">
          {(watch("link.links") || []).map((link, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="flex items-center"
            >
              {link}
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-2 h-4 w-4"
                onClick={() => removeLink(link)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinkComponent;
