import { useEffect, useState } from 'react';

/**
 * Hook to check if code is running on client-side
 * Prevents hydration mismatches
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

export default useIsClient;