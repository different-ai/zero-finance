# hyprsqrl - AI task manager for Obsidian

hyprsqrl is a desktop application to manage your Obsidian tasks. It summarizes your tasks and displays them in a dashboard.

> **Note:** Currently, hyprsqrl only got tested macOS. if you're technical cloning the repo and following the usage instructions might be the quickest way.


<img width="1525" alt="Screenshot 2024-11-06 at 17 26 56" src="https://github.com/user-attachments/assets/9a77ae78-133b-4242-ba59-2c84d551f7d1">


## Features

- 📊 Visual task dashboard
 - overview of all your task
 - basic filtering, and sorting
 - "smart" suggestion (ai analyzes most recent tasks and makes best guess on what to tackle and why)
 - basic editor for quick edit (but also easy "open w/ obsidian option")
- 🔗 Direct Obsidian integration
- 📝 Markdown-first approach

## Installing binaries

[Pick the latest release and follow the instructions](https://github.com/different-ai/hypr-v0/tags)



## Usage Instructions (fastest)

_Only works with pnpm, and instructions are for macos_

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
 
```

### Development System Requirements

- macOS (Apple Silicon or Intel)
- Node.js 18+
- pnpm


### Key Features

**Task Dashboard**
- Visual overview of all tasks
- Filtering by status, tags, and dates
- Sorting options
- Direct links to Obsidian


### Architecture

The application follows a modular architecture:

```
packages/
  desktop/           # Main Electron application
    src/
      renderer/     # Frontend React components
      electron/     # Main process code
    electron/       # Electron configuration
```

### Next Steps

1. Add a proper CI/CD pipeline with GitHub Actions
2. Implement automated testing
3. Add user documentation
4. Set up proper versioning and release process
5. Create installer configurations for different platforms

Would you like me to elaborate on any of these aspects or provide more specific implementation details?
