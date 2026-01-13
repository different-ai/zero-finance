---
name: skill-authoring
description: Create and register new OpenCode skills in this repo
compatibility: opencode
metadata:
  scope: repo
  format: skill-md
---

## What I do

- Define the steps and checks for adding a new OpenCode skill
- Ensure the skill is discoverable by the `skill` tool
- Validate naming, frontmatter, and placement rules

## When to use

- Adding a new reusable workflow or playbook as a skill
- Updating skill metadata to meet OpenCode discovery requirements

## Workflow

1. Pick a skill name that matches `^[a-z0-9]+(-[a-z0-9]+)*$` and is 1–64 chars.
2. Create `.opencode/skill/<name>/SKILL.md` and ensure the folder matches the name.
3. Add YAML frontmatter with `name` and `description` (optional: `license`, `compatibility`, `metadata`).
4. Write the body with clear sections (Purpose/What I do, When to use, Workflow, Completion criteria).
5. Confirm discovery: run OpenCode in the repo and check `skill` tool list.
6. If permissions block it, update `opencode.json` with `permission.skill` rules.

## Placement rules (from opencode.ai docs)

- Project: `.opencode/skill/<name>/SKILL.md`
- Project (Claude compatible): `.claude/skills/<name>/SKILL.md`
- Global: `~/.config/opencode/skill/<name>/SKILL.md`
- Global (Claude compatible): `~/.claude/skills/<name>/SKILL.md`

## Validation checklist

- `SKILL.md` is all caps and contains YAML frontmatter
- `name` matches folder name
- `description` is 1–1024 characters
- No duplicate skill names in the repo

## Example

```
---
name: git-release
description: Create consistent releases and changelogs
compatibility: opencode
---

## What I do

- Draft release notes from merged PRs
- Propose a version bump
- Provide a `gh release create` command
```

## Completion criteria

- Skill appears in `skill` tool list
- `skill({ name })` loads without errors
- Instructions are clear enough to execute without extra context
