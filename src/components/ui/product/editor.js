import EditorJS from "@editorjs/editorjs";
import remarkGfm from "remark-gfm";
import CheckList from "@editorjs/checklist";
import Code from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import Embed from "@editorjs/embed";
import InlineCode from "@editorjs/inline-code";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import Marker from "@editorjs/marker";
import LinkTool from "@editorjs/link";
import Warning from "@editorjs/warning";

export const EDITOR_TOOLS = {
  // Image tool with advanced configuration
  image: {
    class: ImageTool,
    config: {
      endpoints: {
        byFile: '/api/uploadFile', // Your upload endpoint
        byUrl: '/api/fetchUrl', // Your URL fetch endpoint
      },
      types: 'image/*', // Accepted file types
      captionPlaceholder: 'Add an image caption',
      buttonContent: 'Select an image',
      uploader: {
        uploadByFile(file) {
          // Custom file upload logic
          const formData = new FormData();
          formData.append('image', file);

          return fetch('/api/uploadFile', {
            method: 'POST',
            body: formData
          })
          .then(response => response.json())
          .then(result => {
            return {
              success: 1,
              file: {
                url: result.fileUrl
              }
            };
          })
          .catch(error => {
            console.error('Image upload failed:', error);
            return {
              success: 0,
              error: 'Image upload failed'
            };
          });
        },
        uploadByUrl(url) {
          // Custom URL upload logic
          return fetch('/api/fetchUrl', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
          })
          .then(response => response.json())
          .then(result => {
            return {
              success: 1,
              file: {
                url: result.fileUrl
              }
            };
          })
          .catch(error => {
            console.error('URL fetch failed:', error);
            return {
              success: 0,
              error: 'URL fetch failed'
            };
          });
        }
      }
    }
  },
  
  // Enhanced header tool
  header: {
    class: Header,
    inlineToolbar: ['link'],
    config: {
      placeholder: 'Enter a Header',
      levels: [1, 2, 3, 4],
      defaultLevel: 2
    },
    shortcut: 'CMD+H'
  },
  
  // Paragraph with more options
  paragraph: {
    class: Paragraph,
    inlineToolbar: [
      'marker', 
      'link', 
      'bold', 
      'italic', 
      'underline'
    ]
  },
  
  // List with ordered and unordered support
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: 'unordered'
    }
  },
  
  // Code block with language support
  code: {
    class: Code,
    config: {
      placeholder: 'Enter your code'
    }
  },
  
  // Embed tool for rich media
  embed: {
    class: Embed,
    config: {
      services: {
        youtube: true,
        coub: true,
        twitter: true,
        instagram: true
      }
    }
  },
  
  // Additional useful tools
  checklist: CheckList,
  quote: Quote,
  warning: {
    class: Warning,
    inlineToolbar: true,
    config: {
      titlePlaceholder: 'Title',
      messagePlaceholder: 'Message'
    }
  },
  marker: Marker,
  inlineCode: InlineCode,
  table: Table,
  delimiter: Delimiter,
  link: {
    class: LinkTool,
    config: {
      endpoint: '/api/fetchLinkMeta' // Your link metadata endpoint
    }
  }
};