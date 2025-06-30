// No changes from previous version
export const LS_PREFIX = "zf:safe:"
export const ALLOC_KEY = (safeAddress: string): string => `${LS_PREFIX}${safeAddress}:alloc`
export const FIRST_RUN_KEY = (safeAddress: string): string => `${LS_PREFIX}${safeAddress}:savingsWizardDone`
