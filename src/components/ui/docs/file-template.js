"use client";
import Image from "next/image";
import notebookIcon from "@/../public/notebook-icon.png"

const FileTemplate=()=>{
    const desc="Here goes the description and how long it will be depends on the generated text that we are getting"
    const truncatedDescription=desc.slice(0,75) +"..."
    return (
        <div>
            <div>
                <Image src={notebookIcon} alt="Text-icon"/>
                <span>How to Guide</span>
            </div>
            <h3>Title</h3>
            <p>
                {truncatedDescription}
            </p>
        </div>
    )
}
export default FileTemplate;