


// import { useEffect, useRef, useState } from "react";
// import EditorJS from "@editorjs/editorjs";
// import remarkGfm from "remark-gfm";
// import CheckList from "@editorjs/checklist";
// import Code from "@editorjs/code";
// import Delimiter from "@editorjs/delimiter";
// import Embed from "@editorjs/embed";
// import InlineCode from "@editorjs/inline-code";
// import List from "@editorjs/list";
// import Quote from "@editorjs/quote";
// import Table from "@editorjs/table";
// import Paragraph from "@editorjs/paragraph";
// import Header from "@editorjs/header";
// import Link from "next/link";
// import Image from "next/image";

// import notebook from "@/../public/single-blog-post.png";
// import tokenCoin from "@/../public/tokenCoin.png";
// import Markdown from "react-markdown";

// class MarkerTool {
//   static get isInline() {
//     return true;
//   }

//   get state() {
//     return this._state;
//   }

//   set state(state) {
//     this._state = state;
//     this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
//   }

//   constructor({ api }) {
//     this.api = api;
//     this.button = null;
//     this._state = false;
//     this.tag = "MARK";
//     this.class = "cdx-marker";
//   }

//   render() {
//     this.button = document.createElement("button");
//     this.button.type = "button";
//     this.button.innerHTML =
//       '<svg width="20" height="18"><path d="M10.458 12.04l2.919 1.686-.781 1.417-.984-.03-.974 1.687H8.674l1.49-2.583-.508-.775.802-1.401zm.546-.952l3.624-6.327a1.597 1.597 0 0 1 2.182-.59 1.632 1.632 0 0 1 .615 2.201l-3.519 6.391-2.902-1.675zm-7.73 3.467h3.465a1.123 1.123 0 1 1 0 2.247H3.273a1.123 1.123 0 1 1 0-2.247z"/></svg>';
//     this.button.classList.add(this.api.styles.inlineToolButton);
//     return this.button;
//   }
// }

// const EDITOR_TOOLS = {
//   code: Code,
//   header: {
//     class: Header,
//     shortcut: "CMD+H",
//     inlineToolbar: true,
//     config: {
//       placeholder: "Enter a Header",
//       levels: [2, 3, 4],
//       defaultLevel: 2,
//     },
//   },
//   paragraph: {
//     class: Paragraph,
//     inlineToolbar: true,
//   },
//   checklist: CheckList,
//   inlineCode: InlineCode,
//   table: Table,
//   list: List,
//   quote: Quote,
//   delimiter: Delimiter,
//   marker: MarkerTool,
// };

// const ProductContent = ({ apiData, featName }) => {
//   const editorInstance = useRef(null);
//   const [markdownContent, setMarkdownContent] = useState("");

//   useEffect(() => {
//     if (!editorInstance.current) {
//       const editor = new EditorJS({
//         holder: "editorjs",
//         placeholder: "Start writing here...",
//         tools: EDITOR_TOOLS,
//         // async onChange(api) {
//         //   const content = await api.saver.save();
//         //   setMarkdownContent(convertToMarkdown(content.blocks));
//         // },
//       });

//       editorInstance.current = editor;
//     }

//     return () => {
//       if (editorInstance.current) {
//         editorInstance.current = null;
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (editorInstance.current && apiData) {
//       editorInstance.current.isReady.then(() => {
//         editorInstance.current.render(apiData);
//         setMarkdownContent(convertToMarkdown(apiData.blocks));
//       });
//     }
//   }, [apiData]);

//   const convertToMarkdown = (blocks) => {
//     return blocks
//       .map((block) => {
//         switch (block.type) {
//           case "paragraph":
//             return `${block.data.text}\n`;
  
//           case "header":
//             return `${"#".repeat(block.data.level)} ${block.data.text}\n`;
  
//           case "list":
//             return block.data.items.map((item) => `- ${item}`).join("\n");
  
//           case "quote":
//             return `> ${block.data.text}\n`;
  
//           case "code":
//             return `\`\`\`\n${block.data.code}\n\`\`\``;
  
//           // Bold, Italic, Bold-Italic Text
//           case "bold":
//             return `**${block.data.text}**\n`;
  
//           case "italic":
//             return `*${block.data.text}*\n`;
  
//           case "bold-italic":
//             return `***${block.data.text}***\n`;
  
//           default:
//             return "";
//         }
//       })
//       .join("\n");
//   };
  

//   return (
//     <div className="relative top-2 left-12">
//       <p className="relative mt-2 mb-9">
//         <Link href="/">
//           <span className="text-[#A1A1A1] text-xs">Home</span>
//         </Link>
//         <span className="text-gray-400 mx-1">/</span>
//         <span className="text-black text-xs">{featName}</span>
//       </p>
//       <div className="flex items-start mt-6 gap-4 mb-5">
//         <Image src={notebook} alt="single blog post" height={40} width={40} className="rounded-md" />
//         <div className="flex flex-row">
//           <h1 className="text-xl font-semibold text-gray-800">{featName}</h1>
//           <Image src={tokenCoin} alt="single blog post" className="rounded-md h-5 w-5 ml-2 mt-1" />
//           <span className="text-gray-500 text-sm ml-1 mt-1">1 Token</span>
//         </div>
//       </div>
//       <div className="bg-[#FFF0CC] p-3 rounded w-80">
//         <p className="text-[#6E4D00] text-sm">You can edit generated content here.</p>
//       </div>
//       <div id="editorjs" className="mt-4 w-[50rem] max-h-[40rem] overflow-auto border p-4 rounded bg-white"></div>
//       <div className="mt-28"></div>
//     </div>
//   );
// };

// export default ProductContent;



"use client";
import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Link from "next/link";
import Image from "next/image";
import notebook from "@/../public/single-blog-post.png";
import tokenCoin from "@/../public/tokenCoin.png";
import { EDITOR_TOOLS } from "./editor";

const ProductContent = ({ apiData, featName, editorRef }) => {
  const [markdownContent, setMarkdownContent] = useState("");

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        placeholder: "Start writing here...",
        tools: EDITOR_TOOLS,
      });

      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current) {
        editorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && apiData) {
      editorRef.current.isReady.then(() => {
        editorRef.current.render(apiData);
      });
    }
  }, [apiData]);

  return (
    <div className="relative top-2 left-12">
      <p className="relative mt-2 mb-9">
        <Link href="/">
          <span className="text-[#A1A1A1] text-xs">Home</span>
        </Link>
        <span className="text-gray-400 mx-1">/</span>
        <span className="text-black text-xs">{featName}</span>
      </p>
      <div className="flex items-start mt-6 gap-4 mb-5">
        <Image src={notebook} alt="single blog post" height={40} width={40} className="rounded-md" />
        <div className="flex flex-row">
          <h1 className="text-xl font-semibold text-gray-800">{featName}</h1>
          <Image src={tokenCoin} alt="single blog post" className="rounded-md h-5 w-5 ml-2 mt-1" />
          <span className="text-gray-500 text-sm ml-1 mt-1">1 Token</span>
        </div>
      </div>
      <div className="bg-[#FFF0CC] p-3 rounded w-80">
        <p className="text-[#6E4D00] text-sm">You can edit generated content here.</p>
      </div>
      <div id="editorjs" className="mt-4 w-[50rem] max-h-[40rem] overflow-auto border p-4 rounded bg-white"></div>
      <div className="mt-28"></div>
    </div>
  );
};

export default ProductContent;