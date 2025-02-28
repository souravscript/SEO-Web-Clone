"use client";
import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Link from "next/link";
import Image from "next/image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import 'highlight.js/styles/github.css';

import notebook from "@/../public/single-blog-post.png";
import tokenCoin from "@/../public/tokenCoin.png";
import { EDITOR_TOOLS } from "./editor";

const convertToMarkdown = (blocks) => {
  if (!blocks || !Array.isArray(blocks)) return "";

  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return block.data.text || "";

        case "header":
          return `${"#".repeat(block.data.level || 2)} ${block.data.text}\n`;

        case "list":
          return block.data.items
            ? block.data.items.map((item) => `- ${item}`).join("\n")
            : "";

        case "quote":
          return `> ${block.data.text}\n`;

        case "code":
          return block.data.code 
            ? `\`\`\`\n${block.data.code}\n\`\`\`` 
            : "";

        case "checklist":
          return block.data.items
            ? block.data.items
                .map((item) => `- [${item.checked ? 'x' : ' '}] ${item.text}`)
                .join("\n")
            : "";

        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n");
};

const ProductContent = ({ apiData, featName, editorRef }) => {
  const [markdownContent, setMarkdownContent] = useState("");

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        placeholder: "Start writing here...",
        tools: EDITOR_TOOLS,
        onChange: async (api) => {
          const content = await api.saver.save();
          const markdown = convertToMarkdown(content.blocks);
          setMarkdownContent(markdown);
        }
      });

      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current) {
        try {
          if (typeof editorRef.current.destroy === 'function') {
            editorRef.current.destroy();
          } else {
            console.warn('EditorJS destroy method not found');
          }
        } catch (error) {
          console.error('Error destroying EditorJS:', error);
        } finally {
          editorRef.current = null;
        }
      }
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && apiData) {
      editorRef.current.isReady.then(() => {
        editorRef.current.render(apiData);
        const markdown = convertToMarkdown(apiData.blocks);
        setMarkdownContent(markdown);
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
      
      {/* Markdown Preview
      <div className="mt-4 prose max-w-full">
        <Markdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeHighlight]}
          components={{
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <code 
                  className={`language-${match[1]} hljs`} 
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <code className="inline-code" {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {markdownContent}
        </Markdown>
      </div> */}
      <div className="mt-28"></div>
    </div>
  );
};

export default ProductContent;