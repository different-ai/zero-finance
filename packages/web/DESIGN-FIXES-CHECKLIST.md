# Design System Color Fix Checklist

## Quick Find & Replace Commands

Execute these in order across the entire `/packages/web/src` directory:

### 1. Remove Tailwind Default Blues

```bash
# Replace blue-50 → white with border
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/bg-blue-50/bg-white border border-\[#101010\]\/10/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/bg-blue-100/bg-\[#F7F7F2\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/bg-blue-200/bg-\[#F6F5EF\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/bg-blue-500/bg-\[#1B29FF\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/bg-blue-600/bg-\[#1B29FF\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/bg-blue-700/bg-\[#1420CC\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/hover:bg-blue-500/hover:bg-\[#1420CC\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/hover:bg-blue-600/hover:bg-\[#1420CC\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/hover:bg-blue-700/hover:bg-\[#1420CC\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/text-blue-500/text-\[#1B29FF\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/text-blue-600/text-\[#1B29FF\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/text-blue-700/text-\[#1420CC\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/text-blue-900/text-\[#101010\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/border-blue-100/border-\[#101010\]\/10/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/border-blue-200/border-\[#101010\]\/10/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/border-blue-300/border-\[#101010\]\/10/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/border-blue-500/border-\[#1B29FF\]/g'
```

### 2. Remove All Green (Replace with Brand Blue for Positive States)

```bash
# Green backgrounds → cream/white
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/bg-green-50/bg-\[#F6F5EF\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/bg-green-100/bg-\[#F7F7F2\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/bg-green-500/bg-\[#1B29FF\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/bg-green-600/bg-\[#1B29FF\]/g'

# Green text → brand blue for positive
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/text-green-500/text-\[#1B29FF\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/text-green-600/text-\[#1B29FF\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/text-green-700/text-\[#1B29FF\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/text-green-800/text-\[#101010\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/text-green-900/text-\[#101010\]/g'

# Green borders
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/border-green-200/border-\[#101010\]\/10/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/border-green-500/border-\[#1B29FF\]/g'

# Specific green earnings text
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/text-\[#22C55E\]/text-\[#1B29FF\]/g'
```

### 3. Fix Primary/Secondary References

```bash
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/text-primary/text-\[#101010\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/bg-primary/bg-\[#1B29FF\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/border-primary/border-\[#1B29FF\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/text-secondary/text-\[#101010\]\/70/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/text-muted-foreground/text-\[#101010\]\/60/g'
```

### 4. Fix Gray/Neutral Colors

```bash
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/bg-gray-50/bg-\[#F7F7F2\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/bg-gray-100/bg-\[#F6F5EF\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/bg-gray-200/bg-white/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/text-gray-400/text-\[#101010\]\/40/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/text-gray-500/text-\[#101010\]\/50/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/text-gray-600/text-\[#101010\]\/60/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/text-gray-700/text-\[#101010\]\/70/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/text-gray-800/text-\[#101010\]\/80/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/text-gray-900/text-\[#101010\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/border-gray-200/border-\[#101010\]\/10/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/border-gray-300/border-\[#101010\]\/10/g'
```

### 5. Fix Hover States

```bash
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/hover:bg-\[#1B29FF\]\/90/hover:bg-\[#1420CC\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/hover:text-\[#1B29FF\]\/90/hover:text-\[#1420CC\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/hover:bg-gray-50/hover:bg-\[#F7F7F2\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/hover:bg-gray-100/hover:bg-\[#F6F5EF\]/g'
```

### 6. Fix Orange/Yellow/Amber

```bash
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/bg-orange-50/bg-\[#FFF8E6\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/bg-amber-50/bg-\[#FFF8E6\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/text-amber-600/text-\[#FFA500\]/g'
find . -name "*.tsx" -o -name "*.jsx" | xargs sed -i '' 's/border-amber-200/border-\[#FFA500\]\/20/g'
```

## Manual Checks Required

### 1. Component-Specific Fixes

#### Sidebar (`/components/layout/sidebar.tsx`)

- [ ] Logo text should be single color #101010
- [ ] Active state background should be #1B29FF
- [ ] Remove green status dot, use #1B29FF

#### Dashboard Cards

- [ ] All cards should be white with border-[#101010]/10
- [ ] Remove any box-shadow classes
- [ ] KPI numbers in #101010, positive deltas in #1B29FF

#### Buttons

- [ ] Primary: bg-[#1B29FF] hover:bg-[#1420CC] text-white
- [ ] Secondary: border border-[#101010]/10 hover:bg-[#F7F7F2]
- [ ] Destructive: border-[#FF4444]/20 text-[#FF4444]

#### Tables

- [ ] Headers: bg-[#F7F7F2] with border-[#101010]/10
- [ ] Row separators: border-[#101010]/5
- [ ] Ensure tabular-nums on all number columns

### 2. Background Hierarchy

- [ ] Page wrapper: bg-[#F7F7F2]
- [ ] Cards/Content: bg-white
- [ ] Info sections: bg-[#F6F5EF]
- [ ] No other background colors

### 3. Typography

- [ ] Labels: uppercase text-[12px] tracking-[0.14em] text-[#101010]/60
- [ ] Headlines: font-serif with specific line-height
- [ ] Numbers: tabular-nums

### 4. Icons

- [ ] Default: text-[#101010]/60
- [ ] Positive/Action: text-[#1B29FF]
- [ ] Error only: text-[#FF4444]

## Validation Script

Run this to check for any remaining violations:

```bash
# Check for remaining green
grep -r "green-\|text-green\|bg-green" ./src --include="*.tsx" --include="*.jsx"

# Check for remaining blue tailwind classes
grep -r "blue-[0-9]" ./src --include="*.tsx" --include="*.jsx"

# Check for gray backgrounds (should only be specific hex)
grep -r "bg-gray-" ./src --include="*.tsx" --include="*.jsx"

# Check for shadows (should be minimal/none)
grep -r "shadow-" ./src --include="*.tsx" --include="*.jsx"
```

## Final Acceptance Criteria

- [ ] No green anywhere (except error states if needed)
- [ ] Only 3 backgrounds: white, #F7F7F2, #F6F5EF
- [ ] All actions are #1B29FF → #1420CC on hover
- [ ] All borders are 1px at #101010/10
- [ ] All positive numbers use #1B29FF (not green)
- [ ] All labels use uppercase at 12px with #101010/60
