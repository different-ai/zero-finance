# OG Image Troubleshooting Guide

## Current Status ✅

The OG image is **WORKING** on production at https://www.weloveyourstartup.com/startups/mediar

## Verification Steps

### 1. Check HTML Meta Tags

```bash
curl -s https://www.weloveyourstartup.com/startups/mediar | grep -E "(og:|twitter:)"
```

**Result**: ✅ All meta tags are present

- `og:image` → `https://weloveyourstartup.com/api/og?company=mediar`
- `og:title` → `Mediar - AI hands for every Windows desktop`
- `og:description` → Company description
- `twitter:image` → Same as og:image

### 2. Test OG Image API Directly

```bash
curl -I https://www.weloveyourstartup.com/api/og?company=mediar
```

**Result**: ✅ Returns HTTP 200 with `content-type: image/png`

### 3. View Generated Image

Visit directly in browser: https://www.weloveyourstartup.com/api/og?company=mediar

## What We Tried

### Approach 1: Next.js 15 Native `opengraph-image.tsx`

**Location**: `/app/startups/[slug]/opengraph-image.tsx`
**Status**: ❌ Not working reliably
**Issues**:

- Requires edge runtime support
- May not be properly configured on Vercel
- Build warning: "Using edge runtime on a page currently disables static generation"

### Approach 2: API Route (CURRENT - WORKING)

**Location**: `/app/api/og/route.tsx`
**Status**: ✅ Working
**Benefits**:

- Direct URL access for testing
- Battle-tested approach
- Works on all hosting platforms
- No edge runtime dependencies

## Current Implementation Details

### Beautiful OG Image Design

The API route generates a 1200x630px image with:

- **Zero Finance branding**: Blue "0" logo + "finance" text
- **Company logo**: Placeholder "M" in gradient box (SVGs can't be loaded in ImageResponse)
- **Founders**: All 3 co-founders with initials and roles
- **Stats cards**:
  - Funding amount with gradient text
  - Potential savings with blue gradient background
- **Gradient background**: Subtle decorative circles
- **Professional typography**: System fonts with proper hierarchy

### Meta Tags Configuration

```typescript
// In /app/startups/[slug]/page.tsx
openGraph: {
  title: `${company.name} - ${company.tagline}`,
  description: company.description,
  images: [{
    url: `https://weloveyourstartup.com/api/og?company=${params.slug}`,
    width: 1200,
    height: 630,
  }],
}
```

## Common Issues & Solutions

### Issue: OG Image Not Showing on Social Media

**Possible Causes**:

1. **Social media caching**: Platforms cache OG images aggressively
2. **URL mismatch**: Incorrect domain or path
3. **SSL issues**: Some platforms require HTTPS

**Solutions**:

1. Use Facebook Sharing Debugger to clear cache: https://developers.facebook.com/tools/debug/
2. Use Twitter Card Validator: https://cards-dev.twitter.com/validator
3. Use LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

### Issue: Image Not Generating

**Possible Causes**:

1. **Edge runtime not configured**: Vercel needs proper configuration
2. **ImageResponse limitations**: Can't load external images/SVGs
3. **Data not found**: Company ID doesn't exist

**Solutions**:

1. Use API route instead of native opengraph-image.tsx
2. Use inline styles and gradients instead of external assets
3. Add fallback for missing companies

## Testing Checklist

- [x] HTML contains correct meta tags
- [x] OG image URL returns 200 status
- [x] Image renders when accessed directly
- [x] Title focuses on startup, not "We Love Your Startup"
- [x] Description is company-specific
- [x] Image shows company branding
- [x] Image shows founders
- [x] Image shows funding stats
- [x] Zero Finance branding is subtle

## File Structure

```
packages/weloveyourstartup/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── og/
│   │   │       └── route.tsx          # ✅ Working OG image generator
│   │   └── startups/
│   │       └── [slug]/
│   │           ├── page.tsx            # Meta tags configuration
│   │           └── opengraph-image.tsx # ❌ Not used (Next.js 15 native)
│   └── data/
│       └── companies.json              # Company data with logo field
```

## Deployment Configuration

### Vercel Settings Required

- ✅ Edge Functions enabled
- ✅ Node.js 18+ runtime
- ✅ Environment variables (if any)

### Build Output

```
Route (app)                              Size
├ ƒ /api/og                              136 B (Edge Function)
├ ● /startups/[slug]                     6.33 kB (SSG)
└ ƒ /startups/[slug]/opengraph-image     0 B (Not used)
```

## Next Steps

1. **Monitor Performance**: Check Vercel Function logs for any errors
2. **Add Real Logos**: When possible, convert logos to base64 or use web fonts
3. **A/B Test**: Try different designs to see what gets more clicks
4. **Add Analytics**: Track OG image views vs page visits

## Resources

- [Next.js OG Image Generation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- [Vercel OG Playground](https://og-playground.vercel.app/)
- [@vercel/og Documentation](https://vercel.com/docs/functions/edge-functions/og-image-generation)
- [Open Graph Protocol](https://ogp.me/)

---

Last Updated: September 2025
Status: ✅ Working in Production
