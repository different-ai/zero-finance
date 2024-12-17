import { format } from 'date-fns'

export class ObsidianService {
  private vaultPath: string

  constructor(vaultPath: string) {
    this.vaultPath = vaultPath
  }

  async addTaskToDailyNote(task: string): Promise<void> {
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const filePath = `${this.vaultPath}/Daily Notes/${today}.md`
      
      // Read existing content or create new file
      let content = ''
      try {
        const result = await window.api.readMarkdownFile(filePath)
        content = result.content
      } catch (error) {
        // File doesn't exist yet, create with template
        content = `# ${format(new Date(), 'MMMM d, yyyy')}\n\n## Tasks\n`
      }

      // Add task to content
      const taskEntry = `- [ ] ${task}\n`
      if (content.includes('## Tasks')) {
        // Add under existing Tasks section
        content = content.replace('## Tasks\n', `## Tasks\n${taskEntry}`)
      } else {
        // Add new Tasks section
        content += `\n## Tasks\n${taskEntry}`
      }

      // Write back to file
      await window.api.writeMarkdownFile(filePath, content)
    } catch (error) {
      console.error('Error adding task to Obsidian:', error)
      throw new Error('Failed to add task to Obsidian daily note')
    }
  }
}