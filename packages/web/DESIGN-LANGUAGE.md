# Zero Finance Design Language

> **Philosophy**: Progressive disclosure. Banking-first experience with technical depth available on demand. Sharp, modern interfaces that feel precise and trustworthy.

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
- **Sharp corners** (`rounded-sm` or none) for a precise, modern feel
- Tight spacing, efficient layouts
- Clear, actionable content

**Technical/Developer** (Deep Dive - Advanced Mode)

- **Aesthetic**: Engineering Precision (Blueprint Style)
- **Background**: Consistent Light Theme (`#FFFFFF` / `#F7F7F2`)
- **Typography**: Monospace (`IBM Plex Mono`) for data density
- **Visuals**: Fine hairlines, measuring guides, coordinate annotations
- **Role**: Reveals structure via "Architectural" overlays without breaking the elegant banking atmosphere

### 3. **Bimodal Component Design**

**Philosophy:** All components should support two visual modes - a banking-first default and a technical/developer mode. The mode is controlled via user settings (not a visible toggle), so components must gracefully adapt.

**Implementation:**

```typescript
// Access current mode via hook
const { isTechnical } = useBimodal();

// Conditionally render based on mode
const label = isTechnical ? 'BALANCE::AVAILABLE' : 'Available Balance';
```

**Content Guidelines:**

| Aspect       | Banking Mode (Default)                    | Technical Mode                           |
| ------------ | ----------------------------------------- | ---------------------------------------- |
| Language     | "Available Balance", "High-Yield Savings" | "BALANCE::AVAILABLE", "PROTOCOL::MORPHO" |
| Typography   | Serif headlines, sans-serif body          | Monospace throughout                     |
| Data display | USD primary, rounded values               | Token amounts, precise decimals          |
| Actions      | "Transfer", "Deposit"                     | "EXECUTE::TRANSFER", "[ DEPOSIT ]"       |

**All dashboard components must support both modes.** Use `isTechnical` to conditionally apply styles and content.

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

### Technical Identity (Developer Mode)

_Used for Developer views, Smart Contract interactions, and Technical Details._

**Core Aesthetic: Engineering Precision**
Clean, data-dense interfaces that reveal the underlying system architecture while maintaining elegance.

**Key Characteristics:**

- **Data Density**: Monospace typography (`IBM Plex Mono`) for transactional data and precision
- **Protocol Naming**: Use `NAMESPACE::IDENTIFIER` format (e.g., `BALANCE::AVAILABLE`, `PROTOCOL::MORPHO`)
- **Brand Integration**: Use Brand Blue (`#1B29FF`) as the primary accent color
- **Minimal Decoration**: Subtle corner crosshairs and thin borders instead of heavy ornamentation

**Visual Elements:**

- **Crosshairs**: Minimal corner markers using brand blue at 30% opacity
- **Technical Labels**: Uppercase, tracked-out, monospace labels (`text-[10px]` to `text-[11px]`)
- **Accent Borders**: `border-[#1B29FF]/20` for containers, `border-[#1B29FF]/10` for subtle dividers

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
--fafafa: #fafafa; /* Subtle card background */

/* Semantic */
--positive: #10b981; /* Success, gains, growth vaults */
--destructive: #ef4444; /* Errors, destructive actions */
--warning: #f59e0b; /* Warnings */

/* Asset Colors */
--usdc-blue: #2775ca; /* USDC badges */
--eth-purple: #627eea; /* ETH/WETH badges */

/* Technical / CAD Accents (Blueprint Mode) */
--tech-line: rgba(27, 41, 255, 0.2); /* Structural borders (Brand Blue) */
--tech-grid: rgba(27, 41, 255, 0.05); /* Subtle background */
--tech-mono: #1b29ff; /* Monospace data text */
--tech-label: rgba(27, 41, 255, 0.7); /* Technical labels */
--tech-accent: #0050ff; /* Highlights */
```

#### Usage Guidelines

- **Landing pages**: Use `#1B29FF` for CTAs, gradients, and emphasis
- **Dashboard**: Use white cards on `#F7F7F2` canvas
- **Advanced/Technical**: Use `Blueprint` styles (Light grid + Mono type)
- **Text hierarchy**: `#101010` → `rgba(16,16,16,0.60)` → `rgba(16,16,16,0.40)`
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
Page Titles:        text-[24-28px] font-medium tracking-[-0.01em]
Section Headings:   text-[18-20px] font-semibold
Card Titles:        text-[15px] font-medium
Body:               text-[13-14px] leading-[1.5]
Small:              text-[12px]
Labels:             uppercase tracking-[0.14em] text-[11px] text-ink-60
Table Headers:      uppercase tracking-[0.14em] text-[11px] text-[#101010]/60
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
Micro:     gap-1  (4px)   - Tight inline elements
Small:     gap-2  (8px)   - Icon + text, badges
Medium:    gap-3  (12px)  - Form fields, tight lists
Standard:  gap-4  (16px)  - Card content, sections
Large:     gap-6  (24px)  - Page sections
XLarge:    gap-8  (32px)  - Major layout divisions

Padding:
  Cards:   p-4
  Tables:  p-4 (cells)
  Modals:  p-6
  Sections: py-6
```

### Elevation & Shadows

**Philosophy**: Prefer borders over shadows for a sharper, more modern look.

```css
/* Default card - NO shadow, border only */
border: 1px solid rgba(16, 16, 16, 0.1);
background: white;

/* Technical mode card */
border: 1px solid rgba(27, 41, 255, 0.2);
background: white;

/* Hover states - subtle background change, not shadow */
hover:bg-[#F7F7F2]/50  /* Banking mode */
hover:bg-[#1B29FF]/5   /* Technical mode */

/* Selected/Active states */
ring-1 ring-[#1B29FF]/30  /* Focus ring */
bg-[#1B29FF]/5            /* Selected background */
```

**Elevation Guidelines:**

- **Default cards**: Border only, no shadow
- **Hover**: Background color change, not shadow lift
- **Selected**: Subtle ring + background tint
- **Never use**: Heavy drop shadows in dashboard

### Border Radius

**Sharp, Modern Aesthetic**

```
None:        rounded-none  - Technical mode cards, table cells
Minimal:     rounded-sm    - Dashboard cards, buttons
Standard:    rounded       - Inputs, form elements (4px)
Pills/Tags:  rounded-full  - Status badges, avatars
```

**Key Principle**: Dashboard components use `rounded-sm` or no rounding for a precise, professional feel. Only use `rounded-lg`/`rounded-xl` for landing pages and modals.

### Cards

#### Dashboard Card (Banking Mode)

```jsx
<div className="bg-white border border-[#101010]/10">
  <div className="p-4">{/* Card content */}</div>
</div>
```

#### Dashboard Card (Technical Mode)

```jsx
<div className="bg-white border border-[#1B29FF]/20 rounded-sm">
  <div className="p-4">{/* Card content */}</div>
</div>
```

#### Table/List Container

```jsx
<div className="bg-white border border-[#101010]/10 overflow-hidden">
  {/* Table Header */}
  <div className="grid grid-cols-12 gap-3 p-4 border-b border-[#101010]/10 bg-[#F7F7F2]">
    <div className="col-span-4">
      <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
        Column Header
      </p>
    </div>
    {/* More columns... */}
  </div>

  {/* Table Rows */}
  <div className="divide-y divide-[#101010]/10">{/* Row content */}</div>
</div>
```

### Buttons

#### Primary CTA

```jsx
<button className="bg-[#1B29FF] hover:bg-[#1420CC] text-white text-[12px] font-medium px-3 py-2 transition-colors">
  Deposit
</button>
```

#### Secondary

```jsx
<button className="bg-white border border-[#101010]/10 hover:bg-[#F7F7F2] text-[#101010] text-[12px] px-3 py-2 transition-colors">
  Withdraw
</button>
```

#### Technical Mode Primary

```jsx
<button className="bg-transparent border border-[#1B29FF] text-[#1B29FF] hover:bg-[#1B29FF]/5 font-mono uppercase text-[12px] px-3 py-2 transition-colors">
  Deposit
</button>
```

#### Technical Mode Secondary

```jsx
<button className="text-[#101010]/60 hover:text-[#1B29FF] font-mono uppercase text-[12px] underline decoration-dotted underline-offset-4 transition-colors">
  Withdraw
</button>
```

#### Ghost/Link

```jsx
<button className="text-[#101010]/60 hover:text-[#101010] transition-colors flex items-center">
  <ExternalLink className="h-3 w-3" />
</button>
```

### Badges & Tags

#### Asset Badge (USDC)

```jsx
<span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-[#2775ca]/10 text-[#2775ca]">
  USDC
</span>
```

#### Asset Badge (ETH)

```jsx
<span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-[#627eea]/10 text-[#627eea]">
  ETH
</span>
```

#### Technical Mode Badge

```jsx
<span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide bg-[#1B29FF]/10 text-[#1B29FF]">
  USDC
</span>
```

#### Status Badge (Success)

```jsx
<span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wide bg-[#10B981]/10 text-[#10B981]">
  <Shield className="h-3 w-3" />
  INSURED
</span>
```

### Forms & Inputs

#### Text Input

```jsx
<input
  type="text"
  className="h-10 px-3 bg-white border border-[#101010]/10 
             focus:border-[#1B29FF] focus:ring-1 focus:ring-[#1B29FF]/20 
             text-[14px] placeholder:text-[#101010]/40 transition-colors"
  placeholder="Enter amount"
/>
```

#### Technical Mode Input

```jsx
<div className="space-y-1.5">
  <label className="font-mono text-[10px] text-[#1B29FF]/70 uppercase tracking-wider">
    INPUT::AMOUNT
  </label>
  <input
    type="number"
    className="w-full h-10 px-3 font-mono bg-white border border-[#1B29FF]/20 
               focus:border-[#1B29FF] focus:outline-none text-[14px] transition-colors"
  />
</div>
```

---

## Layout Templates

### Dashboard Table Layout

```jsx
<div className="bg-white border border-[#101010]/10 overflow-x-auto">
  {/* Table Header */}
  <div className="grid grid-cols-12 gap-3 p-4 border-b border-[#101010]/10 bg-[#F7F7F2]">
    <div className="col-span-4">
      <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
        Strategy
      </p>
    </div>
    <div className="col-span-2 text-right">
      <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
        APY
      </p>
    </div>
    <div className="col-span-3 text-right">
      <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
        Your Position
      </p>
    </div>
    <div className="col-span-3 text-right">
      <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
        Actions
      </p>
    </div>
  </div>

  {/* Table Rows */}
  {items.map((item, index) => (
    <div
      key={item.id}
      className={cn(
        'grid grid-cols-12 gap-3 p-4 items-center transition-all duration-200',
        'hover:bg-[#F7F7F2]/30',
        index !== items.length - 1 && 'border-b border-[#101010]/10',
      )}
    >
      {/* Row content */}
    </div>
  ))}
</div>
```

### Technical Mode Table Layout

```jsx
<div className="bg-white border border-[#1B29FF]/20 rounded-sm overflow-x-auto">
  {/* Technical Header */}
  <div className="px-4 py-2 grid grid-cols-12 gap-3 border-b border-[#1B29FF]/10">
    <span className="col-span-4 font-mono text-[10px] text-[#1B29FF]/50">
      STRATEGY_ID
    </span>
    <span className="col-span-2 font-mono text-[10px] text-[#1B29FF]/50 text-right">
      APY_VAR
    </span>
    <span className="col-span-3 font-mono text-[10px] text-[#1B29FF]/50 text-right">
      POSITION
    </span>
    <span className="col-span-3 font-mono text-[10px] text-[#1B29FF]/50 text-right">
      EXECUTE
    </span>
  </div>

  {/* Table Rows */}
  {items.map((item, index) => (
    <div
      key={item.id}
      className={cn(
        'grid grid-cols-12 gap-3 p-4 items-center transition-all duration-200',
        'bg-white border-b border-[#1B29FF]/10',
        'hover:bg-[#1B29FF]/5',
      )}
    >
      {/* Row content */}
    </div>
  ))}
</div>
```

### Section with Header

```jsx
<div className="space-y-4">
  {/* Section Header */}
  <p className="uppercase tracking-[0.18em] text-[11px] text-[#101010]/60">
    Available Strategies
  </p>

  {/* Content */}
  <div className="bg-white border border-[#101010]/10">{/* ... */}</div>

  {/* Footer */}
  <div className="flex items-center justify-center">
    <p className="flex items-center gap-2 text-[13px] text-[#101010]/40">
      <Lock className="w-4 h-4" />
      Your funds are held securely with instant access
    </p>
  </div>
</div>
```

### Technical Mode Section Header

```jsx
<p className="font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase mb-4">
  VAULT::STRATEGIES
</p>
```

---

## Row/List Item Patterns

### Standard Row

```jsx
<div
  className={cn(
    'grid grid-cols-12 gap-3 p-4 items-center transition-all duration-200',
    'hover:bg-[#F7F7F2]/30',
    !isLastRow && 'border-b border-[#101010]/10',
  )}
>
  {/* Primary Column */}
  <div className="col-span-4">
    <p className="text-[15px] font-medium text-[#101010]">{item.name}</p>
    <p className="text-[12px] text-[#101010]/60 mt-1">{item.subtitle}</p>
  </div>

  {/* Value Column */}
  <div className="col-span-2 text-right">
    <p className="text-[24px] font-semibold tabular-nums text-[#1B29FF]">
      {item.value}%
    </p>
  </div>

  {/* Secondary Value */}
  <div className="col-span-3 text-right">
    <p className="text-[18px] font-semibold tabular-nums text-[#101010]">
      {formatUsd(item.balance)}
    </p>
  </div>

  {/* Actions */}
  <div className="col-span-3 flex justify-end gap-1">
    <button className="bg-[#1B29FF] hover:bg-[#1420CC] text-white text-[12px] px-2.5 py-1">
      Deposit
    </button>
    <button className="text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2] text-[12px] px-2.5 py-1">
      Withdraw
    </button>
  </div>
</div>
```

### Row with Category Accent

```jsx
<div
  className={cn(
    'grid grid-cols-12 gap-3 p-4 items-center transition-all duration-200',
    // Category-based styling
    item.category === 'growth'
      ? 'bg-gradient-to-r from-[#10b981]/5 to-transparent border-l-2 border-[#10b981]'
      : item.isInsured
        ? 'bg-[#1B29FF]/5 border-l-2 border-[#1B29FF]'
        : 'hover:bg-[#F7F7F2]/30',
    !isLastRow && 'border-b border-[#101010]/10',
  )}
>
  {/* ... */}
</div>
```

### Selected Row State

```jsx
<div
  className={cn(
    'grid grid-cols-12 gap-3 p-4 items-center',
    isSelected && 'ring-1 ring-[#1B29FF]/30 bg-[#1B29FF]/5',
  )}
>
  {/* ... */}
</div>
```

---

## Value Display Patterns

### Large Value (APY)

```jsx
{
  /* Banking Mode */
}
<p className="text-[24px] font-semibold tabular-nums text-[#1B29FF]">8.5%</p>;

{
  /* Growth Category */
}
<p className="text-[24px] font-semibold tabular-nums text-[#10b981]">12.3%</p>;

{
  /* Technical Mode */
}
<div className="flex items-baseline gap-1">
  <p className="text-[18px] font-mono tabular-nums text-[#1B29FF]">8.5%</p>
  <span className="text-[10px] text-[#1B29FF]/60 font-mono">VAR</span>
</div>;
```

### Balance Display

```jsx
{
  /* Banking Mode - USD primary */
}
<p className="text-[18px] font-semibold tabular-nums text-[#101010]">
  $12,345.67
</p>;

{
  /* With native token */
}
<div>
  <p className="text-[18px] font-semibold tabular-nums text-[#101010]">
    1.234567 ETH
  </p>
  <p className="text-[13px] text-[#101010]/60 tabular-nums">$2,345.67</p>
</div>;

{
  /* Technical Mode */
}
<div>
  <p className="text-[15px] font-mono tabular-nums text-[#101010]">
    1.234567
    <span className="ml-1 text-[11px] text-[#101010]/50">ETH</span>
  </p>
  <p className="text-[11px] font-mono text-[#101010]/50 tabular-nums">
    ≈ $2,345.67
  </p>
</div>;
```

### No Position State

```jsx
{
  /* Banking Mode */
}
<p className="text-[14px] text-[#101010]/40">No position</p>;

{
  /* Technical Mode */
}
<p className="text-[13px] font-mono text-[#101010]/40">0.00</p>;
```

---

## Technical Mode Patterns

### Container with Crosshairs

```jsx
<div className="relative">
  {/* Architectural Crosshairs */}
  <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-[#1B29FF]/30" />
  <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-[#1B29FF]/30" />
  <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-[#1B29FF]/30" />
  <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-[#1B29FF]/30" />

  {/* Content */}
  <div className="relative z-10">{/* ... */}</div>
</div>
```

### ID Tag

```jsx
<div className="absolute top-2 right-2 font-mono text-[9px] text-[#1B29FF]/40">
  ID::MORPHO_USDC_BASE
</div>
```

### Status Footer

```jsx
<div className="font-mono text-[11px] text-[#1B29FF]/60 text-center p-4 border border-dashed border-[#1B29FF]/20 bg-[#1B29FF]/5 rounded">
  SYS_STATUS: ONLINE | CHAINS: BASE, ARBITRUM | CONTRACTS: ERC-4626
</div>
```

---

## Interaction Patterns

### Loading States

```jsx
{
  /* Skeleton */
}
<div className="h-8 bg-[#101010]/5 animate-pulse" />;

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
    <Icon className="h-8 w-8 text-[#101010]/40" />
  </div>
  <h3 className="text-[16px] font-medium text-[#101010] mb-2">
    No transactions yet
  </h3>
  <p className="text-[14px] text-[#101010]/60 max-w-[400px] mx-auto">
    Your transaction history will appear here once you make your first transfer.
  </p>
  <button className="mt-6 bg-[#1B29FF] hover:bg-[#1420CC] text-white px-6 py-2.5 font-medium transition-colors">
    Make First Transfer
  </button>
</div>
```

### Error States

```jsx
<div className="p-4 bg-red-50 border border-red-200">
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

### Voice & Tone

- **Clear**: Banking terms over crypto jargon
- **Confident**: "Your funds earn 8% APY" not "Funds may earn up to 8%"
- **Concise**: Remove filler words, get to the point
- **Human**: Avoid robotic corporate speak
- **Specific**: Use measurable limits over vague promises

### Number Formatting

```jsx
{
  /* Currency (always USD first) */
}
<span className="tabular-nums">$2,480,930.22</span>;

{
  /* Percentages */
}
<span className="text-[#1B29FF]">8.5%</span>;

{
  /* Large numbers */
}
<span className="tabular-nums">$1.2M</span>;

{
  /* Token amounts */
}
<span className="tabular-nums font-mono">1.234567 ETH</span>;

{
  /* Dates */
}
<time className="text-[13px] text-[#101010]/60">Jan 15, 2025</time>;
```

---

## Bimodal Styling Reference

### Quick Reference Tables

**Card Styling by Mode:**

| Property      | Banking Mode (Default)  | Technical Mode         |
| ------------- | ----------------------- | ---------------------- |
| Background    | `bg-white`              | `bg-white`             |
| Border        | `border-[#101010]/10`   | `border-[#1B29FF]/20`  |
| Border Radius | none or `rounded-sm`    | `rounded-sm` or none   |
| Shadow        | none                    | none                   |
| Hover         | `hover:bg-[#F7F7F2]/30` | `hover:bg-[#1B29FF]/5` |

**Typography by Mode:**

| Element   | Banking Mode                                                | Technical Mode                                                     |
| --------- | ----------------------------------------------------------- | ------------------------------------------------------------------ |
| Labels    | `uppercase tracking-[0.14em] text-[11px] text-[#101010]/60` | `font-mono text-[10px] text-[#1B29FF]/50 tracking-wider uppercase` |
| Amounts   | `text-[24px] font-semibold tabular-nums text-[#1B29FF]`     | `font-mono text-[18px] tabular-nums text-[#1B29FF]`                |
| Secondary | `text-[13px] text-[#101010]/60`                             | `font-mono text-[11px] text-[#101010]/50`                          |
| Names     | `text-[15px] font-medium text-[#101010]`                    | `text-[15px] font-mono text-[#1B29FF]` + link                      |

**Button Styling by Mode:**

| Button Type | Banking Mode                                | Technical Mode                                                           |
| ----------- | ------------------------------------------- | ------------------------------------------------------------------------ |
| Primary     | `bg-[#1B29FF] text-white px-2.5 py-1`       | `border border-[#1B29FF] text-[#1B29FF] font-mono uppercase px-2.5 py-1` |
| Secondary   | `border border-[#101010]/10 text-[#101010]` | `text-[#101010]/60 font-mono uppercase underline decoration-dotted`      |

---

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
'#10B981'; // Success/Growth
'#2775ca'; // USDC blue
'#627eea'; // ETH purple
```

### Border Classes

```tsx
border-[#101010]/10     // Standard border
border-[#101010]/5      // Subtle divider
border-[#1B29FF]/20     // Technical border
border-[#1B29FF]/10     // Technical divider
```

### Spacing Scale

```tsx
gap-1  (4px)   gap-2  (8px)   gap-3  (12px)
gap-4  (16px)  gap-6  (24px)  gap-8  (32px)
p-4            // Standard card padding
py-2           // Table header padding
```

### Border Radius

```tsx
rounded - sm; // 2px - Dashboard components
rounded; // 4px - Inputs
rounded - full; // Pills, avatars
// No rounding  - Technical mode, table cells
```

---

**Last Updated**: December 2025  
**Maintained by**: Zero Finance Design Team
