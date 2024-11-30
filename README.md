# hyprsqrl

hyprsqrl is an app to eventually automate all mundane tasks away. It connects to your favorite apps including your screen and uses ai agents to automate tasks away.

<img width="1525" alt="Screenshot 2024-11-06 at 17 26 56" src="https://github.com/user-attachments/assets/9a77ae78-133b-4242-ba59-2c84d551f7d1">

## Philosophy

hypsqrl is built on the notion of **eventually invisible softare** it is meant to be less and less present in your life if it does its job well. It will take a while to get there but we believe the best productivity app is the one you do not need spend time on.

## Integrations

- [x] Obsidian
- [ ] [Screenpipe]([https://githb](https://screenpi.pe/)) for your screen <- working on this.
- [ ] Your emails
- [ ] Github
- [ ] Linear
- [ ] Telegram
- [ ] Slack


## Features

- 📊 Task Dashboard
- 🔗 Direct Obsidian integration
- 📝 Markdown-first approach
- Automation AI agents (in progress)

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

