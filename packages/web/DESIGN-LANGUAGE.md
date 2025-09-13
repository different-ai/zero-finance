## Layout Patterns

### App Dashboard Header

- Compact height 56-64px with sticky positioning when useful
- Serif headline optional and compact; prefer sans for day-to-day screens
- Title sizes: 24px on mobile, 28-32px on desktop
- Optional uppercase label above title for section context
- Keep background `#F7F7F2`; separate header with a 1px bottom border `border-[#101010]/10`
- Avoid hero-style full-bleed sections inside the app

### Content Sections

- Single background: use `#F7F7F2` for the app canvas
- Use white cards with 1px borders `border-[#101010]/10` for content blocks
- Spacing inside cards: `p-5 sm:p-6`; grid gaps `gap-5 sm:gap-6`
- Prefer full-width containers with internal max-widths on specific blocks rather than page-wide max-widths
- Keep vertical rhythm tight: `py-6 sm:py-8` for section bands when needed

## Examples in Practice

### Dashboard Shell Template

```jsx
<div className="min-h-screen bg-[#F7F7F2]">
  {/* Top app header */}
  <header className="sticky top-0 z-40 bg-[#F7F7F2] border-b border-[#101010]/10">
    <div className="h-[60px] flex items-center px-4 sm:px-6 max-w-[1400px] mx-auto">
      <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mr-3">dashboard</p>
      <h1 className="font-serif text-[28px] sm:text-[32px] leading-[1] text-[#101010]">overview</h1>
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
