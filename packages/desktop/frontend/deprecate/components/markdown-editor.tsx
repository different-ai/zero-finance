import React, { useState, useEffect } from 'react'
import type { MarkdownContent } from '@/renderer/types'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'
import Highlight from '@tiptap/extension-highlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Link from '@tiptap/extension-link'
import { Markdown } from 'tiptap-markdown'
import { useEditorStore } from '@/renderer/stores/editor-store'

interface MarkdownEditorProps {
  onSave?: (content: string) => void
}

export function MarkdownEditor({ onSave }: MarkdownEditorProps) {
  const [isSaving, setIsSaving] = useState(false)
  const { activeFile, updateContent } = useEditorStore()

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus-visible:outline-none h-full min-h-[400px] text-foreground',
      },
    },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: false,
      }),
      Highlight,
      CharacterCount.configure({
        limit: 20000,
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose pl-2',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex items-start gap-2 my-0.5',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary hover:underline cursor-pointer',
        },
      }),
      Markdown.configure({
        html: false,
        breaks: true,
        transformPastedText: true,
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
    ],
    content: activeFile?.content.content || '',
    onUpdate: ({ editor }) => {
      setIsSaving(true)
      const markdown = editor.storage.markdown.getMarkdown()
      updateContent(markdown)
      if (onSave) {
        onSave(markdown)
      }
      setIsSaving(false)
    },
  })

  useEffect(() => {
    if (activeFile && editor) {
      editor.commands.setContent(activeFile.content.content, false, {
        preserveWhitespace: true,
      })
    }
  }, [activeFile, editor])

  if (!activeFile) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a markdown file to edit
      </div>
    )
  }

  const fileName = activeFile.path.split('/').pop()?.replace('.md', '')

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{fileName}</h2>
            {isSaving && (
              <span className="text-sm text-muted-foreground">Saving...</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto p-4">
          <style>{`
            .ProseMirror {
              height: 100%;
              min-height: 100%;
              > * + * {
                margin-top: 0.75em;
              }
              
              ul[data-type="taskList"] {
                list-style: none;
                padding: 0;
                
                li {
                  display: flex;
                  align-items: flex-start;
                  gap: 0.5rem;
                  margin: 0;
                  padding: 0.2rem 0;
                  
                  > label {
                    margin: 0;
                    user-select: none;
                  }
                  
                  > div {
                    margin: 0;
                    flex: 1;
                    > p {
                      display: inline;
                      margin: 0;
                    }
                  }
                }
              }
            }
          `}</style>
          <EditorContent editor={editor} className="h-full" />
        </div>
      </div>
    </div>
  )
} 