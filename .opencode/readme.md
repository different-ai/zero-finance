# 0 Finance Outreach System

This document explains how to use the outreach automation system in 0 Finance.

## @setup-workspace

The `@setup-workspace` command initializes the outreach system by loading configuration from your Notion "MCP Skills" page. This should be run once after cloning the repository or when configuration changes.

### Usage

```
/setup-workspace
```

This command:

- Loads outreach configuration from Notion
- Sets up the workspace for automated outreach operations
- Should be run before using other outreach tools

## @OutreachPipeline

The `@OutreachPipeline` is a comprehensive outreach automation system that handles the full outreach workflow. This subagent should only be called manually by the user.

### Usage

```
/OutreachPipeline
```

This command:

- Manages the complete outreach pipeline
- Handles lead generation, messaging, and follow-up
- Requires proper workspace setup before use

## Workflow

1. First, run `@setup-workspace` to initialize the system
2. Then use `@OutreachPipeline` for automated outreach operations
3. Monitor and adjust as needed

## Important Notes

- Always run `@setup-workspace` before using outreach tools
- The OutreachPipeline is designed for manual execution only
- Configuration is loaded from the Notion "MCP Skills" page
