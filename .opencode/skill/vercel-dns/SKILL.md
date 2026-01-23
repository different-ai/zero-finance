---
name: vercel-dns
description: Manage DNS records for domains hosted on Vercel using the Vercel CLI
license: MIT
compatibility: opencode
metadata:
  service: vercel
  category: infrastructure
---

## What I Do

Manage DNS records for domains hosted on Vercel, including:

- List existing DNS records
- Add new DNS records (A, AAAA, CNAME, TXT, MX, etc.)
- Remove DNS records
- Switch between Vercel teams/accounts

## Prerequisites

- Vercel CLI installed: `npm i -g vercel` or `brew install vercel-cli`
- Logged in: `vercel login`
- Domain must be on Vercel nameservers or have Vercel as DNS provider

## 0 Finance Project

For the 0 Finance project, always use `--scope prologe`:

```bash
vercel dns ls 0.finance --scope prologe
vercel logs www.0.finance --scope prologe
```

## Common Commands

### Check Login & Team

```bash
# Check who you're logged in as
vercel whoami

# List available teams
vercel teams ls

# Switch to a specific team (use slug, not display name)
vercel switch <team-slug>

# Or use --scope flag instead of switching
vercel domains ls --scope prologe
```

### List Domains & Records

```bash
# List all domains in current team/account
vercel domains ls --scope prologe

# List DNS records for a specific domain
vercel dns ls <domain> --scope prologe
```

### Add DNS Records

```bash
# Add A record
vercel dns add <domain> <subdomain> A <ip-address>

# Add CNAME record
vercel dns add <domain> <subdomain> CNAME <target>

# Add TXT record (use quotes for values with special chars)
vercel dns add <domain> <subdomain> TXT '<value>'

# Add MX record with priority
# NOTE: MX priority is a separate argument (not embedded in the value)
vercel dns add <domain> <subdomain> MX <mail-server> <priority>

# Add record at apex (root domain) - use empty string or @
vercel dns add <domain> '' TXT '<value>'
vercel dns add <domain> @ MX mail.example.com 10
```

### Remove DNS Records

```bash
# First list to get record ID
vercel dns ls <domain>

# Remove by record ID
vercel dns rm <record-id>

# Remove with confirmation skip
vercel dns rm <record-id> --yes
```

## Examples

### Add Email DNS Records (MX + SPF)

```bash
# Add MX record for receiving email
# WARNING: Setting MX at the apex (root) will route *all* inbound mail for the domain.
# If the domain already uses Google Workspace / Fastmail / etc, prefer a dedicated subdomain.
vercel dns add example.com '' MX inbound-smtp.us-east-1.amazonaws.com 10

# Safer: use a subdomain for inbound routing
vercel dns add example.com inbound MX inbound-smtp.us-east-1.amazonaws.com 10

# Add SPF record
vercel dns add example.com '' TXT 'v=spf1 include:amazonses.com ~all'
```

### Add DKIM Records for Email Authentication

```bash
# DKIM CNAME records (common for SES, Google Workspace, etc.)
vercel dns add example.com selector._domainkey CNAME selector.dkim.provider.com
```

### Add Domain Verification TXT Record

```bash
# Google/AWS/other service verification
vercel dns add example.com _amazonses TXT 'verification-token-here'
vercel dns add example.com '' TXT 'google-site-verification=token'
```

### Subdomain Setup

```bash
# Point subdomain to a service
vercel dns add example.com api CNAME api.service.com
vercel dns add example.com app A 192.0.2.1
```

## Troubleshooting

### "You don't have permission to list the domain record"

The domain is in a different team. List teams and switch:

```bash
vercel teams ls
vercel switch <correct-team-slug>
```

### Domain Not Listed

- Domain might be in a different team/account
- Domain might not have Vercel as nameservers
- Check with `vercel domains ls`

### Record Not Propagating

- DNS propagation can take up to 48 hours (usually 5-30 minutes)
- Check propagation: `dig +short <record-name> <record-type>` or use dnschecker.org
- Verify record was added: `vercel dns ls <domain>`

## Token Saving Tips

### Fast Verification With `dig`

When a third-party UI says "Looking for DNS records", verify what the public internet sees:

```bash
dig +short TXT resend._domainkey.example.com
dig +short TXT send.example.com
dig +short MX send.example.com
dig +short TXT example.com
```

## Tips

1. Always check which team you're in before making changes
2. Use single quotes around TXT values to preserve special characters
3. For apex/root domain records, use empty string `''` as subdomain
4. Record IDs are shown in `vercel dns ls` output - needed for removal
5. Some records (like those added by Vercel automatically) cannot be removed
