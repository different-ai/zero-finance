import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getSettings } from '@/lib/screenpipe';

const WISE_API_URL = 'https://api.transferwise.com';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const settings = await getSettings();
        const { transferId } = req.body;

        if (!settings.wiseApiToken || !settings.wiseProfileId) {
            return res.status(400).json({ error: 'Wise API configuration missing' });
        }

        // Fund the transfer from Balance account
        const response = await axios.post(
            `${WISE_API_URL}/v3/profiles/${settings.wiseProfileId}/transfers/${transferId}/payments`,
            {
                type: 'BALANCE'
            },
            {
                headers: {
                    Authorization: `Bearer ${settings.wiseApiToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Failed to fund transfer:', error);
        return res.status(500).json({ error: 'Failed to fund transfer' });
    }
}
