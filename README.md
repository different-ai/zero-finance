# hyprsqrl - Task Management designed for people w/ ADHD

hyprsqrl is a desktop application to manage your Obsidian tasks. It summarizes your tasks and displays them in a dashboard.

> **Note:** Currently, hyprsqrl only supports macOS and requires local building. No pre-built executables are provided.


<img width="1840" alt="Screenshot 2024-11-05 at 17 46 25" src="https://github.com/user-attachments/assets/fbd876cb-042f-4550-bc46-e0fed7acc678">


## Features

- 📊 Visual task dashboard
- 🔄 Real-time task tracking
- 🔗 Direct Obsidian integration
- 📝 Markdown-first approach

## Development


```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build application
pnpm build
```

### System Requirements

- macOS (Apple Silicon or Intel)
- Node.js 18+
- pnpm
- Obsidian installed locally



### Usage Instructions

1. **Development**
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

2. **Building**
```bash
# Build for production
pnpm build

# Package application
pnpm package
```

3. **Testing**
```bash
# Run tests
pnpm test

# Run linting
pnpm lint
```

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
