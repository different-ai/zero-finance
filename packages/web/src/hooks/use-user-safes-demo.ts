import { useUserSafes as useRealUserSafes } from './use-user-safes';

// This hook no longer supports demo mode
// Demo mode is only available at /dashboard/demo
export const useUserSafes = () => {
  return useRealUserSafes();
};
