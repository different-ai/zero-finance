import { RequestNetwork } from '@requestnetwork/request-client.js';

export const getRequestClient = () => {
  return new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: "https://xdai.gateway.request.network/",
    }
  });
};

export const formatCurrencyAmount = (amount: string, decimals: number = 18): string => {
  const value = parseFloat(amount) / Math.pow(10, decimals);
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals
  });
};
