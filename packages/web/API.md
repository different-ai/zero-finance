# Request Invoice Web API Documentation

## API Endpoints

### File Extraction API

**Endpoint:** `/api/file-extraction`

**Method:** `POST`

**Description:** Extracts text and invoice information from PDF files and images using OpenAI's GPT-4o vision capabilities.

**Request Format:**
- Content-Type: `multipart/form-data`
- Body:
  - `file`: The PDF or image file to process (required)

**Supported File Types:**
- PDF (application/pdf)
- JPEG/JPG (image/jpeg, image/jpg)
- PNG (image/png)
- WebP (image/webp)

**Limitations:**
- Maximum file size: 25MB
- Rate limits may apply based on OpenAI API usage

**Response:**
```json
{
  "success": true,
  "extractedText": "The extracted text from the document",
  "filename": "original-filename.pdf"
}
```

**Error Responses:**
- 400 Bad Request - Invalid request format or file
- 413 Payload Too Large - File exceeds size limit
- 415 Unsupported Media Type - Unsupported file type
- 500 Internal Server Error - Processing error

**Example Usage:**

```javascript
// Using the Fetch API
const formData = new FormData();
formData.append('file', pdfFile);

const response = await fetch('/api/file-extraction', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
```

**OpenAI Responses API Integration:**

This endpoint uses OpenAI's `gpt-4o` model with the new Responses API to process documents natively:

```javascript
// Internal implementation with @ai-sdk/openai Responses API
const result = await openai.responses('gpt-4o').chat({
  messages: [
    {
      role: 'system',
      content: 'You are an AI assistant that extracts invoice information from documents.',
    },
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'Extract invoice information from this document...',
        },
        {
          type: 'file',
          data: Buffer.from(fileBytes),
          mimeType: file.type,
          filename: file.name,
        },
      ],
    },
  ],
  providerOptions: {
    openai: {
      strictSchemas: true,
      reasoningEffort: 'high',
    },
  },
});
```

### Invoice Chat API

**Endpoint:** `/api/invoice-chat`

**Method:** `POST`

**Description:** AI-powered chat interface for invoice processing and information extraction.

**Tools Available:**
- `screenpipeSearch`: Searches for OCR data from screen captures
- `invoiceAnswer`: Processes and structures invoice data

**Integration with File Upload:**
The chat API can be used in conjunction with the file extraction API to process documents and extract structured invoice data. After uploading a file, the extracted text is sent to the chat interface for further processing and organization.

## Client Integration

The file upload functionality can be integrated with the chat interface by:

1. Using the drag-and-drop zone in the chat UI
2. Clicking the "Upload a document" quick action button
3. Programmatically triggering the file input

After file upload, the AI will automatically process the document and extract invoice information that can be applied to invoice forms.