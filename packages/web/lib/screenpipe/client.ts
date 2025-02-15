import { pipe } from '@screenpipe/js';

export interface OCRResult {
  text: string;
  text_json: string;
  ocr_engine: string;
  focused: boolean;
}

export interface Frame {
  timestamp: string;
  file_path: string;
  app_name: string;
  window_name: string;
  ocr_results: OCRResult[];
}

export interface OCRRecord {
  content?: {
    data?: {
      frames: Frame[];
    };
  };
}

export interface VisionEvent {
  data: {
    text: string;
    app_name: string;
    window_name: string;
    timestamp: string;
    image?: string; // base64 if includeImages=true
  };
}

export class ScreenPipeClient {
  private visionStream: AsyncIterableIterator<VisionEvent> | null = null;

  async *streamOCR(includeImages = false): AsyncIterableIterator<VisionEvent> {
    try {
      if (!pipe) {
        console.error('Screenpipe client not initialized');
        return;
      }

      this.visionStream = await pipe.streamVision(includeImages);
      console.log('Vision stream initialized');
      if (this.visionStream) {
        for await (const event of this.visionStream) {
          yield event;
        }
      }
    } catch (error) {
      console.error('Error streaming OCR data:', error);
    } finally {
      this.visionStream = null;
    }
  }

  stopStream() {
    this.visionStream = null;
  }

  // Keep the query method for historical data
  async queryOCRData(params: {
    q: string;
    contentType: string;
    startTime: string;
    endTime: string;
    limit: number;
    includeFrames: boolean;
  }): Promise<OCRRecord[]> {
    try {
      if (!pipe) {
        console.error('Screenpipe client not initialized');
        return [];
      }

      const result = await pipe.queryScreenpipe(params);
      if (!result) {
        console.log('No results from Screenpipe query');
        return [];
      }

      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Error querying Screenpipe:', error);
      return [];
    }
  }
}

export const screenPipe = new ScreenPipeClient();

export const addOCRData = async (device: string, frames: Frame[]) => {
  try {
    if (!pipe) {
      console.error('Screenpipe client not initialized');
      return null;
    }

    return await pipe.add({
      device,
      content: {
        content_type: "frames",
        data: { frames }
      }
    });
  } catch (error) {
    console.error('Error adding OCR data:', error);
    return null;
  }
};

export const queryOCRData = async (params: {
  q: string;
  startTime?: string;
  endTime?: string;
  limit?: number;
}) => {
  try {
    if (!pipe) {
      console.error('Screenpipe client not initialized');
      return [];
    }

    const result = await pipe.queryScreenpipe({
      q: params.q,
      contentType: "ocr",
      startTime: params.startTime || new Date(Date.now() - 60000).toISOString(), // Default to last minute
      endTime: params.endTime || new Date().toISOString(), // Default to now
      limit: params.limit || 10,
      includeFrames: false,
    });

    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error('Error querying OCR data:', error);
    return [];
  }
};

export const streamOCRData = async (includeFrames = false) => {
  try {
    if (!pipe) {
      console.error('Screenpipe client not initialized');
      return null;
    }
    return pipe.streamVision(includeFrames);
  } catch (error) {
    console.error('Error streaming OCR data:', error);
    return null;
  }
}; 