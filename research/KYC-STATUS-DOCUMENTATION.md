# KYC Status Documentation

## Overview

This document outlines all KYC (Know Your Customer) status states in the system and how they are represented in the UI and through email notifications.

## KYC Status States

### Main Status: `pending`

The pending status has three sub-statuses that provide more granular information about the KYC process:

#### 1. `kyc_form_submission_started`

**What it means:** Customer has initiated the KYC process and started filling out their details

**UI Representation (Onboarding Card):**

- **Icon:** Gray circle icon
- **Title:** "Verify Your Identity"
- **Description:** "Complete KYC to verify your identity and unlock high-yield banking."
- **Action Button:** "Complete KYC"

**Admin Panel Display:**

- Shows "pending" status with sub-text "Form started"

**Email Notification:**

- No email sent at this stage

---

#### 2. `kyc_form_submission_accepted`

**What it means:** Customer has successfully completed the KYC flow and documents have been accepted for review

**UI Representation (Onboarding Card):**

- **Icon:** Blue spinning loader icon
- **Title:** "Verification in Review"
- **Description:** "Your verification has been submitted successfully and is under review."
- **Action Button:** "Check Status" (outline style)

**Admin Panel Display:**

- Shows "pending" status with sub-text "Under review"

**Email Notification:**

- No immediate email (waiting for final decision)

---

#### 3. `kyc_form_resubmission_required` ⚠️

**What it means:** Additional information or documents needed after internal review

**UI Representation (Onboarding Card):**

- **Icon:** Yellow warning triangle icon
- **Title:** "Additional Documents Required"
- **Description:** "We need additional documents to complete your verification. Please check your email for details."
- **Action Button:** "Submit Documents"

**Admin Panel Display:**

- Shows "pending" status with sub-text "Needs resubmission"

**Email Notification:**

- **Event:** `kyc-requires-more-document`
- **Data sent:** `url` parameter containing the KYC flow link for resubmission
- **Timing:** Sent immediately when sub-status changes

---

### Main Status: `approved` ✅

**What it means:** KYC verification has been successfully completed

**UI Representation (Onboarding Card):**

- **Icon:** Green checkmark icon
- **Title:** "Identity Verified"
- **Description:** "Your identity has been successfully verified."
- **Action Button:** None (process complete)

**Admin Panel Display:**

- Shows "approved" in green text

**Email Notification:**

- **Event:** `kyc-approved`
- **Data sent:** Completion timestamp
- **Timing:** Sent immediately when status changes to approved

---

### Main Status: `rejected` ❌

**What it means:** KYC verification has been rejected

**UI Representation (Onboarding Card):**

- **Icon:** Red alert triangle icon
- **Title:** "Action Required"
- **Description:** "There was an issue with your identity verification. Please review the details and resubmit."
- **Action Button:** "Retry Verification"

**Admin Panel Display:**

- Shows "rejected" in red text

**Email Notification:**

- No automatic email for rejection (requires manual intervention)

---

## Special Cases

### No KYC Started (null/none status)

**What it means:** User has not initiated any KYC process

**UI Representation (Onboarding Card):**

- **Icon:** Gray circle icon
- **Title:** "Verify Your Identity"
- **Description:**
  - If Smart Account not created: "Create your smart account first to unlock identity verification."
  - If Smart Account created: "Complete KYC to verify your identity and unlock high-yield banking."
- **Action Button:** "Complete KYC" (only shown if Smart Account exists)

**Admin Panel Display:**

- Shows "N/A"

**Email Notification:**

- No email

### `kycMarkedDone` Flag

**What it means:** User manually marked KYC as complete but it's still under review

**UI Representation:**

- Same as `kyc_form_submission_accepted` but with modified description
- **Description:** "You've marked your KYC as complete. We are actively reviewing your submission."

---

## Email Notification Summary

| Event Name                   | Trigger                                                | Data Included                      | Purpose                                |
| ---------------------------- | ------------------------------------------------------ | ---------------------------------- | -------------------------------------- |
| `kyc-approved`               | Status changes to `approved`                           | Completion timestamp, KYC provider | Notify user of successful verification |
| `kyc-requires-more-document` | Sub-status changes to `kyc_form_resubmission_required` | URL with KYC flow link             | Request additional documents from user |

### Emails NOT Sent Automatically

- Initial form start (`kyc_form_submission_started`)
- Form submission accepted (`kyc_form_submission_accepted`)
- Rejection (`rejected`) - requires manual follow-up

---

## Visual Design System

### Color Coding

- **Green (#22c55e):** Approved/Complete states
- **Yellow (#eab308):** Pending/Needs attention states
- **Red (#ef4444):** Rejected/Error states
- **Blue (#0050ff):** In progress/Under review states
- **Gray (#9ca3af):** Not started/Disabled states

### Icon System

- **CheckCircle:** Process completed successfully
- **AlertTriangle:** Action required or warning
- **Loader2 (spinning):** Process in progress
- **Circle:** Process not started

---

## State Transitions

```
[No KYC]
    ↓
[kyc_form_submission_started]
    ↓
[kyc_form_submission_accepted]
    ↓
    ├→ [approved] ✅ (Email sent)
    ├→ [rejected] ❌
    └→ [kyc_form_resubmission_required] ⚠️ (Email sent)
           ↓
       (User resubmits)
           ↓
       [kyc_form_submission_accepted]
```

---

## Implementation Files

### Core Files Modified

1. **Loops Service:** `packages/web/src/server/services/loops-service.ts`

   - Added `KYC_REQUIRES_MORE_DOCUMENTS` event type

2. **KYC Notifications Cron:** `packages/web/src/app/api/cron/kyc-notifications/route.ts`

   - Handles status monitoring and email triggers

3. **Onboarding UI:** `packages/web/src/app/(authenticated)/dashboard/(bank)/components/dashboard/onboarding-tasks-card.tsx`

   - Displays current KYC status to users

4. **Admin Panel:** `packages/web/src/components/admin/admin-panel.tsx`
   - Shows detailed KYC status and sub-status information

---

## Testing Checklist

- [ ] User can initiate KYC process
- [ ] UI updates when status changes to `kyc_form_submission_accepted`
- [ ] Email sent when status changes to `approved`
- [ ] Email sent when sub-status changes to `kyc_form_resubmission_required`
- [ ] User can access resubmission link from email
- [ ] Admin panel shows correct status and sub-status
- [ ] Status transitions are properly tracked in database
- [ ] Cron job successfully detects status changes

---

## Notes

- The system uses eventual consistency for KYC status updates
- Cron job runs periodically to check for status changes from Align API
- All KYC flow links are provided by Align and stored in the database
- Email notifications are sent via Loops integration
- The `kycMarkedDone` flag is used for manual override scenarios
