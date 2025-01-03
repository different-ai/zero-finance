# Request Invoice Web App Architecture

## Overview
A standalone web application for viewing and paying Request Network invoices. The app takes a request ID as a parameter and displays the invoice details with payment options.

## Core Components

### 1. Request Network Integration
- **RequestService**: A service class similar to the desktop app's implementation but focused on viewing and payment
  - Methods:
    - `getRequestById(requestId: string)`: Fetch invoice details
    - `getPaymentOptions(request: Request)`: Get available payment methods
    - `processPayment(request: Request, method: PaymentMethod)`: Handle payment

### 2. Components
- **InvoiceViewer**: Main component for displaying invoice details
  - Props: `requestId: string`
  - Features:
    - Display invoice information
    - Show payment status
    - List payment options
- **PaymentOptions**: Component for handling payments
  - Props: `request: Request`
  - Features:
    - Display available payment methods
    - Handle payment processing
    - Show payment confirmation

### 3. Routing
- URL structure: `/:requestId`
- Query parameters for additional options

## Technical Stack
- Vite + React
- TypeScript
- Request Network SDK (@requestnetwork/request-client.js)
- shadcn/ui components
- Tailwind CSS

## Data Flow
1. User visits URL with request ID
2. App fetches request details using Request Network SDK
3. InvoiceViewer displays invoice information
4. User selects payment option
5. Payment is processed through Request Network

## Implementation Plan
1. Set up project structure
2. Implement RequestService
3. Create InvoiceViewer component
4. Add payment functionality
5. Style with Tailwind and shadcn/ui
6. Add error handling and loading states

## Security Considerations
- Validate request IDs
- Secure payment processing
- Handle wallet connections safely
- Protect sensitive invoice data
