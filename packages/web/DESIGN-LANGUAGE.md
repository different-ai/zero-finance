## Design Language Overview

Zero Finance uses a distinctive two-track design system that separates marketing/onboarding experiences from the core application dashboard.

## Logo & Branding

### Logo Usage

- **Image**: `/new-logo-bluer.png` - blue circular icon
- **Format**: Icon + "finance" text in bold sans-serif
- **Text Color**: ALWAYS use primary blue `#0050ff` for "finance" text (matches logo icon color)
- **Sizes**: 20x20px (w-5 h-5) on mobile, 24x24px (w-6 h-6) on desktop
- **Implementation**:
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
- **Usage**: Headers, navigation bars, onboarding flows
- **Never**: Use "Zero Finance" as text-only logo
- **Never**: Use any color other than `#0050ff` for the "finance" text

## Landing & Onboarding Design

### Visual Style

- **Background**: White or `#F6F5EF` with gradient overlays using `GradientBackground` component
- **Primary Color**: `#1B29FF` (bright blue) for CTAs and emphasis
- **Typography**: Large serif headlines (36-88px), generous tracking on uppercase labels
- **Cards**: White with soft shadows `shadow-[0_2px_8px_rgba(16,16,16,0.04)]` and subtle borders

### Landing Components

- **Hero Sections**: Full-bleed with gradient backgrounds, large serif type
- **Buttons**: Primary blue `bg-[#1B29FF] hover:bg-[#1420CC]` with rounded corners
- **Forms**: Clean white inputs with focus states using primary blue
- **Spacing**: Generous padding (p-8 to p-12) for breathing room

### Typography Scale (Landing)

```
Hero: font-serif text-[36-88px] leading-[0.96] tracking-[-0.015em]
Subheadlines: text-[24-36px]
Body: text-[15-18px] leading-[1.5]
Labels: uppercase tracking-[0.14-0.18em] text-[11-13px]
```

## Dashboard Design

### Visual Style

- **Background**: `#F7F7F2` (warm gray) for main canvas
- **Cards**: White with 1px borders `border-[#101010]/10`
- **Typography**: More compact, functional approach
- **Spacing**: Tighter, efficient use of space

### Dashboard Components

- **Headers**: Compact 56-64px with sticky positioning
- **Content Cards**: White backgrounds with subtle borders
- **Tables**: Clean lines with `border-[#101010]/10` dividers
- **Actions**: Smaller, more functional buttons

### Typography Scale (Dashboard)

```
Primary Page Titles: font-serif text-[24-28px] (use sparingly)
Section Subheads / Modals: text-[20-22px] font-semibold tracking-[-0.01em] (sans)
Card Titles: text-[15-16px] font-medium
Body: text-[13-14px]
Labels: uppercase tracking-[0.14em] text-[11px] text-[#101010]/60
```

### Layout Patterns

#### App Dashboard Header

- Compact height 56-64px with sticky positioning when useful
- Serif headline optional and compact; prefer sans for day-to-day screens and modals
- Title sizes: 24px on mobile, 28-32px on desktop
- Optional uppercase label above title for section context
- Keep background `#F7F7F2`; separate header with a 1px bottom border `border-[#101010]/10`

#### Content Sections

- Single background: use `#F7F7F2` for the app canvas
- Use white cards with 1px borders `border-[#101010]/10` for content blocks
- Spacing inside cards: `p-5 sm:p-6`; grid gaps `gap-5 sm:gap-6`
- Prefer full-width containers with internal max-widths on specific blocks
- Keep vertical rhythm tight: `py-6 sm:py-8` for section bands when needed

## Examples in Practice

### Dashboard Shell Template

```jsx
<div className="min-h-screen bg-[#F7F7F2]">
  {/* Top app header */}
  <header className="sticky top-0 z-40 bg-[#F7F7F2] border-b border-[#101010]/10">
    <div className="h-[60px] flex items-center px-4 sm:px-6 max-w-[1400px] mx-auto">
      <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mr-3">
        dashboard
      </p>
      <h1 className="font-serif text-[28px] sm:text-[32px] leading-[1] text-[#101010]">
        overview
      </h1>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* actions live here */}
      </div>
    </div>
  </header>

  {/* Optional subheader with filters / date range */}
  <div className="sticky top-[60px] z-30 bg-[#F7F7F2]/80 backdrop-blur border-b border-[#101010]/10">
    <div className="h-[48px] flex items-center px-4 sm:px-6 max-w-[1400px] mx-auto">
      {/* chips, tabs, date picker */}
    </div>
  </div>

  {/* Main content grid */}
  <main className="px-4 sm:px-6 py-6 sm:py-8 max-w-[1400px] mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
      {/* Primary column */}
      <section className="lg:col-span-8 space-y-5 sm:space-y-6">
        <div className="bg-white border border-[#101010]/10 rounded-card-lg p-5 sm:p-6 shadow-premium-subtle">
          {/* big number + small chart */}
        </div>
        <div className="bg-white border border-[#101010]/10 rounded-card-lg p-0">
          {/* table with sticky header */}
        </div>
      </section>

      {/* Secondary column */}
      <aside className="lg:col-span-4 space-y-5 sm:space-y-6">
        <div className="bg-white border border-[#101010]/10 rounded-card-lg p-5 sm:p-6">
          {/* compact insights */}
        </div>
        <div className="bg-white border border-[#101010]/10 rounded-card-lg p-5 sm:p-6">
          {/* tasks / notifications */}
        </div>
      </aside>
    </div>
  </main>
</div>
```

### Notes for Dashboard Quality

- Avoid alternating page backgrounds inside the app; contrast should come from card surfaces and typography
- Keep scroll anchors stable using sticky headers for the top bar and subheader
- Use `tabular-nums` for KPIs and right-align amounts in tables
- Prefer subtle elevation via `shadow-premium-subtle` plus a 1px border, not heavy drop shadows
- Reserve serif headlines for top-level pages; inside flows, use sans for clarity
