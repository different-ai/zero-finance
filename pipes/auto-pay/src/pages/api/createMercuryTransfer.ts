import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import type { PaymentInfo } from '../../types/wise';
import { toMercuryPaymentRequest, type MercuryPaymentResponse } from '../../types/mercury';
import { getAutoPaySettings } from './createTransfer';

const MERCURY_API_URL = 'https://api.mercury.com/api/v1';

// Mercury API error response type
interface MercuryErrorResponse {
  error: {
    message: string;
    type: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mercuryApiKey, mercuryAccountId } = await getAutoPaySettings();
  
  if (!mercuryApiKey || !mercuryAccountId) {
    return res.status(400).json({ error: 'Mercury credentials not configured' });
  }

  try {
    const { paymentInfo } = req.body as { paymentInfo: PaymentInfo };
    const mercuryPayment = toMercuryPaymentRequest(paymentInfo);

    // Create payment request using Mercury's API
    const response = await axios.post<MercuryPaymentResponse>(
      `${MERCURY_API_URL}/accounts/${mercuryAccountId}/send-money-requests`,
      mercuryPayment,
      {
        headers: {
          'Authorization': `Bearer ${mercuryApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return res.status(200).json({
      success: true,
      transfer: response.data,
      transferId: response.data.requestId
    });
  } catch (error: any) {
    console.error('Error creating Mercury transfer:', error.response?.data || error);
    
    // Handle Mercury API specific errors
    if (error.response?.data?.error) {
      const mercuryError = error.response.data as MercuryErrorResponse;
      return res.status(error.response.status).json({
        error: mercuryError.error.message,
        type: mercuryError.error.type
      });
    }
    
    // Handle network or other errors
    return res.status(error.response?.status || 500).json({
      error: error.message,
      type: 'INTERNAL_ERROR'
    });
  }
}
