declare module '@screenpipe/js' {
  export interface NodePipe {
    add(data: {
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
    }): Promise<void>;

    queryScreenpipe(params: {
      q: string;
      contentType: string;
      startTime: string;
      endTime: string;
      limit: number;
      includeFrames: boolean;
    }): Promise<any>;

    streamVision(includeFrames: boolean): Promise<any>;
  }

  export const pipe: NodePipe;
}
