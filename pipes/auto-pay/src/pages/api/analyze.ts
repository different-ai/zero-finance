import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import type {
  ScreenPipeResponse,
  ScreenPipeSearchResult,
} from '@/types/screenpipe';

const SCREENPIPE_API = 'http://localhost:3030';

interface FormattedOCRData {
  text: string;
  timestamp: string;
  appName: string;
  windowName: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get analysis window from query params or default to 24 hours
    const analysisWindow = parseInt(req.query.analysisWindow as string) || 24;
    // if dev use last 10 minutes
    const isDev = process.env.NODE_ENV === 'development';
    const startTime = isDev
      ? new Date(Date.now() - 10 * 60 * 1000).toISOString()
      : new Date(Date.now() - analysisWindow * 60 * 60 * 1000).toISOString();

    // Query ScreenPipe's search API for OCR data
    const response = await axios.get<ScreenPipeResponse>(
      `${SCREENPIPE_API}/search`,
      {
        params: {
          content_type: 'ocr',
          start_time: startTime,
          limit: 1000,
          app_name: 'Arc',
        },
      }
    );
    console.log(JSON.stringify(response.data), 'response.data', 'analyze');

    // Extract and format the OCR data
    const data: FormattedOCRData[] = response.data.data
      .map((item: ScreenPipeSearchResult) => ({
        text: item.content.text,
        timestamp: item.content.timestamp,
        appName: item.content.app_name,
        windowName: item.content.window_name,
      }));

    res.status(200).json({ data });
  } catch (err) {
    console.error('Analysis failed:', err);
    res.status(500).json({ error: 'Analysis failed' });
  }
}
