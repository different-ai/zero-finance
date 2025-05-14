# Earn Module Testing Guide

## Prerequisites

1. Ensure your local dev server is running:
   ```bash
   pnpm --filter web dev
   ```

2. Clear TypeScript cache and restart dev server if you encounter linter errors.

## Testing Flow

### 1. Navigating to Earn

- Access `/dashboard/earn` directly through the URL
- Alternatively, click the "Earn" link in the sidebar

### 2. Testing Stepper (Onboarding Flow)

When the earn module is not yet enabled:

#### Step 1: Enable Screen
- Verify the animation and UI for the Enable Card loads correctly
- Click "Turn It On" button
- Should automatically advance to the Allocation step

#### Step 2: Allocation Screen
- Test the slider functionality:
  - Drag to change percentage
  - Verify the percentage display updates
  - Check that the yearly gain estimates update
- Click "Next" to proceed to confirmation

#### Step 3: Confirmation Screen
- Verify the shown allocation and example calculations
- Check the "I get it" checkbox (should enable the Confirm button)
- Click "Confirm & Activate"
- Should navigate to the Dashboard view

### 3. Testing Dashboard

- Verify total balance, earning balance, and APY are displayed correctly
- Check that allocation percentage is shown
- Verify the "Settings" button navigates to the settings page

### 4. Testing Settings

- Navigate to `/dashboard/earn/settings`
- Test the allocation slider:
  - Change the percentage
  - Click "Save Allocation Changes"
  - Verify changes persist on return to Dashboard
- Test the "Pause Earn Module" button:
  - Click to disable
  - Should return to Stepper flow when navigating back to `/dashboard/earn`

## Bug Reporting

If you encounter any issues during testing:

1. Note the specific step where the issue occurs
2. Capture console errors (if any)
3. Document the expected vs. actual behavior
4. Include information about browser and environment

## Component Structure

- `page.tsx`: Decision component that shows either Stepper or Dashboard
- `stepper/Stepper.tsx`: Multi-step wizard for onboarding
- `dashboard/Dashboard.tsx`: Main view after enabling
- `settings/page.tsx`: Allocation adjustment and module control

The individual card components (`EnableCard`, `AllocationCard`, etc.) provide the actual UI for each step. 