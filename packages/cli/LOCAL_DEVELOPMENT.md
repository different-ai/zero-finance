# Local Development Guide for Zero Finance CLI

## Quick Start

### 1. Configure CLI for Local Development

```bash
# Option 1: Use the script
npm run use:local

# Option 2: Use environment variables
export ZERO_API_URL=http://localhost:3000/api/trpc
export ZERO_WEB_URL=http://localhost:3000
npm start

# Option 3: Configure manually
npm run config -- --api-url http://localhost:3000/api/trpc --web-url http://localhost:3000
```

### 2. Start the Web App

In another terminal:
```bash
cd ../web
npm run dev
```

The web app should be running at http://localhost:3000

### 3. Authenticate

```bash
npm run auth:login
```

This will:
1. Open your browser to http://localhost:3000/cli-auth
2. Sign in if needed
3. Generate a token
4. Copy and paste the token into the CLI

### 4. Verify Authentication

```bash
npm run auth:status
```

You should see:
- ✓ Valid authentication token
- API: http://localhost:3000/api/trpc
- Web: http://localhost:3000
- Environment: Local Development

## Configuration Methods

### Method 1: Environment Variables (.env.local)

Create or edit `packages/cli/.env.local`:
```env
ZERO_API_URL=http://localhost:3000/api/trpc
ZERO_WEB_URL=http://localhost:3000
```

These are automatically loaded when the CLI starts.

### Method 2: CLI Configuration Command

```bash
# Set local URLs
npm run config -- --api-url http://localhost:3000/api/trpc --web-url http://localhost:3000

# Check current configuration
npm run config

# Reset to production
npm run config -- --reset
```

### Method 3: Helper Scripts

```bash
# Switch to local development
npm run use:local

# Switch back to production
npm run use:production
```

## Available NPM Scripts

- `npm run use:local` - Configure for localhost
- `npm run use:production` - Configure for production
- `npm run auth:login` - Authenticate
- `npm run auth:status` - Check auth status
- `npm run auth:logout` - Log out
- `npm run config` - Show/update configuration
- `npm test` - Run automated tests
- `npm run test:mock` - Run with mock auth

## Troubleshooting

### "Authentication failed" when using localhost

1. **Check the web app is running:**
   ```bash
   cd ../web
   npm run dev
   ```

2. **Verify you can access the web app:**
   Open http://localhost:3000 in your browser

3. **Check your configuration:**
   ```bash
   npm run config
   ```
   Should show:
   - API URL: http://localhost:3000/api/trpc
   - Web URL: http://localhost:3000

4. **Try logging out and back in:**
   ```bash
   npm run auth:logout
   npm run auth:login
   ```

### "Config file corrupted" message

This is normal when switching between versions. The CLI will create a new config automatically.

### Can't connect to API

1. Make sure the web app is running
2. Check that you're using the correct port (default is 3000)
3. If using a different port, update the configuration:
   ```bash
   npm run config -- --api-url http://localhost:YOUR_PORT/api/trpc --web-url http://localhost:YOUR_PORT
   ```

## Testing Without Real API

For testing CLI features without a running backend:
```bash
# Use the mock auth version
npm run test:mock

# Run specific commands
node test-cli-full.js auth login
node test-cli-full.js company
node test-cli-full.js balance
```

## Switching Between Environments

### To Local Development:
```bash
npm run use:local
npm run auth:login  # Re-authenticate for local
```

### To Production:
```bash
npm run use:production
npm run auth:login  # Re-authenticate for production
```

### Check Current Environment:
```bash
npm run config
# or
npm run auth:status
```

## Development Workflow

1. **Start both services:**
   ```bash
   # Terminal 1: Web app
   cd packages/web
   npm run dev
   
   # Terminal 2: CLI
   cd packages/cli
   npm run use:local
   npm run auth:login
   ```

2. **Make changes to CLI code**

3. **Test your changes:**
   ```bash
   npm start -- [your command]
   ```

4. **Run automated tests:**
   ```bash
   npm test
   ```

5. **Switch back to production when done:**
   ```bash
   npm run use:production
   ```
