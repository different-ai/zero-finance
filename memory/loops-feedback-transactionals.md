# loops feedback transactional emails

this file documents the loops transactional emails that need to be created for the feedback feature.

## required transactional emails

### 1. feedback notification to admin (ben@0.finance)
- **transactional id**: `clwkp3nqc00tml70p5x6qfhm8` (placeholder - replace with actual id from loops)
- **recipient**: ben@0.finance
- **data variables**:
  - `userEmail` - the email of the user submitting feedback
  - `feedback` - the feedback content
  - `submittedAt` - iso timestamp of when feedback was submitted

### 2. feedback copy to user
- **transactional id**: `clwkp3nqc00tml70p5x6qfhm9` (placeholder - replace with actual id from loops)
- **recipient**: user's email address
- **data variables**:
  - `feedback` - the feedback content they submitted
  - `submittedAt` - iso timestamp of when feedback was submitted

## setup instructions

1. log into loops dashboard
2. create two new transactional emails with the templates
3. replace the placeholder transactional ids in `packages/web/src/server/routers/feedback-router.ts`
4. test the feedback flow

## email templates suggestions

### admin notification template
```
subject: new feedback from {userEmail}

hi ben,

you've received new feedback from {userEmail}:

{feedback}

submitted at: {submittedAt}

best,
0 finance
```

### user copy template
```
subject: thank you for your feedback

thank you for taking the time to share your feedback with us.

here's a copy of what you submitted:

{feedback}

submitted at: {submittedAt}

we'll review your feedback and use it to improve 0 finance.

best,
the 0 finance team
``` 