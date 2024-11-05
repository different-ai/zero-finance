
export interface Task {
  id: string;
  title: string;
  tags: string[];
  completed: boolean;
  filePath: string;
  line?: number;
  context?: string;
  obsidianUrl?: string;
  indentationLevel: number;
  stats: {
    created: string;
    modified: string;
    accessed: string;
  };
}

export function generateObsidianUrl(vaultName: string, filePath: string, line?: number): string {
  const cleanVaultName = vaultName.replace(/[^a-zA-Z0-9]/g, '');
  
  const pathParts = filePath.split('/');
  const fileName = pathParts.pop() || '';
  
  const encodedPath = encodeURIComponent(fileName);
  const lineRef = line ? `&line=${line}` : '';
  console.log('encodedPath', encodedPath);
  // print vault name
  console.log('vaultName', cleanVaultName);

  
  return `obsidian://open?vault=${cleanVaultName}&file=${encodedPath}${lineRef}`;
}

export function parseTasksFromMarkdown(
  content: { 
    content: string; 
    frontMatter: any; 
    stats: { created: string; modified: string; accessed: string; }
  }, 
  filePath: string, 
  vaultName?: string
): Task[] {
  const tasks: Task[] = [];
  const lines = content.content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const taskMatch = line.match(/^([ \t]*)-\s*\[([ xX])\]\s*(.+)$/);
    
    if (taskMatch) {
      const [fullMatch, indent, checkmark, taskContent] = taskMatch;
      const completed = checkmark.toLowerCase() === 'x';
      const title = taskContent.trim();
      
      const tags = [...title.matchAll(/#[a-zA-Z0-9-_]+/g)]
        .map(tag => tag[0])
        .filter(Boolean);
      
      const contextStart = Math.max(0, i - 2);
      const contextEnd = Math.min(lines.length, i + 3);
      const context = lines.slice(contextStart, contextEnd).join('\n');

      const lineNumber = i + 1;
      const obsidianUrl = vaultName 
        ? generateObsidianUrl(vaultName, filePath, lineNumber) 
        : undefined;

      tasks.push({
        id: `${filePath}:${lineNumber}`,
        title,
        tags,
        completed,
        filePath,
        line: lineNumber,
        context,
        obsidianUrl,
        indentationLevel: getIndentationLevel(indent),
        stats: content.stats
      });
    }
  }
  
  return tasks;
}

// Add this new function to handle recursive file scanning
export async function getAllMarkdownFiles(vaultPath: string): Promise<string[]> {
  const allFiles: string[] = [];
  
  async function scanDirectory(dirPath: string) {
    const files = await window.api.listMarkdownFiles(dirPath);
    
    for (const file of files) {
      const fullPath = `${dirPath}/${file.name}`;
      
      if (file.isDirectory) {
        await scanDirectory(fullPath);
      } else if (file.name.endsWith('.md')) {
        allFiles.push(fullPath);
      }
    }
  }
  
  await scanDirectory(vaultPath);
  console.log('allFiles', allFiles);
  return allFiles;
}

// Update the existing functions to use the new recursive file scanning
export async function getAllTasks(vaultPath: string): Promise<Task[]> {
  console.log('Getting all tasks from vault:', vaultPath);
  const allTasks: Task[] = [];
  const vaultName = vaultPath.split('/').pop()?.replace('.md', '');
  
  try {
    console.log('Scanning for markdown files...');
    const markdownFiles = await getAllMarkdownFiles(vaultPath);
    console.log('Found markdown files:', markdownFiles.length);
    
    for (const filePath of markdownFiles) {
      console.log('Processing file:', filePath);
      const content = await window.api.readMarkdownFile(filePath);
      const tasks = parseTasksFromMarkdown(content, filePath, vaultName);
      console.log('Found tasks in file:', tasks.length);
      allTasks.push(...tasks);
    }
    
    console.log('Total tasks found:', allTasks.length);
    return allTasks;
  } catch (error) {
    console.error('Failed to get all tasks:', error);
    throw error;
  }
}

// Add this helper function for indentation
function getIndentationLevel(indent: string): number {
  return (indent.match(/\s/g) || []).length;
}

// Update isTaskWithinDateRange to use file stats
export function isTaskWithinDateRange(task: Task, daysAgo: number): boolean {
  const taskDate = new Date(task.stats.modified);
  return isDateWithinRange(taskDate, daysAgo);
}

// Helper function to check if a date is within range
function isDateWithinRange(date: Date, daysAgo: number): boolean {
  if (isNaN(date.getTime())) return false; // Invalid date
  
  const now = new Date();
  const cutoff = new Date(now.setDate(now.getDate() - daysAgo));
  
  return date >= cutoff;
} 