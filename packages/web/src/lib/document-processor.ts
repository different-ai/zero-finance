/**
 * Client-side document processing utilities
 */

export interface ProcessedDocument {
  base64: string;
  mimeType: string;
  fileName: string;
  fileSize: number;
}

export async function processDocument(file: File): Promise<ProcessedDocument> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove data URL prefix to get pure base64
      const base64Data = base64.split(',')[1];
      
      resolve({
        base64: base64Data,
        mimeType: file.type,
        fileName: file.name,
        fileSize: file.size,
      });
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}