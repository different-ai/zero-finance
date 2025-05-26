# Mock Data: Align KYC Form Demo

## Overview
This file documents the mock implementation of the Align KYC form with email field functionality.

## Changes Made:

1. **Email Field Integration in KYC Form**
   - Added email field to the KYC form schema
   - Pre-fills email from user profile (via `api.user.getProfile.useQuery()`)
   - Falls back to Privy email if profile email is not available
   - Email field is editable, allowing users to change it

2. **Email Update on Form Submission**
   - When user changes the email in the form, it updates the database via `api.user.updateEmail.useMutation()`
   - This happens before the KYC initiation process

3. **Form Flow**:
   - User sees pre-filled form with:
     - First Name
     - Last Name  
     - Email (from profile or Privy)
     - Account Type (Individual/Business)
     - Business Name (if Business type selected)
   - User can edit any field including email
   - On submit:
     - If email changed, update it in database
     - Store all form data in localStorage
     - Initiate KYC process with Align

## Mock Scenario:
Since we couldn't log in with the test account due to OTP issues, here's what the implementation looks like:

```typescript
// Component gets email from two sources:
const { data: userProfile } = api.user.getProfile.useQuery();
const privyEmail = user?.email?.address || '';
const email = userProfile?.email || privyEmail; // Profile email takes precedence

// Form includes email field:
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email Address</FormLabel>
      <FormControl>
        <Input 
          type="email"
          placeholder="Enter your email address" 
          {...field} 
        />
      </FormControl>
      <FormDescription>
        This email will be used for verification and communication
      </FormDescription>
    </FormItem>
  )}
/>

// On submit, email is updated if changed:
if (data.email && data.email !== email) {
  await updateEmailMutation.mutateAsync({ email: data.email });
}
```

## Note:
This is a mock implementation. In production, the form would:
1. Load user profile data including email
2. Allow editing of all fields
3. Update email in database if changed
4. Pass user data to Align KYC process 