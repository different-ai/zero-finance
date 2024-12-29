export interface WiseTransfer {
    targetAccount: number;
    quoteUuid: string;
    customerTransactionId: string;
    details: {
        reference: string;
        transferPurpose?: string;
        sourceOfFunds?: string;
    };
}

export interface PaymentInfo {
    recipientName: string;
    recipientEmail?: string;
    amount: string;
    currency: string;
    referenceNote?: string;
    accountNumber?: string;
    routingNumber?: string;
}

export interface WiseSettings {
    wiseApiToken: string;
    wiseProfileId: number;
    analysisWindow: number;
}
