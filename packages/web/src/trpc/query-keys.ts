export const ALIGN_QUERY_KEYS = {
  getCustomerStatus: () => ['align', 'getCustomerStatus'] as const,
  // Add other align-related keys here if needed
};

// Example for another router
// export const INVOICE_QUERY_KEYS = {
//   list: (filters: any) => ['invoice', 'list', filters] as const,
//   get: (id: string) => ['invoice', 'get', id] as const,
// }; 