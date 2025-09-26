'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AllocationSlider from './allocation-slider';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatUsd, projectYield } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useSavingsRule } from '../hooks/use-savings-rule';
import { HelpCircle, CheckCircle, ArrowRight, Banknote } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';

interface SavingsOnboardingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  safeAddress: string;
}

const ACCENT_COLOR = '#0050ff'; // Changed to app's primary blue
const ACCENT_TINT_COLOR = '#E6F0FF'; // Light blue tint
const POSITIVE_COLOR = '#19AC8A';

const confettiLottieUrl =
  'https://lottie.host/2d320183-35f8-4b09-a0b8-5450a49e159c/3n3i4aJk3M.json';
const APY_RATE = 8;
const EXAMPLE_WEEKLY_DEPOSIT = 100;

export default function SavingsOnboardingSheet({
  open,
  onOpenChange,
  safeAddress,
}: SavingsOnboardingSheetProps) {
  const isMobile = useIsMobile();
  const { percentage, setPercentage, activateRule, isActivating } =
    useSavingsRule(safeAddress, 100);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  const exampleDepositFlowAmount = 100;
  const savedFromFlowAmount = exampleDepositFlowAmount * (percentage / 100);
  const weeklySavedAmount = EXAMPLE_WEEKLY_DEPOSIT * (percentage / 100);
  const yearlySavedAmount = weeklySavedAmount * 52;
  const projectedFirstYearEarnings = projectYield(
    yearlySavedAmount,
    100,
    APY_RATE,
  );

  const handleActivateClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmActivation = async () => {
    const success = await activateRule();
    if (success) {
      setShowConfirmation(false);
      setShowConfetti(true);
    }
  };

  const handleConfettiComplete = () => {
    setShowConfetti(false);
    onOpenChange(false);
    router.push('/dashboard?ruleActivated=1');
  };

  const SecurityPopover = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-6 right-6 h-8 w-8 text-gray-400 hover:text-gray-500"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-60 text-xs"
        align="end"
        style={{ color: 'rgba(10, 10, 10, 0.9)' }}
      >
        <span className="font-semibold">
          🔒 self-custody vault, {APY_RATE}-{APY_RATE + 2}% apy, change anytime.
        </span>
      </PopoverContent>
    </Popover>
  );

  const presetPercentages = [10, 20, 30, 50];

  const OnboardingContent = () => (
    <div className="flex flex-col items-center text-center p-6 pt-10 h-full max-w-[440px] mx-auto bg-[#F9FAFB]">
      <SecurityPopover />
      <div
        className="flex items-center justify-center h-14 w-14 rounded-full mb-6"
        style={{ backgroundColor: ACCENT_COLOR }}
      >
        <Banknote className="h-6 w-6 text-white" />
      </div>

      <h1
        className="text-[28px] font-semibold leading-snug"
        style={{ color: 'rgba(10, 10, 10, 0.9)' }}
      >
        Automate Your Savings
      </h1>
      <p
        className="text-base font-normal mt-2 mb-8 leading-normal"
        style={{ color: 'rgba(10, 10, 10, 0.9)' }}
      >
        every incoming dollar is split automatically.
        <br />
        choose how much goes to the {APY_RATE}% apy vault.
      </p>

      <div className="w-full p-6 rounded-2xl bg-white mb-8 shadow-lg">
        <div className="flex items-center justify-around text-center">
          <div>
            <p
              className="text-xs uppercase"
              style={{ color: 'rgba(10, 10, 10, 0.7)' }}
            >
              Deposit
            </p>
            <p
              className="text-[20px] font-semibold"
              style={{ color: 'rgba(10, 10, 10, 0.9)' }}
            >
              {formatUsd(exampleDepositFlowAmount)}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
          <div>
            <p
              className="text-xs uppercase"
              style={{ color: 'rgba(10, 10, 10, 0.7)' }}
            >
              To Savings
            </p>
            <p
              className="text-[20px] font-semibold"
              style={{ color: ACCENT_COLOR }}
            >
              {formatUsd(savedFromFlowAmount)}
            </p>
          </div>
        </div>
      </div>

      <p
        className="text-sm font-medium mb-2"
        style={{ color: 'rgba(10, 10, 10, 0.9)' }}
      >
        Save this percentage:
      </p>
      <div className="w-full mb-4">
        <AllocationSlider
          percentage={percentage}
          onPercentageChange={setPercentage}
          accentColor={ACCENT_COLOR}
        />
      </div>

      <div className="flex w-full justify-center space-x-2 mb-10">
        {presetPercentages.map((pct) => (
          <Button
            key={pct}
            variant="outline"
            onClick={() => setPercentage(pct)}
            className={cn(
              'rounded-md px-4 py-2 text-sm h-9 shadow-sm',
              percentage === pct
                ? 'border-2 font-semibold'
                : 'border-gray-300 text-gray-600',
            )}
            style={{
              borderColor: percentage === pct ? ACCENT_COLOR : '#E4E7EC',
              color:
                percentage === pct ? ACCENT_COLOR : 'rgba(10, 10, 10, 0.8)',
            }}
          >
            {pct}%
          </Button>
        ))}
      </div>

      {percentage > 0 && (
        <div
          className="w-full p-4 rounded-2xl bg-white border mb-10 shadow-sm"
          style={{ borderColor: ACCENT_COLOR }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: 'rgba(10, 10, 10, 0.9)' }}
              >
                First year earnings
              </p>
              <p
                className="text-3xl font-bold"
                style={{ color: 'rgba(10, 10, 10, 0.9)' }}
              >
                {formatUsd(projectedFirstYearEarnings)}
              </p>
              <p className="text-xs" style={{ color: 'rgba(10, 10, 10, 0.7)' }}>
                Based on {formatUsd(EXAMPLE_WEEKLY_DEPOSIT)}/week deposits
              </p>
            </div>
            <div
              className="flex items-center justify-center h-10 w-10 rounded-full"
              style={{ backgroundColor: ACCENT_TINT_COLOR }}
            >
              <Banknote className="h-5 w-5" style={{ color: ACCENT_COLOR }} />
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={handleActivateClick}
        disabled={isActivating || percentage === 0}
        className="w-full h-12 text-base font-semibold transition-transform duration-150 active:scale-[0.98] rounded-2xl shadow-sm"
        style={{ backgroundColor: ACCENT_COLOR, color: 'white' }}
      >
        {isActivating ? 'Activating...' : 'start saving'}
      </Button>
    </div>
  );

  const ConfirmationContent = () => (
    <div className="p-6 text-center bg-[#F9FAFB]">
      <DrawerHeader className="p-0">
        <div className="flex justify-center mb-3">
          <CheckCircle
            className="w-10 h-10"
            style={{ color: POSITIVE_COLOR }}
          />
        </div>
        <DrawerTitle
          className="text-lg font-semibold"
          style={{ color: 'rgba(10, 10, 10, 0.9)' }}
        >
          Rule is Ready to Go
        </DrawerTitle>
      </DrawerHeader>
      <p
        className="my-4 text-sm p-3 rounded-lg"
        style={{ color: 'rgba(10, 10, 10, 0.9)', backgroundColor: '#EEF0FF' }}
      >
        <span className="font-bold" style={{ color: ACCENT_COLOR }}>
          {percentage}%
        </span>{' '}
        of every incoming deposit will route to the high-yield vault, earning ~
        {APY_RATE}% APY.
      </p>
      <DrawerFooter className="p-0 pt-2 flex-col sm:flex-row gap-2">
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setShowConfirmation(false)}
          style={{ color: 'rgba(10, 10, 10, 0.9)' }}
        >
          Edit
        </Button>
        <Button
          className="w-full text-white"
          style={{ backgroundColor: ACCENT_COLOR }}
          onClick={handleConfirmActivation}
          disabled={isActivating}
        >
          {isActivating ? 'Confirming...' : 'Confirm & Start Earning'}
        </Button>
      </DrawerFooter>
    </div>
  );

  const mainContent = (
    <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
      {<OnboardingContent />}
    </div>
  );

  const confirmationDrawer = (
    <DrawerContent className="bg-[#F9FAFB]">
      <ConfirmationContent />
    </DrawerContent>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="p-0 flex flex-col bg-[#F9FAFB] sm:max-w-md md:max-w-lg w-full"
        onInteractOutside={(e) => {
          if (isActivating) e.preventDefault();
        }}
      >
        {showConfetti && (
          <Player
            autoplay
            src={confettiLottieUrl}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 9999,
            }}
            onEvent={(e: string) =>
              e === 'complete' && handleConfettiComplete()
            }
            keepLastFrame
          />
        )}
        {mainContent}
        <Drawer open={showConfirmation} onOpenChange={setShowConfirmation}>
          {confirmationDrawer}
        </Drawer>
      </SheetContent>
    </Sheet>
  );
}
