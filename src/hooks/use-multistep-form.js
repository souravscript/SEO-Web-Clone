"use client";
const { useState } = require("react")

const useMultiStepForm=(steps)=>{
    const [currentStepIndex,setCurrentStepIndex]=useState(0)
    function goNext(){
        setCurrentStepIndex(i=>{
            if(i<=1)return i;
            return i-1;
        })
    }
    function goBack(){
        setCurrentStepIndex(i=>{
            if(i>=steps.length-1) return i;
            return i+1;
        })
    }
    function goTo(index){
        setCurrentStepIndex(index)
    }
    return {
        currentStepIndex,
        steps:steps[currentStepIndex],
        goNext,
        goBack,
        goTo
    }
}