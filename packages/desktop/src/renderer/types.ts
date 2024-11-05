export interface VaultConfig {
  path: string;
  isObsidian: boolean;
  lastOpened: string;
  showEditor: boolean;
}

export interface FileInfo {
  name: string;
  isDirectory: boolean;
  path: string;
}

export interface MarkdownContent {
  frontMatter: any;
  content: string;
} 