import { create } from 'zustand'
import type { MarkdownContent } from '../legacy/types'

interface EditorState {
  activeFile: {
    path: string
    content: MarkdownContent
  } | null
  setActiveFile: (file: { path: string; content: MarkdownContent } | null) => void
  updateContent: (content: string) => void
  openFile: (path: string) => Promise<void>
}

export const useEditorStore = create<EditorState>((set, get) => ({
  activeFile: null,
  setActiveFile: (file) => set({ activeFile: file }),
  updateContent: (content) => 
    set((state) => ({
      activeFile: state.activeFile 
        ? {
            ...state.activeFile,
            content: { 
              content,
              frontMatter: state.activeFile.content.frontMatter 
            }
          }
        : null
    })),
  openFile: async (path: string) => {
    try {
      const content = await window.api.readMarkdownFile(path)
      set({ 
        activeFile: {
          path,
          content: {
            content: content.content,
            frontMatter: content.frontMatter || {}
          }
        }
      })
    } catch (error) {
      console.error('Failed to open file:', error)
    }
  }
}))      