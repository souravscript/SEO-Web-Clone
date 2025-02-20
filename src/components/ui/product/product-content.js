"use client";
import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import 'highlight.js/styles/github.css';
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

export function markdownToEditorJS(markdown) {
  const blocks = [];
  const lines = markdown.split('\n');
  let currentListItems = [];
  let inList = false;

  // Regular expression for image detection
  const imageRegex = /!\[(.*?)\]\((.*?)\)|(?:^|\s)((https?:\/\/\S+\.(?:png|jpg|jpeg|gif|bmp|webp)(?:\?[^\s]+)?))(?:\s|$)/gi;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Skip empty lines
    if (!line) continue;

    // Image detection (both markdown and direct URL styles)
    const imageMatches = [...line.matchAll(imageRegex)];
    if (imageMatches.length > 0) {
      imageMatches.forEach(match => {
        // Markdown style: ![alt](url)
        if (match[2]) {
          blocks.push({
            type: 'image',
            data: {
              caption: match[1] || '',
              url: match[2],
              withBorder: false,
              withBackground: false,
              stretched: false
            }
          });
        }
        // Direct URL style
        else if (match[3]) {
          blocks.push({
            type: 'image',
            data: {
              caption: '',
              url: match[3],
              withBorder: false,
              withBackground: false,
              stretched: false
            }
          });
        }
      });

      // Remove image URLs from the line for further processing
      line = line.replace(imageRegex, '').trim();

      // If line is empty after removing images, continue to next line
      if (!line) continue;
    }

    // Headers
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      blocks.push({
        type: 'header',
        data: {
          text: headerMatch[2],
          level: headerMatch[1].length
        }
      });
      continue;
    }

    // Lists
    const listItemMatch = line.match(/^[-*+]\s+(.+)$/);
    if (listItemMatch) {
      if (!inList) {
        inList = true;
        currentListItems = [];
      }
      currentListItems.push(listItemMatch[1]);

      // If next line is not a list item or it's the last line, add the list block
      if (!lines[i + 1]?.trim().match(/^[-*+]\s+/) || i === lines.length - 1) {
        blocks.push({
          type: 'list',
          data: {
            style: 'unordered',
            items: currentListItems
          }
        });
        inList = false;
        currentListItems = [];
      }
      continue;
    }

    // Bold text
    const boldRegex = /\*\*(.*?)\*\*/g;
    let paragraphText = line.replace(boldRegex, '<b>$1</b>');

    // Italic text
    const italicRegex = /\*(.*?)\*/g;
    paragraphText = paragraphText.replace(italicRegex, '<i>$1</i>');

    // Regular paragraph (only if not empty after processing)
    if (paragraphText.trim()) {
      blocks.push({
        type: 'paragraph',
        data: {
          text: paragraphText
        }
      });
    }
  }

  return { blocks };
}



const ProductContent = ({ apiData, featName, editorRef, setFinalContent }) => {
  const [markdownContent, setMarkdownContent] = useState("");

  useEffect(() => {
    // Add a guard to prevent multiple initializations
    if (editorRef.current) {
      return;
    }

    // Initialize editor only if it hasn't been initialized
    const editor = new EditorJS({
      holder: "editorjs",
      placeholder: "Start writing here...",
      tools: EDITOR_TOOLS,
      onChange: async (api) => {
        const content = await api.saver.save();
        const markdown = convertToMarkdown(content.blocks);
        setMarkdownContent(markdown);
      },
      // Add an onReady callback to ensure proper initialization
      onReady: () => {
        console.log('Editor.js is ready to work!');
      }
    });

    editorRef.current = editor;

    // Cleanup function
    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        try {
          editorRef.current.destroy();
          editorRef.current = null;
        } catch (error) {
          console.error('Error destroying EditorJS:', error);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && apiData && apiData.blocks) {
      editorRef.current.isReady.then(async () => {
        try {
          // Clear existing content
          await editorRef.current.clear();

          // Render new data
          await editorRef.current.render(apiData);

          // Convert blocks to markdown for state update
          const markdown = convertToMarkdown(apiData.blocks);
          setMarkdownContent(markdown);
        } catch (error) {
          console.error('Error rendering API data:', error);
        }
      });
    }
  }, [apiData]);

  useEffect(() => {
    setFinalContent(markdownContent);
  }, [markdownContent]);

  return (
    <div className="relative my-4">
      <div className="flex items-center justify-between bg-[#FFF0CC] p-4 rounded-t-lg border-b border-[#FFE5B4] w-[49rem]">
        <div className="flex items-center space-x-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#6E4D00]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span className="text-[#6E4D00] font-medium text-sm">
            Generated Content Editor
          </span>
        </div>
        {apiData && apiData.blocks && apiData.blocks.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">AI-Generated</span>
            <span className="px-2 py-1 bg-[#FFE5B4] text-[#6E4D00] rounded-full text-xs">
              1 Token Used
            </span>
          </div>
        )}
      </div>
      <div
        className="bg-white border border-gray-200 rounded-b-lg shadow-sm transition-all duration-300 ease-in-out 
        hover:shadow-md"
      >
        <div
          id="editorjs"
          className="p-6 mt-4 h-40 overflow-auto prose prose-sm 
          prose-headings:text-gray-800 
          prose-p:text-gray-700 
          prose-a:text-blue-600 
          prose-strong:text-gray-900"
        ></div>
      </div>
    </div>
  );
};

export default ProductContent;