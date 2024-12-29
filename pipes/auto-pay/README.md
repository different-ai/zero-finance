# Auto-Pay Pipe

Automatically trigger bank transfers based on screen activity. The pipe monitors your screen for payment-related information and can initiate transfers through the Wise API.

## Features

- Real-time screen monitoring to detect payment information
- Automatic extraction of payment details:
  - Recipient name and email
  - Payment amount and currency
  - Bank account details (routing and account numbers)
  - Reference notes and descriptions
- Secure bank transfer initiation via Wise API
- Support for both email and bank account transfers
- Automatic quote creation and recipient management
- Transfer requirement validation for different currency corridors

## How it Works

1. **Screen Analysis**: Uses screenpipe's OCR to analyze your screen activity in real-time
2. **Payment Detection**: Identifies payment-related information from various sources (invoices, emails, etc.)
3. **Data Extraction**: Extracts structured payment information using AI models
4. **Transfer Creation**: Automatically creates and executes transfers through Wise:
   - Creates quotes for currency conversion
   - Manages recipient accounts
   - Validates transfer requirements
   - Initiates and funds transfers

## Privacy & Security

- 100% private, runs locally on your computer
- Uses local AI models (llama3.2, phi4, etc.)
- Requires ~5GB RAM including the screenpipe stack
- Sensitive data never leaves your machine
- Bank transfers require explicit user confirmation

## Example Use Cases

- Automating recurring vendor payments
- Processing invoices from emails
- Handling international transfers
- Managing contractor payments

<img width="1312" alt="Screenshot 2024-12-21 at 4 39 29 PM" src="https://github.com/user-attachments/assets/2e395762-198f-43e6-9e5a-2974b8e71fcf" />
