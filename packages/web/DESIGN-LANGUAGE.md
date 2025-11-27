# Zero Finance Design Language

> **Philosophy**: Progressive disclosure. Banking-first experience with technical depth available on demand.

## Core Principles

### 1. **Abstraction-First UX**

Hide complexity. Show clarity.

- **Never expose** blockchain addresses, private keys, transaction hashes, or chain IDs in primary flows
- **Never mention** "Gnosis Safe", "EOA", "smart contract wallet", "private key recovery" unless user explicitly enters advanced mode
- **Always use** banking terminology: "account", "transfer", "balance", "routing number" instead of "wallet", "send tx", "token balance", "contract address"
- **Progressive disclosure**: Advanced users can access technical details via "Advanced" sections, developer tools, or settings panels

**Examples:**

- ✅ "Transfer $1,000 to Acme Inc." → ❌ "Send 1000 USDC to 0x742d..."
- ✅ "Account created" → ❌ "Safe deployed on Base"
- ✅ "Secure authentication" → ❌ "Embedded wallet with MPC key shares"
- ✅ "View transaction details" (shows Advanced toggle for hash/block) → ❌ "Tx: 0xabc...def"

### 2. **Three-Track Design System**

**Marketing/Landing** (Expressive)

- Large serif headlines, generous whitespace
- Gradient backgrounds, soft shadows
- Bright blue CTAs (`#1B29FF`)
- Emotional, aspirational messaging

**Dashboard/App** (Functional - Default)

- Compact sans-serif typography
- Clean white cards on `#F7F7F2` canvas
- Tight spacing, efficient layouts
- Clear, actionable content

**Technical/Developer** (Deep Dive - Advanced Mode)

- **Aesthetic**: Engineering Precision (Blueprint Style)
- **Background**: Consistent Light Theme (`#FFFFFF` / `#F7F7F2`)
- **Typography**: Monospace (`IBM Plex Mono`) for data density
- **Visuals**: Fine hairlines, measuring guides, coordinate annotations
- **Role**: Reveals structure via "Architectural" overlays without breaking the elegant banking atmosphere

### 3. **Bimodal Content Strategy**

**Philosophy:** Progressive disclosure for different audience types. Allow users to toggle between business-first and technical-first experiences while maintaining consistent visual design.

**Implementation:**

The bimodal system uses a React context provider (`BimodalProvider`) and hook (`useBimodal`) to manage content switching across the application.

```typescript
// Content structure
interface BimodalContent<T> {
  company: T;
  technical: T;
}

// Usage in components
const { isTechnical, toggle } = useBimodal();
const content = CONTENT[isTechnical ? 'technical' : 'company'];
```

**Key Components:**

- **BimodalProvider**: Wraps the app, manages state in `localStorage` (`zero-finance-bimodal-mode`)
- **useBimodal**: Hook to access current mode and toggle function
- **BimodalToggle**: UI component for switching modes (labeled "Experience")

**Content Guidelines:**

**Company Mode:**
- Banking-first language ("Business Savings Account", "High-Yield")
- Serif headlines for warmth and approachability
- Feature bullets emphasize safety, insurance, ease of use
- Example: "Insurance included — 100% coverage on all deposits"

**Technical Mode:**
- Protocol-first language ("PROTOCOL::TREASURY_AUTOMATION")
- Monospace typography for precision and technical feel
- Feature bullets emphasize architecture, audits, on-chain details
- Example: "Direct protocol interaction • Non-custodial architecture"

**Styling Patterns:**

```jsx
// Badge
<p className={`uppercase tracking-[0.14em] text-[12px] mb-3 ${
  isTechnical 
    ? 'font-mono text-[#1B29FF]' 
    : 'text-[#101010]/60'
}`}>
  {content.badge}
</p>

// Headline
<h1 className={`leading-[0.96] tracking-[-0.015em] text-[#101010] mb-6 ${
  isTechnical 
    ? 'font-mono text-[48px] sm:text-[56px] lg:text-[64px]' 
    : 'font-serif text-[56px] sm:text-[64px] lg:text-[72px]'
}`}>
  <span className="text-[#1B29FF]">{content.headline.highlight}</span>
  {content.headline.suffix}
</h1>

// Feature text
<span className={`text-[14px] text-[#101010]/70 ${
  isTechnical ? 'font-mono text-[13px]' : ''
}`}>
  {feature}
</span>
```

**Where to Use:**

- ✅ Landing page hero sections
- ✅ Signin/signup pages
- ✅ Feature comparison sections
- ✅ Marketing content with technical depth
- ❌ Dashboard/app (always functional, no toggle)
- ❌ Transactional flows (consistency required)

**Toggle Placement:**

Place the `BimodalToggle` in the header with the label "Experience":

```jsx
<div className="hidden md:flex items-center gap-3">
  <span className="text-[11px] text-[#101010]/60 uppercase tracking-wider">
    Experience
  </span>
  <BimodalToggle
    isTechnical={isTechnical}
    onToggle={toggle}
    showLabels={true}
  />
</div>
```

---

## Visual Identity

### Animated Backgrounds

**Mesh Gradient (Onboarding/Auth)**

- Component: `<GeneratedComponent />` from `@/app/(landing)/welcome-gradient`
- Colors: `['#668fff', '#1B29FF', 'rgba(246, 245, 239, 0)']`
- Use for: Welcome pages, authentication flows
- Speed: 0.2 for subtle movement

**Heatmap Gradient (Flyers/Print)**

- Component: `<FlyerGradient />` from `@/app/(landing)/flyer-gradient`
- Colors: `['#1B29FF', '#668fff', '#F6F5EF', 'rgba(246, 245, 239, 0.3)']`
- Use for: Flyers, print materials, promotional content
- Speed: 0.3 with 45° angle for dynamic feel

### Technical Identity (Structural Accent)

_Used strictly for Advanced/Developer views, Smart Contract interactions, and Technical Details._

**Core Aesthetic: Architectural Blueprint**
Integrating the precision of CAD into the elegance of modern banking. Instead of a black void, we use the "Blueprint" metaphor on our existing light canvas.

**Key Characteristics:**

- **Structure over Decoration**: Reveal the grid lines and alignment points that define the UI.
- **Monospace Elegance**: Use `IBM Plex Mono` for transactional data to suggest precision.
- **Brand Integration**: Use the Brand Blue (`#1B29FF`) for technical lines and grids instead of neon greens.
- **Subtle Dimensions**: Add "measurement" lines or coordinate markers (`[x:001]`) as subtle decorative elements in advanced cards.

**Visual Elements:**

- **Grid Overlays**: Faint, technical grids (`#1B29FF` at 5% opacity).
- **Crosshairs**: Corner markers on advanced cards.
- **Technical Labels**: Small, uppercase, monospace labels (`TX_HASH`, `BLOCK_ID`) in muted blue.

---

### Logo & Branding

**Logo Usage**

- **Image**: `/new-logo-bluer.png` (blue circular icon)
- **Format**: Icon + "finance" text in bold sans-serif
- **Text Color**: ALWAYS `#0050ff` to match logo icon color
- **Sizes**:
  - Mobile: 20×20px (`w-5 h-5`)
  - Desktop: 24×24px (`w-6 h-6`)

```jsx
<div className="flex items-center">
  <img
    src="/new-logo-bluer.png"
    alt="Zero Finance"
    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
  />
  <span className="ml-1 font-bold text-[13px] sm:text-[14px] tracking-tight text-[#0050ff]">
    finance
  </span>
</div>
```

**❌ Never:**

- Use "Zero Finance" as text-only logo
- Use any color other than `#0050ff` for "finance" text
- Stretch or distort logo proportions

### Color Palette

#### Primary Colors

```css
/* Brand */
--brand-primary: #1b29ff; /* CTAs, primary actions */
--brand-hover: #1420cc; /* Hover states */
--brand-subtle: #0050ff; /* Logo, links */

/* Neutrals */
--ink-100: #101010; /* Primary text */
--ink-80: rgba(16, 16, 16, 0.8); /* Secondary text */
--ink-70: rgba(16, 16, 16, 0.7); /* Tertiary text */
--ink-60: rgba(16, 16, 16, 0.6); /* Muted text, labels */
--ink-10: rgba(16, 16, 16, 0.1); /* Borders, dividers */
--ink-5: rgba(16, 16, 16, 0.05); /* Subtle backgrounds */

/* Surfaces */
--cream: #f7f7f2; /* App canvas */
--white: #ffffff; /* Cards, modals */
--off-white: #f6f5ef; /* Alternate background */

/* Semantic */
--positive: #10b981; /* Success, gains */
--destructive: #ef4444; /* Errors, destructive actions */
--warning: #f59e0b; /* Warnings */

/* Technical / CAD Accents (Blueprint Mode) */
--tech-line: rgba(27, 41, 255, 0.15); /* Structural lines (Brand Blue) */
--tech-grid: rgba(27, 41, 255, 0.05); /* Subtle background grid */
--tech-mono: #1b29ff; /* Monospace data text */
--tech-label: rgba(16, 16, 16, 0.5); /* Technical labels */
--tech-accent: #0050ff; /* Highlights */
```

#### Usage Guidelines

- **Landing pages**: Use `#1B29FF` for CTAs, gradients, and emphasis
- **Dashboard**: Use white cards on `#F7F7F2` canvas
- **Advanced/Technical**: Use `Blueprint` styles (Light grid + Mono type)
- **Text hierarchy**: `#101010` → `rgba(16,16,16,0.80)` → `rgba(16,16,16,0.60)`
- **Borders**: Always `border-[#101010]/10` for subtle division

---

## Typography

### Font Stack

```css
/* Sans-serif (primary) */
font-family:
  'Inter',
  -apple-system,
  BlinkMacSystemFont,
  sans-serif;

/* Serif (marketing headlines only) */
font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;

/* Monospace (Technical/CAD) */
font-family: 'IBM Plex Mono', 'Courier New', Consolas, monospace;
```

### Scale & Hierarchy

#### Landing/Marketing

```
Hero Headlines:     font-serif text-[36-88px] leading-[0.96] tracking-[-0.015em]
Subheadlines:       font-serif text-[24-36px] leading-[1.1]
Body (Large):       text-[16-18px] leading-[1.5]
Body (Regular):     text-[15-16px] leading-[1.5]
Labels:             uppercase tracking-[0.14-0.18em] text-[11-13px] text-ink-60
```

#### Dashboard/App

```
Page Titles:        font-serif text-[24-28px] leading-[1.1] (use sparingly)
Section Headings:   text-[20-22px] font-semibold tracking-[-0.01em]
Card Titles:        text-[15-16px] font-medium
Body:               text-[13-14px] leading-[1.5]
Small:              text-[12-13px]
Labels:             uppercase tracking-[0.14em] text-[11px] text-ink-60
```

**Typography Rules:**

- **Serif**: Reserved for top-level landing pages and hero sections
- **Dashboard flows**: Use sans-serif for clarity and scannability
- **Tabular data**: Always use `tabular-nums` for numbers
- **Amounts**: Right-align in tables, use monospace for consistency

---

## Components & Patterns

### Spacing System

```
Micro:     gap-2  (8px)   - Icon + text, inline elements
Small:     gap-3  (12px)  - Form fields, tight lists
Medium:    gap-4  (16px)  - Card content, sections
Large:     gap-6  (24px)  - Page sections
XLarge:    gap-8  (32px)  - Major layout divisions

Padding:
  Cards:   p-5 sm:p-6
  Modals:  p-6 sm:p-8
  Sections: py-6 sm:py-8
```

### Elevation & Shadows

```css
/* Subtle card elevation (default) */
shadow-ambient: 0 2px 8px rgba(16,16,16,0.04)
border: 1px solid rgba(16,16,16,0.10)

/* Hover states */
shadow-hover: 0 6px 16px rgba(16,16,16,0.08)

/* CTAs (use sparingly) */
shadow-primary: 0 10px 25px -5px rgba(27,41,255,0.25)
```

**Elevation Guidelines:**

- Default cards: `border + shadow-ambient` (subtle)
- Hover: Lift with `shadow-hover`
- Never stack heavy shadows; prefer border + subtle shadow
- Modals: Use backdrop blur + border

### Border Radius

```
Buttons:     rounded-md (6px)
Cards:       rounded-card-lg (12px)
Inputs:      rounded-md (6px)
Pills/Tags:  rounded-full (999px)
```

### Buttons

#### Primary CTA

```jsx
<button className="bg-[#1B29FF] hover:bg-[#1420CC] text-white font-medium px-6 py-3 rounded-md transition-colors">
  Get Started
</button>
```

#### Secondary

```jsx
<button className="bg-white border border-[#101010]/20 hover:border-[#101010]/40 text-[#101010] font-medium px-6 py-3 rounded-md transition-colors">
  Learn More
</button>
```

#### Ghost

```jsx
<button className="text-[#101010]/70 hover:text-[#1B29FF] underline underline-offset-4 transition-colors">
  View All →
</button>
```

### Forms & Inputs

#### Text Input

```jsx
<input
  type="text"
  className="h-12 px-4 bg-white border border-[#101010]/20 rounded-md 
             focus:border-[#1B29FF] focus:ring-2 focus:ring-[#1B29FF]/20 
             text-[15px] placeholder:text-[#101010]/40 transition-colors"
  placeholder="you@company.com"
/>
```

#### OTP Input (6-digit code)

```jsx
<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

Styling: White background, `#1B29FF` focus ring, 12px height, 11px width per slot

---

## Layout Templates

### Landing Page Hero

**With Gradient Background:**

```jsx
<section className="relative min-h-screen border-y border-[#101010]/10 bg-white/90 overflow-hidden">
  {/* Gradient background */}
  <GeneratedComponent className="z-0 bg-[#F6F5EF]" />

  <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32">
    <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60 mb-3">
      Business Savings Account
    </p>
    <h1 className="mt-3 font-serif text-[56px] sm:text-[72px] lg:text-[88px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
      Earn <span className="text-[#1B29FF]">8% APY</span>
    </h1>
    <p className="mt-6 text-[16px] leading-[1.5] text-[#101010]/80 max-w-[600px]">
      High-yield savings for startups. No minimums, no lock-ups, full liquidity.
    </p>

    <div className="mt-10 flex items-center gap-6">
      <button className="bg-[#1B29FF] hover:bg-[#1420CC] text-white px-6 py-3 rounded-md font-medium transition-colors shadow-primary">
        Open Account →
      </button>
      <a
        href="/demo"
        className="text-[#101010]/70 hover:text-[#1B29FF] underline underline-offset-4 transition-colors"
      >
        Try Demo
      </a>
    </div>
  </div>
</section>
```

**With Solid Background:**

```jsx
<section className="relative min-h-screen bg-[#F6F5EF] overflow-hidden">
  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32">
    <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60 mb-3">
      Business Savings Account
    </p>
    <h1 className="mt-3 font-serif text-[56px] sm:text-[72px] lg:text-[88px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
      Earn <span className="text-[#1B29FF]">8% APY</span>
    </h1>
    <p className="mt-6 text-[16px] leading-[1.5] text-[#101010]/80 max-w-[600px]">
      High-yield savings for startups. No minimums, no lock-ups, full liquidity.
    </p>

    <div className="mt-10 flex items-center gap-6">
      <button className="bg-[#1B29FF] hover:bg-[#1420CC] text-white px-6 py-3 rounded-md font-medium transition-colors">
        Open Account →
      </button>
      <a
        href="/demo"
        className="text-[#101010]/70 hover:text-[#1B29FF] underline underline-offset-4 transition-colors"
      >
        Try Demo
      </a>
    </div>
  </div>
</section>
```

**Gradient Background Guidelines:**

- Use `bg-white/90` or `bg-white/95` for section background to ensure text contrast
- Text should always be dark (`#101010`) on gradient backgrounds, never white
- Accent colors (like `#1B29FF`) work for spans and highlights
- Add `border-y border-[#101010]/10` for subtle separation
- Use `backdrop-blur-sm` on content cards for glassmorphism effect

### Dashboard Shell

```jsx
<div className="min-h-screen bg-[#F7F7F2]">
  {/* Sticky header */}
  <header className="sticky top-0 z-40 bg-[#F7F7F2] border-b border-[#101010]/10">
    <div className="h-[60px] flex items-center px-4 sm:px-6 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-3">
        <p className="uppercase tracking-[0.14em] text-[11px] text-ink-60">
          Dashboard
        </p>
        <h1 className="text-[24px] sm:text-[28px] font-medium text-[#101010]">
          Overview
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-3">{/* Actions */}</div>
    </div>
  </header>

  {/* Main content */}
  <main className="px-4 sm:px-6 py-6 sm:py-8 max-w-[1400px] mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Primary column (8/12) */}
      <section className="lg:col-span-8 space-y-6">
        <div className="bg-white border border-[#101010]/10 rounded-card-lg p-6 shadow-ambient">
          {/* Balance overview */}
        </div>
        <div className="bg-white border border-[#101010]/10 rounded-card-lg p-0">
          {/* Transaction table */}
        </div>
      </section>

      {/* Sidebar (4/12) */}
      <aside className="lg:col-span-4 space-y-6">
        <div className="bg-white border border-[#101010]/10 rounded-card-lg p-6">
          {/* Quick actions */}
        </div>
      </aside>
    </div>
  </main>
</div>
```

### Onboarding & Auth Pages

**Animated Background Pattern:**

```jsx
<section className="relative min-h-screen border-y border-[#101010]/10 bg-white/90 overflow-hidden">
  {/* Animated gradient background */}
  <GeneratedComponent className="z-0 bg-[#F6F5EF]" />

  <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-5xl mx-auto rounded-xl overflow-hidden border border-[#101010]/10 shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
      {/* Left Card */}
      <div className="bg-white/95 backdrop-blur-sm p-8 lg:p-12">
        {/* Content */}
      </div>

      {/* Right Card - separated by border */}
      <div className="bg-white/90 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-[#101010]/10 p-8 lg:p-12">
        {/* Form content */}
      </div>
    </div>
  </div>
</section>
```

**Auth Page Guidelines:**

- ✅ Animated gradients allowed (using `MeshGradient` component)
- ✅ Single container border instead of individual card borders
- ✅ Internal divider with `border-t lg:border-l` pattern
- ✅ Cards use `bg-white/95` and `bg-white/90` with `backdrop-blur-sm`
- ✅ Container has `rounded-xl overflow-hidden` for clean edges
- ✅ Shadow: `shadow-[0_2px_8px_rgba(16,16,16,0.04)]`
- ❌ No vertical divider bars (gap-px bg-[#101010]/10)
- ❌ No heavy drop shadows

### Landing Page Cards

**Two-Column Split Layout (with gradient background):**

```jsx
<div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[#101010]/10 max-w-5xl mx-auto shadow-ambient">
    {/* Left Card - Value Prop */}
    <div className="bg-white/95 backdrop-blur-sm border border-[#101010]/10 p-8 lg:p-12">
      <div className="mb-8">
        <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60 mb-3">
          Business Savings Account
        </p>
        <h1 className="font-serif text-[56px] sm:text-[64px] lg:text-[72px] leading-[0.96] tracking-[-0.015em] text-[#101010] mb-6">
          Earn <span className="text-[#1B29FF]">8% APY</span>
        </h1>
        <p className="text-[16px] leading-[1.5] text-[#101010]/80 max-w-[400px]">
          High-yield savings for startups. No minimums, no lock-ups, full
          liquidity.
        </p>
      </div>

      {/* Feature list */}
      <div className="space-y-4">
        {features.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-[#1B29FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="h-3 w-3 text-[#1B29FF]" />
            </div>
            <span className="text-[14px] text-[#101010]/70">{item}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Right Card - Form/CTA */}
    <div className="bg-white/90 backdrop-blur-sm border border-[#101010]/10 p-8 lg:p-12 flex flex-col justify-center">
      {/* Form content */}
    </div>
  </div>
</div>
```

**Card Design Rules:**

- Use `bg-white/95` or `bg-white/90` with `backdrop-blur-sm` for glassmorphism on gradients
- Always include `border border-[#101010]/10` for definition
- Add `shadow-ambient` to the container for subtle elevation
- Use `p-8 lg:p-12` for generous internal spacing
- Keep headlines at `text-[56-72px]` for impact
- Accent spans use `text-[#1B29FF]` not `text-[#0050ff]`

### Advanced/Power User Pattern (Blueprint Aesthetic)

When a user toggles "Advanced Details" or "Technical View", the UI reveals the underlying structure (Blueprint Mode) while maintaining the elegant light theme.

```jsx
{
  /* Initially hidden - progressive disclosure */
}
<div className="mt-4">
  <button
    onClick={() => setShowAdvanced(!showAdvanced)}
    className="text-[13px] text-ink-60 hover:text-[#1B29FF] transition-colors flex items-center gap-1"
  >
    <TerminalSquare className="h-4 w-4" />
    <span>Technical Details</span>
  </button>

  {showAdvanced && (
    <div className="mt-3 relative overflow-hidden rounded-md bg-white border border-[#1B29FF]/20 shadow-sm">
      {/* Blueprint Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-100"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(27,41,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(27,41,255,0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Header with Crosshairs */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-[#1B29FF]/10 bg-[#F7F7F2]/50 relative z-10">
        <span className="font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase">
          STRUCT::TX_DETAILS
        </span>
        {/* Decorative CAD crosshair */}
        <div className="h-3 w-3 relative">
          <div className="absolute top-1/2 w-full h-px bg-[#1B29FF]/40"></div>
          <div className="absolute left-1/2 h-full w-px bg-[#1B29FF]/40"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-3 relative z-10">
        <div className="grid grid-cols-[120px_1fr] gap-2 items-baseline">
          <span className="font-mono text-[11px] text-ink-60 uppercase tracking-wide">
            TX_HASH
          </span>
          <code className="font-mono text-[12px] text-[#1B29FF] break-all bg-[#1B29FF]/5 px-1 py-0.5 rounded">
            0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
          </code>
        </div>

        <div className="grid grid-cols-[120px_1fr] gap-2 items-baseline">
          <span className="font-mono text-[11px] text-ink-60 uppercase tracking-wide">
            BLOCK_ID
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] text-[#101010] tabular-nums">
              12,345,678
            </span>
            <span className="font-mono text-[10px] text-[#10b981]">
              [CONFIRMED]
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[120px_1fr] gap-2 items-baseline">
          <span className="font-mono text-[11px] text-ink-60 uppercase tracking-wide">
            GAS_EST
          </span>
          <span className="font-mono text-[12px] text-[#101010] tabular-nums">
            21,000 GWEI
          </span>
        </div>
      </div>
    </div>
  )}
</div>;
```

**Key Changes:**

- **Container**: Maintains `bg-white` to fit the dashboard, but adds `border-[#1B29FF]/20`.
- **Visuals**: Faint blueprint grid background (`rgba(27,41,255,0.05)`).
- **Typography**: Monospace for all labels and data, but dark/blue text instead of white/neon.
- **Vibe**: "Architectural Plan" vs "Hacker Terminal". Elegant, precise, readable.

---

## Interaction Patterns

### Loading States

```jsx
{
  /* Skeleton */
}
<div className="h-8 bg-[#101010]/5 animate-pulse rounded-md" />;

{
  /* Spinner */
}
<Loader2 className="h-5 w-5 animate-spin text-[#1B29FF]" />;

{
  /* Button loading */
}
<button disabled className="bg-[#1B29FF]/60 cursor-not-allowed">
  <Loader2 className="h-4 w-4 animate-spin mr-2" />
  Processing...
</button>;
```

### Empty States

```jsx
<div className="text-center py-12">
  <div className="w-16 h-16 mx-auto bg-[#101010]/5 rounded-full flex items-center justify-center mb-4">
    <Icon className="h-8 w-8 text-ink-60" />
  </div>
  <h3 className="text-[16px] font-medium text-[#101010] mb-2">
    No transactions yet
  </h3>
  <p className="text-[14px] text-ink-60 max-w-[400px] mx-auto">
    Your transaction history will appear here once you make your first transfer.
  </p>
  <button className="mt-6 bg-[#1B29FF] hover:bg-[#1420CC] text-white px-6 py-2.5 rounded-md font-medium transition-colors">
    Make First Transfer
  </button>
</div>
```

### Error States

```jsx
<div className="p-4 bg-red-50 border border-red-200 rounded-md">
  <div className="flex items-start gap-3">
    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <p className="text-[14px] font-medium text-red-900 mb-1">
        Transaction Failed
      </p>
      <p className="text-[13px] text-red-800">
        Insufficient balance. Please add funds and try again.
      </p>
    </div>
  </div>
</div>
```

---

## Content Guidelines

### Progressive Disclosure & Information Hierarchy

**Philosophy:** Layer information by relevance and technical depth. Users should see banking-first value propositions immediately, with legal/technical details accessible on demand.

#### 3-Tier Information Architecture

**Level 0: Value Propositions (Always Visible)**

The first impression. Focus on benefits, features, and user outcomes.

- ✅ Banking-first language: "Enable higher limits & transfers"
- ✅ Specific, measurable benefits: "Remove $10,000 deposit limit"
- ✅ Action-oriented copy: "Enable", "Transfer", "Earn"
- ❌ No legal entities: Different AI Inc., custody providers
- ❌ No technical jargon: "virtual account", "settlement layer"
- ❌ No vague promises: "unlimited" → use specific limits instead

**Examples:**

```jsx
// Onboarding card (Level 0)
<h3>Enable higher limits & transfers</h3>
<ul>
  <li>Remove $10,000 deposit limit</li>
  <li>Enable bank transfers in and out</li>
  <li>Earn 8-10% annually on deposits</li>
</ul>
```

**Level 1: Banking Details (Click → Modal/Dialog)**

Operational information users need for transactions. Revealed when clicking "Account Info", "Banking Details", or "View Details".

- ✅ Banking coordinates: IBAN, routing numbers, account numbers
- ✅ Source currency: USD, EUR
- ✅ Operational messaging: "Funds arrive directly to your account"
- ✅ Copy-to-clipboard functionality for all reference numbers
- ❌ Still hide: Different AI Inc., blockchain infrastructure
- ❌ Avoid crypto terminology at this level

**Examples:**

```jsx
// Banking instructions modal (Level 1)
<Dialog>
  <DialogHeader>
    <DialogTitle>Banking information</DialogTitle>
    <DialogDescription>Your account details</DialogDescription>
  </DialogHeader>
  <DialogContent>
    <div>
      <label>Account Number</label>
      <p>1234567890</p>
      <CopyButton />
    </div>
    <div>
      <label>Routing Number</label>
      <p>987654321</p>
      <CopyButton />
    </div>
  </DialogContent>
</Dialog>
```

**Level 2: Technical Details (Deliberate Toggle)**

Advanced/developer information. Only shown when user explicitly clicks "Technical details" or "Advanced settings" toggle.

- ✅ Legal entities: "Different AI Inc."
- ✅ Settlement/custody information: Destination addresses, networks
- ✅ Blockchain infrastructure: "Settlement address", destination currency
- ✅ Developer context: Chain IDs, contract addresses (if needed)
- ❌ Still maintain banking-adjacent language where possible

**Examples:**

```jsx
// Technical details toggle (Level 2)
<Collapsible>
  <CollapsibleTrigger>
    <ChevronRight />
    Technical details
  </CollapsibleTrigger>
  <CollapsibleContent>
    <div>
      <label>Legal Entity</label>
      <p>Different AI Inc.</p>
    </div>
    <div>
      <label>Settlement Address</label>
      <p>0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb</p>
    </div>
    <div>
      <label>Destination Currency</label>
      <p>USDC (ERC-20)</p>
    </div>
  </CollapsibleContent>
</Collapsible>
```

#### Button & Label Guidelines

**Level 0 → Level 1 Transitions:**

- ✅ "Account Info", "Banking Details", "View Details", "Get Banking Info"
- ❌ "Details", "More Info", "Click Here"

**Level 1 → Level 2 Transitions:**

- ✅ "Technical details", "Advanced settings", "Developer info"
- ❌ "Crypto details", "Show all", "Advanced details"

#### Terminology Mapping

| ❌ Avoid              | ✅ Use Instead         | Level |
| --------------------- | ---------------------- | ----- |
| "Unlimited deposits"  | "Remove $X limit"      | 0     |
| "Virtual account"     | "Bank account"         | 0-1   |
| "Destination address" | "Settlement address"   | 2     |
| "Crypto details"      | "Technical details"    | 2     |
| "Unlock features"     | "Enable [specific]"    | 0     |
| "Different AI Inc."   | (Show only at Level 2) | 2     |
| "Custody provider"    | (Show only at Level 2) | 2     |

#### When to Disclose Legal Entities

- ❌ **Never at Level 0**: Value prop cards, onboarding CTAs, landing pages
- ❌ **Not at Level 1**: Banking instructions, account details modals
- ✅ **Only at Level 2**: Inside "Technical details" toggle, terms of service, legal footer

**Rationale:** Different AI Inc. is operationally important but creates cognitive friction in banking flows. Users need to trust the product first, understand the banking layer second, and learn infrastructure details third.

### Voice & Tone

- **Clear**: Banking terms over crypto jargon
- **Confident**: "Your funds earn 8% APY" not "Funds may earn up to 8%"
- **Concise**: Remove filler words, get to the point
- **Human**: Avoid robotic corporate speak
- **Specific**: Use measurable limits over vague promises

### Writing Patterns

**✅ Good:**

- "Transfer complete" → Clear, active
- "Account created successfully" → Simple banking language
- "Earning 8% APY on $50,000" → Specific, valuable
- "View technical details" → Progressive disclosure
- "Remove $10,000 deposit limit" → Specific and measurable
- "Enable bank transfers in and out" → Action-oriented

**❌ Avoid:**

- "Safe deployment successful" → Too technical
- "Transaction broadcasted to mempool" → Crypto jargon
- "Your wallet address is..." → Use "account number" instead
- "Gas fees: 0.002 ETH" → Hide in advanced, show USD equivalent
- "Unlock unlimited deposits" → Vague promise
- "Different AI Inc. account" → Entity disclosure at wrong level

### Number Formatting

```jsx
{/* Currency (always USD first) */}
<span className="tabular-nums">$2,480,930.22</span>

{/* Percentages */}
<span className="text-[#1B29FF]">+8% APY</span>

{/* Large numbers */}
<span className="tabular-nums">$1.2M</span> {/* or */}
<span className="tabular-nums">$1,234,567</span>

{/* Dates */}
<time className="text-[13px] text-ink-60">Jan 15, 2025</time>
```

---

## Accessibility

### Focus States

```css
/* All interactive elements */
focus:outline-none
focus:ring-2
focus:ring-[#1B29FF]
focus:ring-offset-2
```

### Color Contrast

- Text on white: Minimum `#101010` (21:1 ratio)
- Secondary text: `rgba(16,16,16,0.80)` (16.8:1)
- Muted labels: `rgba(16,16,16,0.60)` (12.6:1)
- All meet WCAG AAA standards

### Motion

```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Common Mistakes & Fixes

### Landing Page Typography

❌ **Wrong - Headline too small, wrong accent color:**

```jsx
<h1 className="font-serif text-[36px] leading-[1.1]">
  Earn <span className="text-[#0050ff]">8% APY</span>
</h1>
```

✅ **Correct - Proper scale, brand primary color:**

```jsx
<h1 className="font-serif text-[56px] sm:text-[72px] lg:text-[88px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
  Earn <span className="text-[#1B29FF]">8% APY</span>
</h1>
```

### Landing Page Spacing

❌ **Wrong - Cramped spacing:**

```jsx
<div className="pt-12">
  <p className="uppercase text-[12px] mb-1">Label</p>
  <h1 className="mt-1 text-[48px]">Headline</h1>
  <p className="mt-3">Body text</p>
  <button className="mt-4">CTA</button>
</div>
```

✅ **Correct - Breathing room:**

```jsx
<div className="pt-20 sm:pt-24 lg:pt-32">
  <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60 mb-3">
    Label
  </p>
  <h1 className="mt-3 font-serif text-[56px] sm:text-[72px] lg:text-[88px]">
    Headline
  </h1>
  <p className="mt-6 text-[16px] leading-[1.5] max-w-[600px]">Body text</p>
  <div className="mt-10">
    <button>CTA</button>
  </div>
</div>
```

### Gradient Background Cards

❌ **Wrong - Poor contrast, missing borders:**

```jsx
<div className="bg-white p-6">
  <h2 className="text-[24px]">Card Title</h2>
  <p className="text-[14px]">Card content</p>
</div>
```

✅ **Correct - Glassmorphism with proper contrast:**

```jsx
<div className="bg-white/95 backdrop-blur-sm border border-[#101010]/10 p-8 lg:p-12 shadow-ambient">
  <h2 className="font-serif text-[56px] sm:text-[64px] lg:text-[72px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
    Card Title
  </h2>
  <p className="text-[16px] leading-[1.5] text-[#101010]/80">Card content</p>
</div>
```

### Button Styling

❌ **Wrong - Inconsistent colors:**

```jsx
<button className="bg-[#0050ff] hover:bg-blue-600 px-4 py-2 text-white">
  Click Me
</button>
```

✅ **Correct - Brand colors, proper sizing:**

```jsx
<button className="bg-[#1B29FF] hover:bg-[#1420CC] text-white font-medium px-6 py-3 rounded-md transition-colors">
  Click Me
</button>
```

### Feature List Icons

❌ **Wrong - Wrong icon color, poor spacing:**

```jsx
<div className="flex gap-2">
  <Check className="h-4 w-4 text-[#0050ff]" />
  <span className="text-[13px]">Feature</span>
</div>
```

✅ **Correct - Brand color, proper sizing:**

```jsx
<div className="flex items-start gap-3">
  <div className="h-5 w-5 rounded-full bg-[#1B29FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
    <Check className="h-3 w-3 text-[#1B29FF]" />
  </div>
  <span className="text-[14px] text-[#101010]/70">Feature</span>
</div>
```

### Auth Page Card Structure

❌ **Wrong - Vertical divider bar, individual card borders:**

```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[#101010]/10">
  <div className="bg-white border border-[#101010]/10 p-8">Left</div>
  <div className="bg-white border border-[#101010]/10 p-8">Right</div>
</div>
```

✅ **Correct - Container border, internal divider:**

```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-[#101010]/10 shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
  <div className="bg-white/95 backdrop-blur-sm p-8 lg:p-12">Left</div>
  <div className="bg-white/90 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-[#101010]/10 p-8 lg:p-12">
    Right
  </div>
</div>
```

✅ **Correct - Brand color, proper sizing:**

```jsx
<div className="flex items-start gap-3">
  <div className="h-5 w-5 rounded-full bg-[#1B29FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
    <Check className="h-3 w-3 text-[#1B29FF]" />
  </div>
  <span className="text-[14px] text-[#101010]/70">Feature</span>
</div>
```

---

## Do's and Don'ts

### ✅ Do

- Hide crypto complexity from primary flows
- Use banking terminology consistently
- Provide "Advanced" toggles for power users
- Show USD values prominently
- Use serif fonts only on landing/marketing pages
- Maintain consistent spacing (8px base unit)
- Use subtle shadows + borders for elevation
- Write concise, clear copy

### ❌ Don't

- Show wallet addresses in primary UI
- Mention "private keys" or "seed phrases" outside security settings
- Use crypto jargon ("gas", "mempool", "nonce") in main flows
- Mix serif and sans fonts in dashboard
- Use heavy drop shadows
- Alternate page backgrounds unnecessarily
- Write long-form explanations when a label suffices

---

## Landing & Auth Page Checklist

When building landing/onboarding/auth pages, ensure:

### Typography

- [ ] Hero headlines are `text-[56px] sm:text-[72px] lg:text-[88px]`
- [ ] Accent spans use `text-[#1B29FF]` (brand primary)
- [ ] Labels use `uppercase tracking-[0.14em] text-[12px] text-[#101010]/60`
- [ ] Body text is `text-[16px] leading-[1.5]` with `max-w-[600px]`
- [ ] Only serif fonts for headlines, sans for body

### Spacing

- [ ] Section padding: `pt-20 sm:pt-24 lg:pt-32`
- [ ] Label margin: `mb-3`
- [ ] Headline margin: `mt-3`
- [ ] Body margin: `mt-6`
- [ ] CTA margin: `mt-10`
- [ ] Feature list spacing: `space-y-4`

### Colors & Contrast

- [ ] Dark text (`#101010`) on gradient backgrounds, not white
- [ ] Cards use `bg-white/95` or `bg-white/90` with `backdrop-blur-sm`
- [ ] All borders are `border-[#101010]/10`
- [ ] CTAs use `bg-[#1B29FF] hover:bg-[#1420CC]`
- [ ] Text meets WCAG AA contrast (4.5:1 minimum)

### Layout & Structure

- [ ] Max container width: `max-w-[1200px]`
- [ ] Horizontal padding: `px-4 sm:px-6 lg:px-8`
- [ ] Two-column grids: `max-w-5xl mx-auto`
- [ ] Card padding: `p-8 lg:p-12`
- [ ] Cards have `shadow-ambient` on container

### Gradient Backgrounds

- [ ] Section uses `bg-white/90` overlay for contrast
- [ ] Text is always dark (`#101010`), never white
- [ ] Cards have `backdrop-blur-sm` for glassmorphism
- [ ] Border separator: `border-y border-[#101010]/10`

### Auth/Onboarding Specific

- [ ] Container border: `border border-[#101010]/10 rounded-xl overflow-hidden`
- [ ] Internal divider: `border-t lg:border-t-0 lg:border-l border-[#101010]/10`
- [ ] NO vertical divider bars (gap-px bg-[#101010]/10)
- [ ] Shadow: `shadow-[0_2px_8px_rgba(16,16,16,0.04)]`
- [ ] Animated gradient: `<GeneratedComponent className="z-0 bg-[#F6F5EF]" />`

### CTAs & Buttons

- [ ] Primary: `bg-[#1B29FF] hover:bg-[#1420CC]`
- [ ] Secondary/Ghost: `text-[#101010]/70 hover:text-[#1B29FF]`
- [ ] Padding: `px-6 py-3`
- [ ] Border radius: `rounded-md`
- [ ] Include transition: `transition-colors`
- [ ] Primary CTAs can have `shadow-primary`

## Quick Reference

### Color Tokens

```tsx
'#1B29FF'; // Brand primary (CTAs)
'#1420CC'; // Brand hover
'#0050ff'; // Logo blue
'#101010'; // Primary text
'rgba(16,16,16,0.60)'; // Muted text
'rgba(16,16,16,0.10)'; // Borders
'#F7F7F2'; // App canvas
'#FFFFFF'; // Cards
```

### Shadow Classes

```tsx
shadow-ambient      // Subtle card elevation
shadow-hover        // Hover state
border-[#101010]/10 // Standard border
```

### Spacing Scale

```tsx
gap-2  (8px)   gap-3  (12px)  gap-4  (16px)
gap-6  (24px)  gap-8  (32px)
p-5 sm:p-6     // Card padding
py-6 sm:py-8   // Section padding
```

### Border Radius

```tsx
rounded - md; // 6px (buttons, inputs)
rounded - card - lg; // 12px (cards)
rounded - full; // Pills, avatars
```

---

## Bimodal Interface Pattern (The "DeFi Mullet")

### Philosophy

Most apps try to find a middle ground between "Simple" and "Technical" and end up pleasing no one. The Bimodal Interface accepts that there are two distinct user modes and serves them both fully, rather than compromising on either.

**Core Insight**: The biggest problem in crypto UX is the tension between Simplicity and Transparency. Our solution: serve both modes completely, with an instant toggle.

### The Two Modes

#### Mode A: Banking View (Default)

Designed to look like a modern neobank or fintech app. Emphasizes trust, clarity, and ease of use.

**Visual Language:**

- **Background**: Warm, premium off-white canvas (`bg-[#F7F7F2]`)
- **Typography**:
  - Headlines: Serif fonts (`font-serif`) for high-end, editorial feel
  - Body: Clean sans-serif (`font-sans`) for readability
  - Labels: Uppercase, tracked-out (`tracking-[0.14em]`) in muted ink (`#101010/60`)
- **Cards**: Friendly rounded corners (`rounded-[12px]`), soft ambient shadows
- **Depth**: Subtle shadows that lift on hover

**UX Characteristics:**

- Focuses on _Outcomes_: "How much money do I have? What is the APY? Is it safe?"
- Uses friendly names: "High-Yield Savings" instead of "Morpho Blue"
- Shows USD values primarily
- High-contrast action buttons (Solid Brand Blue `#1B29FF`)

```jsx
// Banking Mode Card
<div className="bg-white border border-[#101010]/10 rounded-[12px] p-6 shadow-[0_2px_8px_rgba(16,16,16,0.04)] hover:shadow-[0_6px_16px_rgba(16,16,16,0.08)] transition-all duration-300">
  <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
    Available Balance
  </p>
  <p className="text-[32px] font-semibold tabular-nums text-[#101010]">
    $2,500,000.00
  </p>
  <p className="mt-2 text-[13px] text-[#101010]/60">
    Ready to transfer or invest
  </p>
</div>
```

#### Mode B: Technical View (Blueprint)

Designed to look like an architectural blueprint or developer terminal. Emphasizes precision, raw data, and structure.

**Visual Language:**

- **Background**: Blueprint grid overlay using CSS linear gradients (`24px` grid squares)
- **Typography**:
  - Global: Monospace (`font-mono`, IBM Plex Mono)
  - Color: Brand Blue (`#1B29FF`) to mimic blueprint lines
  - Data: `tabular-nums` for alignment
- **Cards**: Sharper corners (`rounded-sm`), flat shadows (`shadow-none`)
- **Decorations**: "Architectural Crosshairs" in corners, meta-data tags (`ID::STRAT_01`)

**UX Characteristics:**

- Focuses on _Architecture_: "Which protocol? Which contract? What's the utilization rate?"
- Reveals underlying protocol ("Morpho Blue") and risk provider ("Gauntlet")
- Shows raw token amounts first (`1.00 USDC`), USD as secondary
- Ghost buttons (outlined or text-only) to reduce visual noise

```jsx
// Technical Mode Card
<div className="relative bg-white border border-[#1B29FF]/20 rounded-sm shadow-none">
  {/* Blueprint Grid Background */}
  <div
    className="absolute inset-0 pointer-events-none opacity-100"
    style={{
      backgroundImage:
        'linear-gradient(to right, rgba(27,41,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(27,41,255,0.05) 1px, transparent 1px)',
      backgroundSize: '24px 24px',
    }}
  />

  {/* Crosshair Decorations */}
  <div className="absolute top-2 left-2 h-3 w-3">
    <div className="absolute top-1/2 w-full h-px bg-[#1B29FF]/40" />
    <div className="absolute left-1/2 h-full w-px bg-[#1B29FF]/40" />
  </div>

  <div className="relative z-10 p-6">
    <div className="flex items-center justify-between mb-3">
      <span className="font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase">
        BALANCE::PRIMARY
      </span>
      <span className="font-mono text-[10px] text-[#101010]/50">
        ID::ACC_001
      </span>
    </div>
    <p className="font-mono text-[28px] tabular-nums text-[#101010]">
      2,500,000.00
      <span className="ml-1 text-[14px] text-[#1B29FF]">USDC</span>
    </p>
    <p className="mt-2 font-mono text-[11px] text-[#101010]/60">
      ≈ $2,500,000.00 USD
    </p>
  </div>
</div>
```

### Semantic Typography

The font itself changes the user's expectations:

| Font              | Signal                                  | Use Case                         |
| ----------------- | --------------------------------------- | -------------------------------- |
| **Inter (Sans)**  | "This is a finished product. Trust us." | Banking mode, default UI         |
| **IBM Plex Mono** | "This is raw data. Verify this."        | Technical mode, contract details |

By switching typography instantly, we signal to the user's brain that they have entered a different level of granularity without needing a warning label.

### Abstraction as a Feature, Not a Lie

**Bad Abstraction**: Hiding the protocol entirely so the user doesn't know risks exist.

**Good Abstraction (Our Approach)**: Giving it a friendly name for scanning, but allowing the user to hit the toggle and instantly see the contract address and protocol name to verify the underlying tech.

| Banking Mode       | Technical Mode          |
| ------------------ | ----------------------- |
| High-Yield Savings | Morpho Blue (Gauntlet)  |
| Your Balance       | 1,234,567.89 USDC       |
| 8% APY             | 7.89% instantaneous APY |
| Transfer           | Execute Transaction     |
| Account Info       | Contract: 0x742d...     |

### Mode Toggle Component

```jsx
// Bimodal Toggle Switch
<button
  onClick={() => setIsTechnical(!isTechnical)}
  className={cn(
    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300",
    isTechnical ? "bg-[#1B29FF]" : "bg-[#101010]/10"
  )}
>
  <span
    className={cn(
      "inline-block h-4 w-4 rounded-full bg-white transition-transform duration-300 shadow-sm",
      isTechnical ? "translate-x-6" : "translate-x-1"
    )}
  />
</button>

// Toggle Label
<div className="flex items-center gap-2">
  <span className={cn(
    "text-[12px] transition-colors",
    isTechnical ? "text-[#101010]/50" : "text-[#101010]"
  )}>
    Banking
  </span>
  {/* Toggle here */}
  <span className={cn(
    "text-[12px] transition-colors font-mono",
    isTechnical ? "text-[#1B29FF]" : "text-[#101010]/50"
  )}>
    Technical
  </span>
</div>
```

### Blueprint Grid Background Component

```jsx
const BlueprintGrid = ({ className }: { className?: string }) => (
  <div
    className={cn("absolute inset-0 pointer-events-none", className)}
    style={{
      backgroundImage: `
        linear-gradient(to right, rgba(27,41,255,0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(27,41,255,0.05) 1px, transparent 1px)
      `,
      backgroundSize: '24px 24px',
    }}
  />
);

// Architectural Crosshairs (corner decorations)
const Crosshairs = ({ position = 'top-left' }: { position?: string }) => {
  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };

  return (
    <div className={cn("absolute h-3 w-3", positionClasses[position])}>
      <div className="absolute top-1/2 w-full h-px bg-[#1B29FF]/40" />
      <div className="absolute left-1/2 h-full w-px bg-[#1B29FF]/40" />
    </div>
  );
};
```

### Styling Reference Tables

**Card Styling by Mode:**

| Property      | Banking Mode                              | Technical Mode        |
| ------------- | ----------------------------------------- | --------------------- |
| Background    | `bg-white`                                | `bg-white`            |
| Border        | `border-[#101010]/10`                     | `border-[#1B29FF]/20` |
| Border Radius | `rounded-[12px]`                          | `rounded-sm`          |
| Shadow        | `shadow-[0_2px_8px_rgba(16,16,16,0.04)]`  | `shadow-none`         |
| Hover Shadow  | `shadow-[0_6px_16px_rgba(16,16,16,0.08)]` | none                  |
| Grid Overlay  | none                                      | Blueprint grid        |

**Typography by Mode:**

| Element   | Banking Mode                                                | Technical Mode                                                  |
| --------- | ----------------------------------------------------------- | --------------------------------------------------------------- |
| Labels    | `uppercase tracking-[0.14em] text-[11px] text-[#101010]/60` | `font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase` |
| Amounts   | `text-[32px] font-semibold tabular-nums text-[#101010]`     | `font-mono text-[28px] tabular-nums text-[#101010]`             |
| Secondary | `text-[13px] text-[#101010]/60`                             | `font-mono text-[11px] text-[#101010]/60`                       |

**Button Styling by Mode:**

| Button Type | Banking Mode                                   | Technical Mode                                                          |
| ----------- | ---------------------------------------------- | ----------------------------------------------------------------------- |
| Primary     | `bg-[#1B29FF] text-white px-6 py-3 rounded-md` | `border border-[#1B29FF] text-[#1B29FF] font-mono px-4 py-2 rounded-sm` |
| Secondary   | `border border-[#101010]/10 text-[#101010]`    | `text-[#1B29FF]/70 font-mono underline`                                 |

### Implementation Pattern

```jsx
function BimodalCard({ isTechnical, children }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        isTechnical
          ? 'bg-white border-[#1B29FF]/20 rounded-sm shadow-none'
          : 'bg-white border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)]',
      )}
    >
      {/* Blueprint Grid (Technical only) */}
      {isTechnical && <BlueprintGrid />}

      {/* Crosshairs (Technical only) */}
      {isTechnical && (
        <>
          <Crosshairs position="top-left" />
          <Crosshairs position="top-right" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 p-6">{children}</div>
    </div>
  );
}
```

### When to Use Bimodal

Use the Bimodal Interface pattern when:

- The component deals with financial data that has underlying technical complexity
- Users may need to verify contract addresses or protocol details
- There's a clear distinction between "outcome" and "architecture" views
- The feature involves blockchain transactions or smart contracts

Don't use for:

- Simple informational content
- Marketing pages
- Settings that don't have technical depth

### Transition Guidelines

- Use `transition-all duration-300` for smooth morphing between modes
- Content should reflow gracefully - never jump
- Grid and crosshairs should fade in/out with the transition
- Typography changes should feel "liquid and premium"

---

**Last Updated**: January 2025  
**Maintained by**: Zero Finance Design Team
