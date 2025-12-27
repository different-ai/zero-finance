---
name: aws-ses-inbound
description: Set up AWS SES for receiving inbound emails with SNS webhook delivery
license: MIT
compatibility: opencode
metadata:
  service: aws
  category: email
---

## What I Do

Set up Amazon SES (Simple Email Service) for receiving inbound emails and forwarding them to a webhook via SNS (Simple Notification Service). This is commonly used for:

- AI email agents that process incoming emails
- Email-to-ticket systems
- Inbound email parsing APIs

## Prerequisites

- AWS CLI installed: `brew install awscli` or `pip install awscli`
- AWS credentials with SES and SNS permissions
- Domain with configurable DNS (for MX records)

## Credential Setup

Set credentials via environment variables:

```bash
export AWS_ACCESS_KEY_ID='AKIA...'
export AWS_SECRET_ACCESS_KEY='...'
export AWS_DEFAULT_REGION='us-east-1'
```

Or use AWS CLI profile:

```bash
aws configure --profile ses-admin
export AWS_PROFILE=ses-admin
```

## Supported Regions for SES Inbound

SES inbound email is only available in:

- `us-east-1` (N. Virginia)
- `us-west-2` (Oregon)
- `eu-west-1` (Ireland)

## Complete Setup Flow

### Step 1: Verify Domain in SES

```bash
# Register domain for verification
aws ses verify-domain-identity --domain example.com

# Response includes VerificationToken - add as TXT record:
# Name: _amazonses.example.com
# Value: <VerificationToken>
```

### Step 2: Get DKIM Tokens

```bash
# Get DKIM tokens for email authentication
aws ses verify-domain-dkim --domain example.com

# Response includes 3 DkimTokens - add as CNAME records:
# Name: <token>._domainkey.example.com
# Value: <token>.dkim.amazonses.com
```

### Step 3: Create SNS Topic

```bash
# Create topic for receiving email notifications
aws sns create-topic --name my-inbound-email-topic

# Save the TopicArn from response
```

### Step 4: Create SES Receipt Rule Set

```bash
# Create a rule set (container for rules)
aws ses create-receipt-rule-set --rule-set-name my-email-rules
```

### Step 5: Create Receipt Rule

```bash
# Create rule to forward emails to SNS
aws ses create-receipt-rule \
  --rule-set-name my-email-rules \
  --rule '{
    "Name": "forward-to-sns",
    "Enabled": true,
    "Recipients": ["example.com"],
    "Actions": [
      {
        "SNSAction": {
          "TopicArn": "arn:aws:sns:us-east-1:123456789:my-inbound-email-topic",
          "Encoding": "UTF-8"
        }
      }
    ],
    "ScanEnabled": true
  }'
```

### Step 6: Activate Rule Set

```bash
# Only one rule set can be active at a time
aws ses set-active-receipt-rule-set --rule-set-name my-email-rules
```

### Step 7: Subscribe Webhook to SNS

```bash
# Subscribe your HTTPS endpoint to the SNS topic
# IMPORTANT: Use --notification-endpoint, NOT --endpoint
# (--endpoint overrides the AWS API URL, which is NOT what you want)
aws sns subscribe \
  --topic-arn "arn:aws:sns:us-east-1:123456789:my-inbound-email-topic" \
  --protocol https \
  --notification-endpoint "https://example.com/api/email-webhook"
```

**Important**: Your webhook endpoint must handle the SNS subscription confirmation request. SNS sends a POST with:

- Header: `x-amz-sns-message-type: SubscriptionConfirmation`
- Body: JSON with `Type`, `SubscribeURL`, `Token`, etc.

Your endpoint must visit the `SubscribeURL` (make a GET request) to confirm the subscription.

## Required DNS Records

After running the SES commands, add these DNS records:

### Domain Verification (TXT)

```
Name: _amazonses.example.com
Type: TXT
Value: <VerificationToken from verify-domain-identity>
```

### DKIM Records (3 CNAMEs)

```
Name: <token1>._domainkey.example.com
Type: CNAME
Value: <token1>.dkim.amazonses.com

Name: <token2>._domainkey.example.com
Type: CNAME
Value: <token2>.dkim.amazonses.com

Name: <token3>._domainkey.example.com
Type: CNAME
Value: <token3>.dkim.amazonses.com
```

### MX Record (for receiving email)

```
Name: example.com (or subdomain like mail.example.com)
Type: MX
Priority: 10
Value: inbound-smtp.<region>.amazonaws.com
```

For us-east-1: `inbound-smtp.us-east-1.amazonaws.com`

## Checking Status

### Verify Domain Status

```bash
aws ses get-identity-verification-attributes --identities example.com
# VerificationStatus should be "Success"
```

### Check DKIM Status

```bash
aws ses get-identity-dkim-attributes --identities example.com
# DkimVerificationStatus should be "Success"
```

### List Receipt Rules

```bash
aws ses describe-active-receipt-rule-set
aws ses describe-receipt-rule --rule-set-name my-email-rules --rule-name forward-to-sns
```

### List SNS Subscriptions

```bash
aws sns list-subscriptions-by-topic --topic-arn "arn:aws:sns:..."
# SubscriptionArn should show confirmed ARN, not "PendingConfirmation"
```

## Webhook Payload Format

SNS sends JSON with this structure:

```json
{
  "Type": "Notification",
  "MessageId": "...",
  "TopicArn": "arn:aws:sns:...",
  "Message": "{\"notificationType\":\"Received\",\"content\":\"<raw MIME email>\",...}",
  "Timestamp": "...",
  "Signature": "...",
  "SigningCertURL": "..."
}
```

The `Message` field contains a JSON string with:

- `notificationType`: "Received" for incoming emails
- `content`: Raw MIME email content (needs parsing)
- `mail`: Metadata (messageId, source, destination, headers)

Use a library like `mailparser` (Node.js) or `email` (Python) to parse the MIME content.

## SNS Subscription Confirmation

When you first subscribe, SNS sends a confirmation request:

```json
{
  "Type": "SubscriptionConfirmation",
  "SubscribeURL": "https://sns.us-east-1.amazonaws.com/?Action=ConfirmSubscription&...",
  "Token": "...",
  "TopicArn": "..."
}
```

Your webhook must:

1. Detect `Type === "SubscriptionConfirmation"`
2. Make a GET request to the `SubscribeURL`
3. Return 200 OK

## Signature Verification

Always verify SNS message signatures in production:

1. Validate `SigningCertURL` is from `*.amazonaws.com`
2. Fetch the certificate
3. Build the canonical message string
4. Verify signature using the certificate's public key

## Troubleshooting

### "Domain not verified"

- Check TXT record: `dig _amazonses.example.com TXT`
- DNS propagation can take up to 72 hours (usually 5-30 min)

### "DKIM not verified"

- Check CNAME records: `dig <token>._domainkey.example.com CNAME`
- Ensure all 3 DKIM records are added

### Emails not arriving

- Verify MX record points to correct SES inbound server
- Check receipt rule set is active
- Verify recipient domain/address matches rule

### Webhook not receiving

- Check SNS subscription status (should not be "PendingConfirmation")
- Verify endpoint is publicly accessible via HTTPS
- Check endpoint handles SNS confirmation handshake
- Review CloudWatch logs for SNS delivery failures

### "Access Denied" errors

- Verify IAM user has `AmazonSESFullAccess` and `AmazonSNSFullAccess` policies
- Check region is correct (SES inbound only in us-east-1, us-west-2, eu-west-1)
