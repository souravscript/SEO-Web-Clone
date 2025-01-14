import React, { createContext, useContext, useState } from "react";


const FormProgressContext=createContext()
// Provider Component
export const FormProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [totalInputs] = useState(14);
  const [completedFields, setCompletedFields] = useState(0);
  const [sections, setSections] = useState([
    { name: "Core Settings", isCompleted: false },
    { name: "Details", isCompleted: false },
    { name: "SEO", isCompleted: false },
    { name: "Link", isCompleted: false },
    { name: "Publish", isCompleted: false },
  ]);

  // Functions for state management
  const updateProgress = () => {
    setProgress((completedFields / totalInputs) * 100);
  };

  const addFieldCount = (count) => {
    const newCount = Math.min(completedFields + count, totalInputs);
    setCompletedFields(newCount);
    setProgress((newCount / totalInputs) * 100);
  };

  const removeFieldCount = (count) => {
    const newCount = Math.max(completedFields - count, 0);
    setCompletedFields(newCount);
    setProgress((newCount / totalInputs) * 100);
  };

  const resetFormState = () => {
    setCompletedFields(0);
    setProgress(0);
    setSections(sections.map((section) => ({ ...section, isCompleted: false })));
  };

  const completeSection = (sectionName) => {
    setSections(
      sections.map((section) =>
        section.name === sectionName ? { ...section, isCompleted: true } : section
      )
    );
  };

  const uncompleteSection = (sectionName) => {
    setSections(
      sections.map((section) =>
        section.name === sectionName ? { ...section, isCompleted: false } : section
      )
    );
  };

  return (
    <FormProgressContext.Provider
      value={{
        progress,
        activeTabIndex,
        totalInputs,
        completedFields,
        sections,
        updateProgress,
        addFieldCount,
        removeFieldCount,
        resetFormState,
        setActiveTabIndex,
        completeSection,
        uncompleteSection,
      }}
    >
      {children}
    </FormProgressContext.Provider>
  );
};

// Custom Hook to Use Context
export const useFormState = () => {
  const context = useContext(FormProgressContext);
  if (context === undefined) {
    throw new Error(
      "useFormState must be used within a FormStateProvider"
    );
  }
  return context;
};
