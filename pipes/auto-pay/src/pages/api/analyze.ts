import { NextApiRequest, NextApiResponse } from 'next';
import { queryScreenData, getSettings } from '@/lib/screenpipe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const settings = await getSettings();
        const data = await queryScreenData(settings.analysisWindow);

        return res.status(200).json({ data });
    } catch (error) {
        console.error("Failed to analyze screen data:", error);
        return res.status(500).json(
            { error: "Failed to analyze screen data" },
            { status: 500 }
        );
    }
}
