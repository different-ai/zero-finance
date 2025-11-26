# UI Changes - November 25, 2024

> Task handoff document for implementing UI improvements based on product sync meeting.

## Context

These changes aim to:

- Reduce friction for new users (don't overwhelm with verification prompts)
- Clarify confusing company names on bank transfers
- Use progressive disclosure based on user's banking preference (crypto vs traditional)
- Follow the bimodal design system documented in `DESIGN-LANGUAGE.md`

---

## Changes to Implement

### 1. Virtual Account Onboarding Layer

**File:** `src/app/(authenticated)/dashboard/(bank)/components/dashboard/virtual-account-onboarding-layer.tsx`

**Current State:**

- Shows "Start earning today, deposit USDC or USD to begin" in a green box
- Shows "Complete verification to unlock" section with benefits list (remove $10k limit, enable bank transfers, etc.)
- Has "Complete Verification" and "Deposit Now" buttons

**Required Changes:**

- Remove the green "Start earning today" box entirely
- Remove the "Complete verification to unlock" section and the benefits list (`<ul>` with CheckCircle icons)
- Replace with just showing **Savings** content directly
- Add a simple **prompt/button that opens Account Info dialog** when clicked
- Keep "Deposit Now" button

---

### 2. Account Info Dialog - Provider Clarification Notes

**File:** `src/components/virtual-accounts/banking-instructions-display.tsx`

**Current State:**

- Shows banking instructions (ACH routing/account numbers, IBAN details)
- Users see "DifferentAI Inc." on their bank statements and don't understand what it is

**Required Changes:**

- Add a note/alert **below US ACH banking instructions**:
  > "DifferentAI Inc. is the company name of Zero Finance"
- Add a note/alert **below Euro IBAN banking instructions**:
  > "Bridge is our banking partner for EUR transfers"

**Styling:** Use a subtle info alert style consistent with `DESIGN-LANGUAGE.md` (e.g., `bg-[#1B29FF]/5 border border-[#1B29FF]/10` with appropriate text styling)

---

### 3. Account Info Dialog - Move "Advanced" Section to Bottom

**File:** `src/app/(authenticated)/dashboard/savings/components/checking-actions-card.tsx`

**Current State:**

- The "Advanced" section showing wallet/USDC addresses is currently inside `DialogHeader` (around lines 674-744)
- It appears near the top of the Account Info dialog

**Required Changes:**

- Move the entire "Advanced Account Details Section" block from inside `DialogHeader` to **after** the `BankingInstructionsDisplay` component
- It should be at the **very bottom** of the dialog content, before the demo mode notice
- Keep all existing functionality (toggle, copy buttons, etc.)

**Current structure:**

```
DialogHeader
  ├── Title
  └── Advanced Details Section  <-- MOVE THIS
DialogContent
  ├── Loading skeleton OR
  ├── BankingInstructionsDisplay OR
  ├── "No virtual bank accounts" message
  └── Demo mode notice
```

**Target structure:**

```
DialogHeader
  └── Title only
DialogContent
  ├── Loading skeleton OR
  ├── BankingInstructionsDisplay OR
  ├── "No virtual bank accounts" message
  ├── Advanced Details Section  <-- MOVED HERE
  └── Demo mode notice
```

---

### 4. Bimodal Toggle Controls "Advanced" Label & Visibility

**Files:**

- `src/app/(authenticated)/dashboard/savings/components/checking-actions-card.tsx`
- `src/components/virtual-accounts/banking-instructions-display.tsx`

**Current State:**

- "Advanced" button/toggle shows wallet addresses
- Label is always "Advanced" regardless of user mode

**Required Changes:**

- Access `isTechnical` from `useBimodal()` hook
- When `isTechnical === true` ("I bank in crypto"):
  - Change label from "Advanced" to **"USDC"**
  - Consider showing the section more prominently (not collapsed by default)
- When `isTechnical === false` ("I bank in dollars"):
  - Keep label as **"Advanced"**
  - Keep collapsed/hidden by default (current behavior)

**Import needed:**

```typescript
import { useBimodal } from '@/components/ui/bimodal';
```

**Usage:**

```typescript
const { isTechnical } = useBimodal();
// Then use isTechnical to conditionally render label and default state
```

---

### 5. Remove Fake Blockchain/Latency Data

**File:** `src/app/(authenticated)/dashboard/savings/components/checking-actions-card.tsx`

**Current State:**

- There may be hardcoded/placeholder blockchain or latency data displayed

**Required Changes:**

- Audit the file for any hardcoded test data
- Remove placeholder blockchain data, latency metrics, or transaction hashes that aren't real
- If real-time data is needed, ensure it comes from actual API calls

---

### 6. Styling Consistency Audit

**Files to audit:**

- `src/components/virtual-accounts/banking-instructions-display.tsx`
- `src/app/(authenticated)/dashboard/(bank)/components/dashboard/onboarding-tasks-card.tsx`
- `src/app/(authenticated)/dashboard/savings/components/checking-actions-card.tsx`

**Check against `DESIGN-LANGUAGE.md` for:**

| Element           | Banking Mode                                                | Technical Mode                                                          |
| ----------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------- |
| Borders           | `border-[#101010]/10`                                       | `border-[#1B29FF]/20`                                                   |
| Card radius       | `rounded-[12px]`                                            | `rounded-sm`                                                            |
| Shadow            | `shadow-[0_2px_8px_rgba(16,16,16,0.04)]`                    | `shadow-none`                                                           |
| Labels            | `uppercase tracking-[0.14em] text-[11px] text-[#101010]/60` | `font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase`         |
| Buttons (primary) | `bg-[#1B29FF] text-white px-6 py-3 rounded-md`              | `border border-[#1B29FF] text-[#1B29FF] font-mono px-4 py-2 rounded-sm` |

---

## Reference Files

- **Design Language:** `packages/web/DESIGN-LANGUAGE.md` - Full styling guide and bimodal system documentation
- **Bimodal Components:** `packages/web/src/components/ui/bimodal.tsx` - Core bimodal system with hooks and components

---

## Testing Checklist

- [x] Virtual account onboarding shows simplified view
- [x] Account Info dialog opens from new prompt
- [x] "DifferentAI Inc." note appears below US ACH instructions
- [ ] "Bridge" note appears below EUR IBAN instructions
- [ ] Advanced/USDC section is at bottom of Account Info dialog
- [ ] Label changes based on bimodal toggle state
- [ ] No fake/placeholder blockchain data visible
- [ ] All styling matches DESIGN-LANGUAGE.md
- [x] Vault names switch based on bimodal mode (banking shows displayName, technical shows name + contract link)
- [ ] Works correctly in both banking and technical modes
- [ ] Mobile responsive

---

## Questions?

Refer to `DESIGN-LANGUAGE.md` for detailed styling patterns and the bimodal interface system ("The DeFi Mullet").
