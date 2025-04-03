# GitHub MCP Tools for Repository Management

## What We Learned

When working with the different-ai/hypr-v0 repository, the GitHub MCP tools offer powerful capabilities:

1. Repository information gathering:
   - `mcp_github_get_file_contents` to inspect files without local checkout
   - `mcp_github_list_commits` to view recent changes
   - `mcp_github_list_issues` to track open issues
   - `mcp_github_list_pull_requests` to monitor pending changes

2. Code contribution workflows:
   - `mcp_github_create_branch` to start new feature branches
   - `mcp_github_push_files` for bulk file updates in a single commit
   - `mcp_github_create_pull_request` to submit changes for review
   - `mcp_github_create_or_update_file` for simple single-file changes

3. Issue management:
   - `mcp_github_create_issue` to report bugs or feature requests
   - `mcp_github_get_issue` to get detailed issue information
   - `mcp_github_update_issue` to modify existing issues
   - `mcp_github_add_issue_comment` to contribute to discussions

## Effective Workflows

The most efficient patterns for repository interaction are:

1. For investigating repository state:
   ```
   // Get information about current issues
   const issues = await mcp_github_list_issues({
     owner: "different-ai",
     repo: "hypr-v0",
     state: "open"
   });
   
   // Examine file content in the repo
   const fileContent = await mcp_github_get_file_contents({
     owner: "different-ai",
     repo: "hypr-v0",
     path: "package.json"
   });
   ```

2. For making contributions:
   ```
   // Create a new feature branch
   await mcp_github_create_branch({
     owner: "different-ai",
     repo: "hypr-v0",
     branch: "feature/new-component",
   });
   
   // Push multiple files in a single commit
   await mcp_github_push_files({
     owner: "different-ai",
     repo: "hypr-v0",
     branch: "feature/new-component",
     message: "[Cursor] Add new component with tests",
     files: [
       {
         path: "app/components/new-component.tsx",
         content: "// Component code"
       },
       {
         path: "app/components/new-component.test.tsx",
         content: "// Test code"
       }
     ]
   });
   
   // Create a pull request
   await mcp_github_create_pull_request({
     owner: "different-ai",
     repo: "hypr-v0",
     title: "[Cursor] Add new component",
     head: "feature/new-component",
     base: "main",
     body: "This PR adds a new component with tests."
   });
   ```

## Best Practices

When working with GitHub MCP tools:

1. Always include "[Cursor]" prefix in commit messages and PR titles for clarity
2. Create feature branches with descriptive names (feature/component-name)
3. Group related file changes into single commits with clear messages
4. Include comprehensive PR descriptions explaining the changes
5. For complex changes, break them down into multiple smaller PRs
6. Check existing issues before creating new ones to avoid duplicates
7. Use comments to document process decisions in issues and PRs 