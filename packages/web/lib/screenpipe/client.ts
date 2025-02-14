import { pipe } from '@screenpipe/js';

export interface OCRFrame {
  id: string;
  app_name?: string;
  window_name?: string;
  ocr_results: Array<{
    text: string;
    text_json: string;
    ocr_engine: string;
    focused: boolean;
  }>;
}

export class ScreenPipeClient {
  private static instance: ScreenPipeClient;

  private constructor() {}

  static getInstance(): ScreenPipeClient {
    if (!this.instance) {
      this.instance = new ScreenPipeClient();
    }
    return this.instance;
  }

  async addOCRData(data: {
    device: string;
    content: {
      content_type: string;
      data: {
        frames: Array<{
          timestamp: string;
          file_path: string;
          app_name: string;
          window_name: string;
          ocr_results: Array<{
            text: string;
            text_json: string;
            ocr_engine: string;
            focused: boolean;
          }>;
        }>;
      };
    };
  }) {
    try {
      return await pipe.add(data);
    } catch (error) {
      console.error('Failed to add OCR data to screenpipe:', error);
      throw error;
    }
  }

  async queryOCRData(params: {
    q: string;
    contentType: string;
    startTime: string;
    endTime: string;
    limit: number;
    includeFrames: boolean;
  }) {
    try {
      return await pipe.queryScreenpipe(params);
    } catch (error) {
      console.error('Failed to query OCR data from screenpipe:', error);
      throw error;
    }
  }

  async streamVision(includeFrames = false) {
    try {
      return await pipe.streamVision(includeFrames);
    } catch (error) {
      console.error('Failed to stream vision from screenpipe:', error);
      throw error;
    }
  }
}

export const screenPipe = ScreenPipeClient.getInstance();  