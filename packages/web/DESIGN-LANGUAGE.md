# 0 Finance Design Language Reference

## Core Design Principles

### Visual Identity

- **Minimal, sophisticated, and premium** - Banking meets editorial design
- **High contrast** - Clear hierarchy through stark contrasts
- **Systematic spacing** - Consistent use of space creates rhythm
- **Typography-first** - Let type do the heavy lifting

## Color Palette

### Primary Colors

```css
/* Core Brand */
--primary-blue: #1b29ff; /* Electric blue - primary actions, links */
--primary-blue-hover: #1420cc; /* Darker blue for hover states */

/* Neutrals */
--black: #101010; /* Near black - primary text */
--white: #ffffff; /* Pure white */

/* Background Colors */
--bg-cream: #f7f7f2; /* Light cream - main background */
--bg-warm: #f6f5ef; /* Warm cream - section backgrounds */
```

### Semantic Colors

```css
/* Status Colors */
--success: #1b29ff; /* Using brand blue for positive */
--error: #ff4444; /* Red for negative/errors */
--warning: #f59e0b; /* Amber for warnings */

/* Text Colors */
--text-primary: #101010; /* Main text */
--text-secondary: #222; /* Slightly lighter text */
--text-muted: #101010/70; /* 70% opacity for muted text */
--text-light: #101010/60; /* 60% opacity for labels */
```

## Typography

### Font Families

```css
/* Serif for headlines and important numbers */
font-family: serif; /* System serif fallback */

/* Sans-serif for body text and UI */
font-family:
  system-ui,
  -apple-system,
  sans-serif;
```

### Type Scale

```css
/* Hero Headlines */
--text-hero-mobile: 36px;
--text-hero-tablet: 52px-64px;
--text-hero-desktop: 72px-88px;

/* Section Headlines */
--text-h2-mobile: 24px;
--text-h2-tablet: 30px;
--text-h2-desktop: 36px;

/* Body Text */
--text-body: 14px-16px;
--text-small: 12px-13px;
--text-tiny: 11px;

/* Special */
--text-large-numbers: 40px; /* For important metrics */
```

### Typography Patterns

```css
/* Uppercase Labels */
.label {
  text-transform: uppercase;
  letter-spacing: 0.14em-0.18em;
  font-size: 11px-12px;
  color: var(--text-light);
}

/* Serif Headlines */
.headline {
  font-family: serif;
  line-height: 0.96-1.1;
  letter-spacing: -0.01em to -0.015em;
}

/* Tabular Numbers */
.numbers {
  font-variant-numeric: tabular-nums;
}
```

## Spacing System

### Base Unit: 4px

```css
/* Spacing Scale */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

### Container Widths

```css
--container-max: 1200px; /* Main container */
--container-narrow: 800px; /* Text-heavy sections */
--container-wide: 1400px; /* Tables and wide content */
```

## Component Patterns

### Buttons

```jsx
/* Primary Button */
<Link className="inline-flex items-center px-6 py-3 text-[16px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors">
  Action →
</Link>

/* Secondary Button */
<Link className="inline-flex items-center text-[15px] text-[#101010] hover:text-[#1B29FF] underline decoration-[#101010]/30 underline-offset-[4px] hover:decoration-[#1B29FF] transition-colors">
  Secondary Action
</Link>

/* Ghost Button */
<Link className="inline-flex items-center px-6 py-3 text-[16px] font-medium text-white border-2 border-white hover:bg-white/10 rounded-md transition-colors">
  Ghost Action
</Link>
```

### Cards/Boxes

```jsx
/* Grid with 1px borders */
<div className="grid grid-cols-3 gap-px bg-[#101010]/10">
  <div className="bg-white p-6">Content</div>
  <div className="bg-white p-6">Content</div>
  <div className="bg-white p-6">Content</div>
</div>

/* Single bordered box */
<div className="border border-[#101010]/10 bg-white p-6">
  Content
</div>
```

### Section Headers

```jsx
<p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60">
  Section Label
</p>
<h2 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
  Section Headline
</h2>
<p className="mt-4 text-[16px] leading-[1.5] text-[#101010]/80 max-w-[65ch]">
  Section description text that provides context.
</p>
```

### Tables

```jsx
/* Table with sticky header and alternating sections */
<table className="w-full text-[13px]">
  <thead>
    <tr className="border-b border-[#101010]/10">
      <th className="text-left p-4 font-medium bg-[#F7F7F2] sticky left-0">
        Header
      </th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-[#101010]/5">
      <td className="p-4">Content</td>
    </tr>
  </tbody>
</table>
```

## Layout Patterns

### Hero Sections

- Large serif headlines with specific line heights (0.9-0.96)
- Uppercase label above headline
- Clear CTA buttons below
- Optional Three.js background for depth

### Content Sections

- Alternating backgrounds: white, `#F7F7F2`, `#F6F5EF`
- Border separators: `border-[#101010]/10`
- Consistent padding: `py-12 sm:py-16`
- Max-width containers for readability

### Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Tablet */
md: 768px   /* Small laptop */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

## Interaction Patterns

### Hover States

- Links: Color change to `#1B29FF`
- Buttons: Darker shade of current color
- Cards: Subtle shadow or border highlight
- Transition: `transition-colors` (150ms default)

### Focus States

- Use native browser focus or subtle blue outline
- Ensure keyboard navigation is clear

## Special Elements

### Numbers & Metrics

- Use tabular-nums for alignment
- Large numbers: 36px-40px font size
- Positive numbers: `#1B29FF` or green
- Negative numbers: `#FF4444` red
- Include units/labels in smaller, muted text

### Status Indicators

- Success: Check icon in `#1B29FF`
- Error: X icon in `#FF4444`
- Info: AlertCircle icon in `#101010/60`

### Bank Statement Aesthetic

- Monospace/tabular numbers
- Minimal borders (1px, 10% opacity)
- Uppercase labels for sections
- Right-aligned numbers
- Transaction-style listings

## Writing Style

### Headlines

- Short, punchy, and benefit-focused
- Use active voice
- Include specific numbers when possible
- Example: "Earn 8% on Your Startup's Savings"

### Body Copy

- Clear and concise
- Avoid jargon unless necessary
- Lead with benefits, follow with features
- Max line length: 65-75 characters

### CTAs

- Action-oriented with arrows →
- Primary: "Open Account →"
- Secondary: "Calculate Savings"
- Tertiary: "Learn More"

## Implementation Notes

### Tailwind Classes Priority

1. Use exact color values: `bg-[#1B29FF]` over `bg-blue-600`
2. Use exact spacing: `text-[16px]` over `text-base`
3. Use opacity modifiers: `text-[#101010]/70` for muted text
4. Prefer explicit over implicit: `leading-[1.5]` over `leading-relaxed`

### Performance Considerations

- Lazy load Three.js backgrounds
- Use system fonts to avoid font loading
- Optimize images and use next/image
- Keep animations subtle and CSS-based

### Accessibility

- Maintain WCAG AA contrast ratios
- Ensure all interactive elements are keyboard accessible
- Provide proper ARIA labels
- Use semantic HTML structure

## Examples in Practice

### Page Structure Template

```jsx
<div className="min-h-screen bg-[#F7F7F2]">
  {/* Hero */}
  <section className="bg-[#F6F5EF] border-b border-[#101010]/10 py-16">
    <div className="max-w-[1200px] mx-auto px-4">
      <p className="uppercase tracking-[0.18em] text-[12px] text-[#101010]/70">
        Label
      </p>
      <h1 className="mt-3 font-serif text-[48px] leading-[0.96] text-[#101010]">
        Headline
      </h1>
    </div>
  </section>

  {/* Content sections alternate backgrounds */}
  <section className="bg-white py-12">...</section>
  <section className="bg-[#F7F7F2] py-12">...</section>
</div>
```

This design language creates a sophisticated, trustworthy financial product aesthetic that balances modern minimalism with banking gravitas.
