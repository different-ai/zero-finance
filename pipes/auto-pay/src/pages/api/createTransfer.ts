import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import type { PaymentInfo } from '@/types/wise';

const WISE_API = 'https://api.sandbox.transferwise.tech';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { paymentInfo } = req.body as { paymentInfo: PaymentInfo };
        
        // Get Wise API token and profile ID from environment variables
        const wiseToken = process.env.WISE_API_TOKEN;
        const profileId = process.env.WISE_PROFILE_ID;

        if (!wiseToken || !profileId) {
            throw new Error('Missing Wise API configuration');
        }

        // Generate a unique customer transaction ID
        const customerTransactionId = `transfer-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        // Create a quote for the transfer
        const quoteResponse = await axios.post(
            `${WISE_API}/v3/profiles/${profileId}/quotes`,
            {
                sourceCurrency: paymentInfo.currency,
                targetCurrency: paymentInfo.currency, // Same currency transfer
                sourceAmount: parseFloat(paymentInfo.amount),
                targetAmount: null, // Not needed for same currency
                paymentMetadata: {
                    transferPurpose: 'verification.transfers.purpose.pay.bills',
                    sourceOfFunds: 'verification.source.of.funds.other'
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${wiseToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Create recipient account
        const recipientResponse = await axios.post(
            `${WISE_API}/v1/accounts`,
            {
                currency: paymentInfo.currency,
                type: 'email',
                profile: profileId,
                accountHolderName: paymentInfo.recipientName,
                email: paymentInfo.recipientEmail || `${paymentInfo.recipientName.toLowerCase().replace(/\s+/g, '.')}@example.com`
            },
            {
                headers: {
                    Authorization: `Bearer ${wiseToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Create the transfer
        const transferResponse = await axios.post(
            `${WISE_API}/v1/transfers`,
            {
                targetAccount: recipientResponse.data.id,
                quoteUuid: quoteResponse.data.id,
                customerTransactionId,
                details: {
                    reference: paymentInfo.referenceNote || 'Auto-payment from ScreenPipe',
                    transferPurpose: 'verification.transfers.purpose.pay.bills',
                    sourceOfFunds: 'verification.source.of.funds.other'
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${wiseToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return res.status(200).json({
            success: true,
            transfer: transferResponse.data,
            transferId: transferResponse.data.id
        });
    } catch (err) {
        console.error('Failed to create transfer:', err);
        return res.status(500).json({ 
            error: 'Failed to create transfer',
            details: err instanceof Error ? err.message : 'Unknown error'
        });
    }
}
