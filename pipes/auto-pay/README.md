# HyprSQRL Auto-Pay Pipe

Automatically trigger bank transfers based on screen activity. The pipe monitors your screen for payment-related information and can initiate transfers through the Mercury API.

<img width="1312" alt="Screenshot 2025-01-11 at 21 02 08" src="https://github.com/user-attachments/assets/fa95538a-eab2-43da-9b7b-4652a924b55a" />

Right now it simplifies the preparation and requires human-in-the-loop to confirm the transfer.

> ⚠️ **Early Development Notice**: This pipe is in active development and subject to breaking changes. The API, UI, and functionality may change significantly as we improve the system.

## Features

- Real-time screen monitoring to detect payment information
- Automatic extraction of payment details:
  - Recipient name and email
  - Payment amount
  - Bank account details (routing and account numbers)
  - Business/Personal account type
- Secure bank transfer initiation via Mercury API
- Support for ACH transfers
- Automatic recipient management with duplicate detection
- Transfer requirement validation

## How it Works

The pipe follows a three-stage process:

1. **Browse & Monitor**
   - Continuously monitors your screen activity using screenpipe's OCR
   - Captures text from various sources (browsers, PDFs, emails)
   - Stores data locally for privacy and quick access

2. **Detect & Extract**
   - AI models analyze captured text to identify payment information
   - Extracts structured data like amounts, recipients, and bank details
   - Assigns confidence scores to detected payments
   - Presents findings for your review

3. **Prepare & Execute**
   - Validates extracted information against Mercury requirements
   - Creates or finds existing recipient records
   - Handles ACH transfer creation
   - Initiates transfer after your confirmation

## Setup & Testing

### Prerequisites
- OpenAI API key (for payment detection)
- Mercury API credentials:
  - API Key
  - Account access

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Testing Flow

1. **Configure Mercury API**
   Get your mercury API key and open the auto-pay pipe in the Screenpipe app.

2. **Test Payment Detection**
   - Open an invoice or payment details in your browser/PDF viewer
   - Click "Start Detection" in the Auto-Pay interface
   - Review detected payment information
   - Confidence scores help evaluate detection accuracy

3. **Test Transfer Creation**
   - Verify recipient information
   - Review transfer details
   - Confirm transfer creation
   - Monitor the process in Mercury dashboard

## Project Structure

- `src/agents` - AI agents for payment detection and preparation
  - `payment-detector-agent.ts` - Detects payment information from screen
  - `payment-preparer-agent.ts` - Prepares payments for execution
  - `tools` - Custom tools for agent use
- `src/app` - Next.js application routes
  - `api` - Backend API endpoints for Mercury integration
  - `page.tsx` - Main interface
- `src/components` - UI components
- `src/lib` - Utilities and service integrations
  - `mercury.ts` - Mercury API client
  - `settings.ts` - User settings management

## Privacy & Security

- 100% private, runs locally on your computer
- Uses local AI models (llama3.2, phi4, etc.)
- Requires ~5GB RAM including the screenpipe stack
- Sensitive data never leaves your machine
- Bank transfers require explicit user confirmation

## Current Development Focus

- Improving payment detection accuracy
- Adding support for additional payment providers
- Enhancing the user interface for payment review
- Implementing batch payment processing

## Future Improvements

- Multi-currency support via additional providers
- Enhanced OCR accuracy
- Batch payment processing
- Custom validation rules
- Integration with accounting software

<img width="1312" alt="Screenshot 2024-12-21 at 4 39 29 PM" src="https://github.com/user-attachments/assets/2e395762-198f-43e6-9e5a-2974b8e71fcf" />