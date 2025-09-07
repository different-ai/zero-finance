const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
const LOOPS_API_BASE_URL = 'https://app.loops.so/api/v1';

export const LoopsEvent = {
  KYC_APPROVED: 'kyc-approved',
  KYC_PENDING_REVIEW: 'kyc-pending-review',
  KYC_REQUIRES_MORE_DOCUMENTS: 'kyc-requires-more-document',
} as const;

export type LoopsEventName = (typeof LoopsEvent)[keyof typeof LoopsEvent];

class LoopsApiClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(apiKey = LOOPS_API_KEY, baseUrl = LOOPS_API_BASE_URL) {
    if (!apiKey) {
      console.warn(
        'LOOPS_API_KEY is not set. Loops functionality will be disabled.',
      );
      this.apiKey = 'placeholder-missing-api-key';
    } else {
      this.apiKey = apiKey;
    }
    this.baseUrl = baseUrl;
  }

  private async fetchWithAuth(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('Loops API request:', { url, method: options.method });

    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Loops API Error (${response.status}): ${errorBody}`);
        throw new Error(
          `Failed to call Loops API (Status: ${response.status})`,
        );
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching from Loops API:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to process response from Loops API: ${errorMessage}`,
      );
    }
  }

  /**
   * Send an event to Loops.
   * This can be used to trigger email campaigns or sequences.
   */
  async sendEvent(
    email: string,
    eventName: LoopsEventName,
    userId: string,
    eventProperties?: Record<string, string | number | boolean>,
  ): Promise<{ success: boolean; message?: string }> {
    if (!email) {
      console.warn('LoopsService: Email is required to send an event.');
      return { success: false, message: 'Email is required.' };
    }

    if (this.apiKey === 'placeholder-missing-api-key') {
      console.warn(
        'LoopsService: API key not configured. Skipping event send.',
      );
      return { success: false, message: 'Loops API key not configured.' };
    }

    const payload = {
      email,
      userId,
      eventName,
      ...eventProperties,
    };

    console.log('Sending event to Loops:', payload);

    try {
      const response = await this.fetchWithAuth('/events/send', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response.success) {
        console.log(
          `Successfully sent event '${eventName}' for ${email} to Loops.`,
        );
      }

      return response;
    } catch (error) {
      console.error(`Failed to send event for ${email} to Loops`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const loopsApi = new LoopsApiClient();
