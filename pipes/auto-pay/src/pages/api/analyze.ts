import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import type { ScreenPipeResponse, ScreenPipeSearchResult } from '@/types/screenpipe';

const SCREENPIPE_API = 'http://localhost:3030';

interface FormattedOCRData {
    text: string;
    timestamp: string;
    appName: string;
    windowName: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Get analysis window from query params or default to 24 hours
        const analysisWindow = parseInt(req.query.analysisWindow as string) || 24;
        const startTime = new Date(Date.now() - analysisWindow * 60 * 60 * 1000).toISOString();

        // Query ScreenPipe's search API for OCR data
        const response = await axios.get<ScreenPipeResponse>(`${SCREENPIPE_API}/search`, {
            params: {
                content_type: 'ocr',
                start_time: startTime,
                limit: 10000,
            }
        });

        // Extract and format the OCR data
        const data: FormattedOCRData[] = response.data.data
            .filter((item: ScreenPipeSearchResult) => item.type === 'OCR')
            .map((item: ScreenPipeSearchResult) => ({
                text: item.content.text,
                timestamp: item.content.timestamp,
                appName: item.content.app_name,
                windowName: item.content.window_name
            }));

        res.status(200).json({ data });
    } catch (err) {
        console.error('Analysis failed:', err);
        res.status(500).json({ error: 'Analysis failed' });
    }
}
