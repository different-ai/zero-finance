---
name: skill-reinforcement
description: Always and Automatically improve skills after each use by capturing learnings and anti-patterns
license: MIT
compatibility: opencode
metadata:
  audience: ai-agents
  workflow: meta-learning
  trigger: after-any-skill-use
---

## What I Do

After ANY skill is used, this meta-skill triggers to:

1. Analyze what worked and what didn't
2. Identify new patterns or shortcuts discovered
3. Update the skill file with learnings
4. Prevent knowledge loss between sessions

**Relationship with `self-improve`:**

- This skill (`skill-reinforcement`) = **WHEN** to update (post-use triggers)
- The `self-improve` skill = **HOW** to update (templates, structures, decision trees)

## When to Trigger

**Invoke this skill automatically when:**

- Any skill from `.opencode/skill/*/SKILL.md` completes
- A workflow succeeds or fails in a notable way
- New shortcuts or anti-patterns are discovered
- Token usage could be reduced with better patterns
- API behavior differs from documentation
- Commands fail and I find the fix
- User confirms something works
- I do the same task twice (should become a skill/tool)

## Reinforcement Process

### Step 1: Capture the Context

After using a skill, note:

```
- Skill used: [skill-name]
- Task: [what was being done]
- Outcome: [success/partial/failure]
- Token cost: [high/medium/low]
- Time taken: [fast/normal/slow]
```

### Step 2: Identify Learnings

Ask these questions:

1. **What took longer than expected?** → Document the fix
2. **What failed unexpectedly?** → Add to "Common Issues"
3. **What shortcut was discovered?** → Add to "Token Saving Tips"
4. **What assumption was wrong?** → Correct in documentation
5. **What worked better than documented?** → Update the workflow

### Step 3: Categorize the Learning

| Category          | Where to Add               | Example                      |
| ----------------- | -------------------------- | ---------------------------- |
| New shortcut      | "Token Saving Tips"        | OTP visible in email preview |
| Failure mode      | "Common Issues"            | Popup blocker breaks flow    |
| Better pattern    | Main workflow              | Check login state first      |
| Anti-pattern      | "Anti-Patterns to Avoid"   | Don't snapshot spam          |
| Environment quirk | "Prerequisites" or "Notes" | Session persists             |

### Step 4: Update the Skill File

```bash
# Read current skill
cat .opencode/skill/[skill-name]/SKILL.md

# Edit to add learning in appropriate section
# Use the Edit tool to append or modify
```

### Step 5: Validate the Update

Ensure updates are:

- **Actionable** - Not vague observations
- **Specific** - Include exact commands/patterns
- **Formatted** - Match existing style
- **Non-redundant** - Don't duplicate existing content

## Learning Templates

### For New Shortcuts

```markdown
### [Shortcut Name]

**Discovery**: [How it was found]
**Before**: [Old approach]
**After**: [New approach]
**Savings**: [Token/time reduction]
```

### For Failure Modes

```markdown
| Issue  | Symptom        | Fix              |
| ------ | -------------- | ---------------- |
| [Name] | [What you see] | [How to resolve] |
```

### For Anti-Patterns

````markdown
### Don't: [Bad Pattern Name]

```javascript
// BAD - [explanation]
[bad code]
```
````

### Do: [Good Pattern Name]

```javascript
// GOOD - [explanation]
[good code]
```

````

### For Workflow Improvements

```markdown
## Updated: [Section Name]

[New content that replaces or augments existing]

> **Note**: Updated [date] after discovering [context]
````

## Real Examples

### Example 1: Session Persistence Discovery

**Context**: Testing staging branch, went through full login flow
**Learning**: Chrome MCP persists sessions - was already logged in
**Action**: Added "Session Persistence is Your Friend" section with check-first pattern

### Example 2: OTP Extraction Optimization

**Context**: Opened email, waited for load, extracted OTP
**Learning**: OTP visible in Gmail list preview without opening email
**Action**: Updated OTP section with faster "search + list preview" method

### Example 3: Deployment URL Pattern

**Context**: Manually constructed URL, got it wrong
**Learning**: Can extract URL directly from Vercel bot's PR comment
**Action**: Added `gh pr view` command to get URL automatically

## Skill File Structure Convention

Every skill should have these sections (add if missing):

```markdown
## What I Do

[Core purpose]

## Prerequisites

[Requirements]

## Workflow

[Main steps]

## Common Issues

[Failure modes and fixes]

## Token Saving Tips

[Efficiency patterns]

## Anti-Patterns to Avoid

[What NOT to do]

## Real Examples

[Actual usage examples]

## Learnings Log

[Append-only log of discoveries - optional]
```

## Integration with Other Skills

When reinforcing a skill, check if learnings apply to related skills:

| Skill               | Related Skills                  |
| ------------------- | ------------------------------- |
| test-staging-branch | Any Chrome MCP skill            |
| skill-reinforcement | All skills (meta)               |
| self-improve        | skill-reinforcement (companion) |
| chrome-devtools-mcp | test-staging-branch, gmail      |
| safe-infrastructure | new-vault-implementation        |

Cross-pollinate learnings when applicable.

### Deciding What to Create

If reinforcement reveals a need for new capability, use the `self-improve` skill's decision tree:

```
Need to extend capabilities?
│
├─ Just need docs/commands? → SKILL
├─ Need specialized AI persona? → AGENT
├─ Need event hooks? → PLUGIN
├─ Need callable function? → TOOL
└─ Need external integration? → MCP SERVER
```

## Automation Hooks

### Post-Skill Trigger

After completing any skill, automatically ask:

1. "Did anything unexpected happen?"
2. "Was there a faster way to do this?"
3. "What would I do differently next time?"

If answers exist, invoke skill-reinforcement.

### Periodic Review

Every ~10 skill uses, review:

- Most frequently used skills (prioritize improvements)
- Skills with most "Common Issues" (need better documentation)
- Skills with outdated information (need refresh)

## Meta: Reinforcing This Skill

This skill should also improve itself. Track:

- How often it triggers
- Quality of captured learnings
- Whether skills actually improve over time
- Time cost of reinforcement vs value gained

## Quick Reinforcement Checklist

```
[ ] Skill completed
[ ] Outcome noted (success/fail/partial)
[ ] Any surprises? → Document
[ ] Any shortcuts found? → Add to tips
[ ] Any failures? → Add to issues
[ ] Could be faster? → Add anti-pattern
[ ] Update skill file
[ ] Validate formatting
[ ] Done
```

## Immediate Update Rule

**UPDATE IMMEDIATELY** - Don't wait until end of conversation.

When any of these happen, stop and update the relevant skill:

1. API format is wrong (like `-d` vs `-F` for curl)
2. Commands fail and I find the fix
3. User confirms something works
4. I discover a better/faster way
5. Something is missing from docs

Example:

```
❌ "I'll note this for later"
✅ *immediately edits skill file*
```
