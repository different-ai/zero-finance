'use client';

import { Button } from '@/components/ui/button';

type PayButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function PayButton({
  onClick,
  disabled,
  className,
  children = 'Pay',
}: PayButtonProps) {
  return (
    <Button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </Button>
  );
}
