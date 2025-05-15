'use client';

import { Coins } from 'lucide-react'; // Using lucide-react as it seems to be used in the project

// You can customize the icon further if needed, or use it directly
export const CoinsIcon = (props: React.ComponentProps<typeof Coins>) => {
  return <Coins {...props} />;
};

export default CoinsIcon; 