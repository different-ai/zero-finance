---
name: skill-creator
description: Create new OpenCode skills with valid SKILL.md frontmatter.
compatibility: opencode
---

## Purpose

Create well-formed OpenCode skills that load correctly and follow naming rules.

## When to Use

Use this skill when you need to add a new `.opencode/skill/<name>/SKILL.md` file
or fix an existing skill definition.

## Workflow

1. Choose a skill name that matches the directory name and the regex
   `^[a-z0-9]+(-[a-z0-9]+)*$`.
2. Add YAML frontmatter with `name` and `description`.
3. Keep `description` between 1–1024 characters.
4. Add clear sections for purpose, usage, and workflow.
5. Verify the skill is discoverable via the `skill` tool.

## Completion Criteria

- The skill loads without errors.
- Frontmatter fields are valid and minimal.
- Content explains when and how to use the skill.
