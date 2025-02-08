"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import { useEffect, useState } from "react";
import { MenuBar } from "./MenuBar";
import { createAISuggestions, SlashCommands } from "./createAISuggestions";

interface JobDescriptionEditorProps {
  field: any;
}

export default function JobDescriptionEditor({
  field,
}: JobDescriptionEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Typography,
      SlashCommands.configure({
        suggestion: {
          char: '/',
          command: () => null, // Placeholder that will be updated
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] p-4 max-w-none dark:prose-invert",
      },
    },
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    content: field.value ? JSON.parse(field.value) : "",
    immediatelyRender: false,
  });

  // Initialize AI suggestions after editor is mounted
  useEffect(() => {
    if (editor && !editorInstance) {
      const aiSuggestions = createAISuggestions(editor);

      // Update the slash commands configuration
      const slashCommandsExtension = editor.extensionManager.extensions.find(
        extension => extension.name === 'slashCommands'
      );

      if (slashCommandsExtension) {
        slashCommandsExtension.configure({
          suggestion: aiSuggestions.suggestion
        });
      }

      setEditorInstance(editor);
    }
  }, [editor, editorInstance]);

  // Handle client-side mounting
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, []);

  // Handle external content updates
  useEffect(() => {
    if (editor && field.value && editor.getHTML() !== field.value) {
      editor.commands.setContent(JSON.parse(field.value));
    }
  }, [editor, field.value]);

  if (!isMounted) return null;

  return (
    <div className="w-full">
      <div className="border rounded-lg overflow-hidden bg-card">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
        <div className="p-2 text-sm text-muted-foreground">
          Type / followed by 2 or more characters for AI suggestions
        </div>
      </div>
    </div>
  );
}