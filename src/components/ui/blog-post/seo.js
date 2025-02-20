"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SEO = ({ register, errors }) => {
  return (
    <div className="space-y-4 p-6 border border-gray-300 rounded-lg bg-white shadow-md w-[725px] mx-auto">
      <Label className="text-lg font-semibold">
        Keywords to include in text
      </Label>
      <Textarea
        {...register("seo.keywords", { required: "This field is required" })}
        placeholder="Enter keywords or phrase"
      />
      {errors.seo?.keywords && (
        <p className="text-destructive text-sm mt-1">
          {errors.seo.keywords.message}
        </p>
      )}
    </div>
  );
};

export default SEO;
