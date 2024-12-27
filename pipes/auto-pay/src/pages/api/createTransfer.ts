import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getSettings } from '@/lib/screenpipe';
import type { PaymentInfo, WiseTransfer } from '@/types/wise';

const WISE_API_URL = 'https://api.transferwise.com';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const settings = await getSettings();
        const { paymentInfo } = req.body as { paymentInfo: PaymentInfo };

        if (!settings.wiseApiToken || !settings.wiseProfileId) {
            return res.status(400).json({ error: 'Wise API configuration missing' });
        }

        // Create transfer
        const transfer: WiseTransfer = {
            targetAccount: 0, // This should be retrieved from Wise API based on recipient
            quoteUuid: '', // This should be created first using Wise quote API
            customerTransactionId: `AUTO_PAY_${Date.now()}`,
            details: {
                reference: paymentInfo.referenceNote || 'Auto-generated payment',
                transferPurpose: 'verification.transfers.purpose.pay.bills',
                sourceOfFunds: 'verification.source.of.funds.other'
            }
        };

        const response = await axios.post(
            `${WISE_API_URL}/v1/transfers`,
            transfer,
            {
                headers: {
                    Authorization: `Bearer ${settings.wiseApiToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Failed to create transfer:', error);
        return res.status(500).json({ error: 'Failed to create transfer' });
    }
}
