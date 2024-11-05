export interface VaultConfig {
  path: string;
  isObsidian: boolean;
  lastOpened: string;
  vaultName?: string;
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