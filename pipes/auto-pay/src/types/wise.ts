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
    amount: string;
    currency: string;
    referenceNote?: string;
}

export interface WiseSettings {
    wiseApiToken: string;
    wiseProfileId: number;
    analysisWindow: number;
}
