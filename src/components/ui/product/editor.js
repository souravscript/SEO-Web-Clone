
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


export const EDITOR_TOOLS = {
    code: Code,
    header: {
      class: Header,
      shortcut: "CMD+H",
      inlineToolbar: true,
      config: {
        placeholder: "Enter a Header",
        levels: [2, 3, 4],
        defaultLevel: 2,
      },
    },
    paragraph: {
      class: Paragraph,
      inlineToolbar: true,
    },
    checklist: CheckList,
    inlineCode: InlineCode,
    table: Table,
    list: List,
    quote: Quote,
    delimiter: Delimiter,
  };