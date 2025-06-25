# Zero Finance: Exposed vs Hidden Features Diff

## 🟢 EXPOSED FEATURES (Visible in Sidebar)

These features are directly accessible from the main navigation sidebar:

### 1. **Overview** (`/dashboard`)
- **Icon**: LayoutDashboard
- **Purpose**: Main dashboard with account overview, balance, quick actions
- **Status**: Primary landing page after login

### 2. **AI Inbox** (`/dashboard/ai-inbox`)
- **Icon**: Inbox
- **Purpose**: Gmail integration with AI-powered email processing
- **Status**: Recently promoted to sidebar (was previously hidden)
- **Note**: Different from the original inbox at `/dashboard/inbox`

### 3. **Invoices** (`/dashboard/invoices`)
- **Icon**: FileText
- **Purpose**: List and manage Request Network invoices
- **Status**: Core feature, always visible

### 4. **Advanced/Settings** (`/dashboard/settings`)
- **Icon**: Settings
- **Purpose**: User settings, integrations, profile management
- **Sub-pages** (accessible via settings):
  - `/dashboard/settings/integrations` - Manage third-party integrations
  - `/dashboard/settings/kyc` - KYC status and management

---

## 🔴 HIDDEN FEATURES (Not in Sidebar but Accessible)

These pages exist and are functional but require direct URL access or navigation from other pages:

### Financial Features

1. **Earn Dashboard** (`/dashboard/earn`)
   - Fluidkey ERC-4626 vault integration
   - Deposit/withdraw for yield generation
   - Has sub-pages:
     - `/dashboard/earn/settings` - Earn module settings
     - `/dashboard/earn/component-test` - Test page

2. **Send USDC** (`/dashboard/send-usdc`)
   - Direct ERC-20 transfer interface
   - Quick action available from Overview page

3. **Virtual Account** (`/dashboard/virtual-account`)
   - Align virtual bank account management
   - ACH/IBAN account details

4. **Bank Dashboard** (`/dashboard/(bank)/`)
   - Legacy banking interface being integrated into main app

### Developer/Power User Tools

5. **Tools Section** (`/dashboard/tools/`)
   - Hidden from normal users
   - Contains:
     - `/dashboard/tools/earn-module/` - Earn module management
     - `/dashboard/tools/earn-module/auto-earn/` - Auto-earn configuration

6. **Safes Management** (`/dashboard/safes/`)
   - Direct Gnosis Safe management
   - Individual safe view: `/dashboard/safes/[safeAddress]/`

7. **Original Inbox** (`/dashboard/inbox`)
   - The original inbox implementation
   - Being replaced by AI Inbox but still accessible

### Experimental/Other

8. **AI Chat** (`/dashboard/ai/`)
   - Standalone AI assistant interface

9. **Create Invoice** (`/dashboard/create-invoice`)
   - Direct invoice creation form
   - Accessible from Invoices page

10. **Solana Integration** (`/dashboard/solana/`)
    - Experimental Solana features

### Settings Sub-routes (Hidden)

11. **Funding Sources** (`/settings/funding-sources/`)
    - Under authenticated route, not dashboard
    - Manage payment methods

---

## 📊 Summary Statistics

- **Exposed in Sidebar**: 4 main items
- **Hidden Features**: 11+ pages/sections
- **Hidden/Exposed Ratio**: ~2.75:1

## 🎯 Access Patterns

### Hidden features are accessed via:
1. **Direct URL** - Users must know the path
2. **Quick Actions** - Cards on Overview page (e.g., Send USDC)
3. **Secondary Navigation** - Links within other pages
4. **Banners/Promotions** - Temporary links (e.g., Earn dashboard banner)
5. **Settings Integration Tab** - Gateway to some hidden features

### Design Philosophy:
- **Simplicity First**: Only essential features in main navigation
- **Progressive Disclosure**: Advanced features hidden until needed
- **User Segmentation**: Power user tools completely hidden
- **Clean UX**: Avoid overwhelming new users with options

---

## 🔄 Recent Changes

1. **Inbox Promoted**: AI Inbox (`/dashboard/ai-inbox`) was recently added to sidebar
2. **Settings Renamed**: Changed from "Settings" to "Advanced" in sidebar
3. **Legacy Inbox**: Original inbox (`/dashboard/inbox`) remains hidden

---

*Last Updated: 2025-01-15* 