'use client';

import React, { useState, useEffect } from 'react';
import { useEarn, EarnState, SweepEvent } from '@/hooks/use-earn';
import { useUserSafes } from '@/hooks/use-user-safes';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  InfoCircledIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  LapTimerIcon,
  ArrowRightIcon,
  LayersIcon as RadixLayersIcon,
} from '@radix-ui/react-icons';
import {
  SquirrelIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  CheckCircle2,
  XCircle,
  Hourglass,
  ArrowLeftIcon,
  SettingsIcon,
  ActivityIcon,
  PiggyBankIcon,
  CalendarDaysIcon,
  BarChartIcon,
  LayersIcon,
} from 'lucide-react';

const DEFAULT_MOCK_CONFIG_HASH = '0xfluidkeyDefaultConfigHashV1';

// Utility functions (assuming 6 decimals for USDC for display)
const USDC_DECIMALS = 6;
const formatCurrency = (
  value: string | bigint | number | undefined,
  decimals = USDC_DECIMALS,
  symbol = 'USDC',
) => {
  if (value === undefined || value === null || String(value).trim() === '')
    return `0 ${symbol}`;
  try {
    const valStr = String(value);
    // Ensure valStr is a string of digits before BigInt conversion
    if (!/^\d+$/.test(valStr)) {
      // console.warn("formatCurrency: value is not a valid integer string for BigInt", valStr);
      return `0 ${symbol}`; // If not, it cannot be a valid wei amount
    }
    const num = BigInt(valStr) / BigInt(10 ** decimals);
    return `${num.toLocaleString()} ${symbol}`;
  } catch (error) {
    // console.error("Error formatting currency:", value, error);
    return `0 ${symbol}`;
  }
};

const formatPercentage = (value: number | undefined) => {
  if (value === undefined || value === null || isNaN(Number(value)))
    return '0.0%';
  return `${Number(value).toFixed(1)}%`;
};

const calculateYearlyGain = (
  balance: string | bigint | number | undefined,
  allocation: number | undefined,
  apy: number | undefined,
) => {
  if (
    balance === undefined ||
    balance === null ||
    String(balance).trim() === '' ||
    allocation === undefined ||
    allocation === null ||
    isNaN(Number(allocation)) ||
    apy === undefined ||
    apy === null ||
    isNaN(Number(apy))
  )
    return '0';
  try {
    const balanceStr = String(balance);
    if (!/^\d+$/.test(balanceStr)) {
      // Ensure balance is a string of digits
      // console.warn("calculateYearlyGain: balance is not a valid integer string", balanceStr);
      return '0';
    }
    const currentAllocation = Number(allocation);
    const currentApy = Number(apy);

    const earningBalance =
      (BigInt(balanceStr) * BigInt(currentAllocation)) / 100n;
    const yearlyGainWei =
      (earningBalance * BigInt(Math.round(currentApy * 100))) / 10000n;
    return (yearlyGainWei / BigInt(10 ** USDC_DECIMALS)).toString();
  } catch (error) {
    // console.error("Error in calculateYearlyGain:", {balance, allocation, apy}, error);
    return '0';
  }
};

const timeAgo = (dateString: string | null): string => {
  if (!dateString) return 'never';
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  if (seconds < 5) return 'just now';
  return Math.floor(seconds) + ' seconds ago';
};

type EarnView =
  | 'loading'
  | 'signIn'
  | 'enable'
  | 'allocate'
  | 'confirm'
  | 'dashboard'
  | 'settings'
  | 'activity';

export default function EarnPage() {
  const { data: safes, isLoading: isLoadingUserSafes } = useUserSafes();
  const safeId = safes?.[0]?.safeAddress as string | undefined;
  const [hydrated, setHydrated] = useState(false);

  const {
    state,
    isLoadingState,
    stateError,
    enable,
    isEnabling,
    enableError,
    disable,
    isDisabling,
    disableError,
    setAllocation,
    isSettingAllocation,
    setAllocationError,
  } = useEarn({ safeId });

  const [currentView, setCurrentView] = useState<EarnView>('loading');
  const [userInteractedAllocation, setUserInteractedAllocation] =
    useState<number>(state?.allocation ?? 30);
  const [iUnderstandChecked, setIUnderstandChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const currentAllocationForSlider = userInteractedAllocation;
  const estimatedYearlyGain = calculateYearlyGain(
    state?.totalBalance,
    currentAllocationForSlider,
    state?.apy,
  );

  useEffect(() => {
    if (hydrated && state) {
      // If not on a view where the user actively edits allocation, sync it from state.
      // Or if userInteractedAllocation hasn't been set properly yet.
      if (!['allocate', 'settings'].includes(currentView) || userInteractedAllocation === undefined || userInteractedAllocation === null) {
        setUserInteractedAllocation(state.allocation ?? 30);
      }
    }

    if (!hydrated) {
      setCurrentView('loading');
      return;
    }

    if (isLoadingState && !state) {
      setCurrentView('loading');
    } else if (stateError) {
      toast.error('Failed to load Earn status.', {
        description: stateError.message,
        icon: <CrossCircledIcon className="text-red-500" />,
      });
      setCurrentView('enable');
    } else if (state) {
      if (!state.enabled) {
        if (currentView !== 'enable') setCurrentView('enable');
      } else {
        if (
          ![
            'dashboard',
            'settings',
            'activity',
            'confirm',
            'allocate',
          ].includes(currentView)
        ) {
          setCurrentView('dashboard');
        }
      }
    } else if (!isLoadingState && !state) {
      setCurrentView('enable');
    }
  }, [state, isLoadingState, stateError, currentView, hydrated]);

  const handleEnable = async () => {
    const configHashToUse = state?.configHash || DEFAULT_MOCK_CONFIG_HASH;
    
    // Optimistic UI update
    setCurrentView('allocate');
    // Set a temporary optimistic state for allocation if needed, or rely on fetch
    // For now, just changing view. Actual state update will come from query invalidation.

    try {
      await enable(configHashToUse);
      toast.success('Auto-Earn Enabled!', {
        description: "We\'ll start putting your idle cash to work.",
        duration: 3000,
        icon: <CheckCircledIcon className="text-green-500" />,
      });
      // setUserInteractedAllocation(state?.allocation ?? 30); // This might be redundant if view changes and useEffect handles it
      // setCurrentView('allocate'); // Already done optimistically
    } catch (e: any) {
      toast.error('Failed to enable Auto-Earn.', {
        description: e.message || enableError?.message,
        icon: <CrossCircledIcon className="text-red-500" />,
      });
      // Revert view if enabling failed
      setCurrentView('enable'); 
    }
  };

  const handleConfirmAllocation = async () => {
    // Ensure currentAllocationForSlider is a number for the calculation
    const allocationNum =
      typeof currentAllocationForSlider === 'number'
        ? currentAllocationForSlider
        : 0;
    if (!iUnderstandChecked) return;
    try {
      setIsProcessing(true);
      await setAllocation(allocationNum);
      toast.success('Allocation Set!', {
        description: `Now ${allocationNum}% of new deposits will be swept.`,
        duration: 3000,
        icon: <CheckCircledIcon className="text-green-500" />,
      });
      setTimeout(() => {
        setCurrentView('dashboard');
        setIUnderstandChecked(false);
        setIsProcessing(false);
      }, 1000);
    } catch (e: any) {
      toast.error('Failed to set allocation.', {
        description: e.message || setAllocationError?.message,
        icon: <CrossCircledIcon className="text-red-500" />,
      });
      setIsProcessing(false);
    }
  };

  const handleTogglePause = async () => {
    if (!state) return;
    
    // Optimistic UI: Anticipate the new state for immediate feedback
    const newOptimisticEnabledState = !state.enabled;
    // You could also update a local optimistic version of 'state' here if your UI relies on it before refetch

    try {
      if (state.enabled) { // If currently enabled, we are disabling (pausing)
        await disable();
        toast.success('Auto-Earn Paused', {
          description: "Funds will remain in your account but won\'t be swept.",
          duration: 3000,
          icon: <LapTimerIcon className="text-yellow-500" />,
        });
        // View will update via useEffect reacting to new state from refetch
      } else { // If currently disabled, we are enabling (resuming)
        if (!state.configHash) {
          toast.error('Cannot resume Auto-Earn.', {
            description: 'Configuration data is missing. Please try disabling and re-enabling the feature from scratch if this persists.',
            icon: <CrossCircledIcon className="text-red-500" />,
          });
          return;
        }
        const configHashToUse = state.configHash;
        await enable(configHashToUse);
        toast.success('Auto-Earn Resumed', {
          icon: <CheckCircledIcon className="text-green-500" />,
        });
        // View will update via useEffect reacting to new state from refetch
      }
    } catch (e: any) {
      // Generic error toast, specific errors are caught by useEarn and available in disableError/enableError
      toast.error('Failed to update Auto-Earn status.', {
        description: e.message || 'An unexpected error occurred.',
        icon: <CrossCircledIcon className="text-red-500" />,
      });
      // No view reversion here as onSettled + useEffect should handle showing the true state
    }
  };

  const springMotion = { type: 'spring', stiffness: 320, damping: 30 };

  const renderView = () => {
    // Use safeId and selectedSafe from the outer component scope
    if (
      !hydrated || // Add hydrated check here
      isLoadingUserSafes ||
      !safeId ||
      currentView === 'loading' ||
      (isLoadingState && !state)
    ) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-deep-navy  p-8">
          <motion.div
        //    make it grow and get smaller instead
            animate={{ rotate: [0, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <SquirrelIcon size={64} className=" mb-6 " />
          </motion.div>
          <p className="text-xl font-medium">
            {isLoadingUserSafes
              ? 'Loading your safes...'
              : 'Loading your Earn dashboard...'}
          </p>
          <p className="text-sm text-gray-400">
            {isLoadingUserSafes
              ? 'Please wait...'
              : 'Fetching the latest numbers...'}
          </p>
        </div>
      );
    }
    if (!safeId) {
      return (
        <div className=" p-8">
          Please select a Safe to manage Earn features.
        </div>
      );
    }

    switch (currentView) {
      case 'enable':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springMotion}
            className="p-4 sm:p-8 max-w-md mx-auto w-full"
          >
            <Card className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gray-50 p-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, ...springMotion }}
                  className="mx-auto mb-4 w-16 h-16 flex items-center justify-center bg-accent-teal rounded-full shadow-md"
                >
                  <SquirrelIcon size={36} className="text-deep-navy" />
                </motion.div>
                <CardTitle className="text-center text-2xl font-semibold text-deep-navy">
                  Earn on Autopilot
                </CardTitle>
                <CardDescription className="text-center text-gray-600 mt-1">
                  Let your idle cash work for you, effortlessly.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-gray-700 mb-6">
                  By enabling this feature, the Fluidkey Earn Module will
                  automatically sweep a portion of your new deposits into
                  high-yield &apos;earnings accounts&apos;. Your funds always
                  remain in your Safe.
                </p>
                <Button
                  className="w-full bg-accent-teal text-deep-navy font-semibold hover:bg-teal-500 transition-all duration-150 transform active:scale-95 py-3 text-base shadow-md hover:shadow-lg"
                  onClick={handleEnable}
                  disabled={isEnabling}
                >
                  {isEnabling ? (
                    <span className="flex items-center justify-center">
                      <LapTimerIcon className="animate-spin mr-2" /> Turning
                      On...
                    </span>
                  ) : (
                    'Turn It On'
                  )}
                </Button>
              </CardContent>
              <CardFooter className="p-4 bg-gray-50 border-t">
                <p className="text-xs text-gray-500 text-center w-full">
                  You can change this setting or pause anytime.
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        );
      case 'allocate':
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={springMotion}
            className="p-4 sm:p-8 max-w-md mx-auto w-full"
          >
            <Card className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gray-50 p-6">
                <CardTitle className="text-center text-2xl font-semibold text-deep-navy">
                  Set Your Sweep
                </CardTitle>
                <CardDescription className="text-center text-gray-600 mt-1">
                  Choose how much of new deposits go to your earnings account.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <motion.div
                    key={currentAllocationForSlider}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="text-5xl font-bold text-accent-teal"
                  >
                    {formatPercentage(currentAllocationForSlider)}
                  </motion.div>
                  <p className="text-sm text-gray-500 mt-1">
                    of incoming funds will be swept.
                  </p>
                </div>
                <Slider
                  value={[currentAllocationForSlider ?? 30]}
                  max={100}
                  step={1}
                  onValueChange={(value) =>
                    setUserInteractedAllocation(value[0])
                  }
                  className="my-6 [&>span:first-child]:h-3 [&>span:first-child>span]:bg-accent-teal [&>span:first-child>span]:h-3"
                />
                <div className="mt-4 p-3 bg-teal-50 rounded-lg border border-teal-200">
                  <p className="text-sm text-teal-700">
                    Estimated yearly gain:{' '}
                    <span className="font-semibold">
                      {formatCurrency(estimatedYearlyGain, 2)}
                    </span>
                  </p>
                  <p className="text-xs text-teal-600">
                    Based on current APY of {formatPercentage(state?.apy)} and
                    total balance of {formatCurrency(state?.totalBalance)}.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="p-6 bg-gray-50 border-t">
                <Button
                  className="w-full bg-accent-teal text-deep-navy font-semibold hover:bg-teal-500 py-3 text-base shadow-md"
                  onClick={() => setCurrentView('confirm')}
                >
                  Next <ArrowRightIcon className="ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      case 'confirm':
        const allocationNumForDisplay =
          typeof currentAllocationForSlider === 'number'
            ? currentAllocationForSlider
            : 0;
        const exampleSweepAmount = (
          (BigInt(1000 * 10 ** USDC_DECIMALS) *
            BigInt(allocationNumForDisplay)) /
          100n
        ).toString();
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={springMotion}
            className="p-4 sm:p-8 max-w-md mx-auto w-full"
          >
            <Card className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gray-50 p-6">
                <CardTitle className="text-center text-2xl font-semibold text-deep-navy">
                  Confirm Your Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 mb-6 text-gray-700">
                  <p>
                    You&apos;re about to set{' '}
                    <strong className="text-accent-teal">
                      {formatPercentage(allocationNumForDisplay)}
                    </strong>{' '}
                    of every new deposit to be automatically swept into your
                    earnings account.
                  </p>
                  <p>
                    This means if you deposit{' '}
                    <strong className="text-deep-navy">1,000 USDC</strong>,{' '}
                    <strong className="text-accent-teal">
                      {formatCurrency(exampleSweepAmount)}
                    </strong>{' '}
                    will go to earnings.
                  </p>
                  <p>
                    You can change this setting or pause Auto-Earn at any time
                    from your dashboard.
                  </p>
                </div>
                <div className="flex items-center space-x-2 mb-6">
                  <Checkbox
                    id="i-understand"
                    checked={iUnderstandChecked}
                    onCheckedChange={(checked: boolean | 'indeterminate') =>
                      setIUnderstandChecked(checked === true)
                    }
                  />
                  <label
                    htmlFor="i-understand"
                    className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I get it, let&apos;s earn!
                  </label>
                </div>
                {isProcessing ? (
                  <div className="w-full h-10 bg-gray-200 rounded-md overflow-hidden relative">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-accent-teal"
                      initial={{ x: '-100%' }}
                      animate={{ x: '0%' }} // Fill from left to right
                      transition={{ duration: 1, ease: 'linear' }} // Removed repeat
                    />
                    <p className="absolute inset-0 flex items-center justify-center text-deep-navy font-medium">
                      Processing...
                    </p>
                  </div>
                ) : (
                  <Button
                    className="w-full bg-accent-teal text-deep-navy font-semibold hover:bg-teal-500 py-3 text-base shadow-md"
                    onClick={handleConfirmAllocation}
                    disabled={
                      !iUnderstandChecked || isSettingAllocation || isProcessing
                    }
                  >
                    {isSettingAllocation
                      ? 'Confirming...'
                      : 'Confirm & Activate'}
                  </Button>
                )}
              </CardContent>
              <CardFooter className="p-6 bg-gray-50 border-t flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setCurrentView('allocate')}
                  disabled={isProcessing}
                >
                  Back to Allocation
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      case 'dashboard':
        const totalBalanceNum = state?.totalBalance
          ? BigInt(state.totalBalance)
          : 0n;
        const earningBalanceNum = state?.earningBalance
          ? BigInt(state.earningBalance)
          : 0n;
        const projectedMonthlyYield =
          state?.earningBalance && typeof state?.apy === 'number' // Ensure apy is a number
            ? (earningBalanceNum *
                BigInt(Math.round(state.apy * 100))) /
              120000n // (annual rate scaled by 10000, then divided by 12 for monthly)
            : 0n;

        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-4 sm:p-6 md:p-8 w-full max-w-4xl mx-auto"
          >
            <header className="mb-8 flex justify-between items-center">
              <div>
                {/* Use selectedSafe from component scope */}
                <h1 className="text-3xl sm:text-4xl font-bold ">
                  Hi {'Ben'},
                </h1>
                <p className="text-lg text-gray-400">
                  Here&apos;s your auto-earn summary.
                </p>
              </div>
              <Button
                onClick={() => setCurrentView('settings')}
                className="bg-white/10 hover:bg-white/20  rounded-lg py-2 px-4 transition-colors"
              >
                <SettingsIcon className="w-5 h-5 mr-2" /> Settings
              </Button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white/10 backdrop-blur-md  rounded-2xl shadow-xl col-span-1 md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-medium">
                    Total Balance
                  </CardTitle>
                  <RadixLayersIcon className="w-6 h-6 text-accent-teal" />
                </CardHeader>
                <CardContent>
                  <motion.div
                    key={`total-${state?.totalBalance}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl font-bold text-accent-teal"
                  >
                    {formatCurrency(state?.totalBalance)}
                  </motion.div>
                  <p className="text-xs text-gray-400">
                    Across all your sources.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-md  rounded-2xl shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">
                    Amount Earning
                  </CardTitle>
                  <TrendingUpIcon className="w-5 h-5 text-accent-teal" />
                </CardHeader>
                <CardContent>
                  <motion.div
                    key={`earning-${state?.earningBalance}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="text-3xl font-semibold"
                  >
                    {formatCurrency(state?.earningBalance)}
                  </motion.div>
                  <Progress
                    value={
                      (Number(earningBalanceNum) /
                        Number(totalBalanceNum || 1)) *
                      100
                    }
                    className="w-full h-2 mt-2 bg-white/20 [&>div]:bg-accent-teal"
                  />
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-md  rounded-2xl shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">
                    Current APY
                  </CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoCircledIcon className="w-4 h-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-deep-navy  border-accent-teal">
                        <p>
                          Annual Percentage Yield, net of fees. Subject to
                          change.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent>
                  <motion.div
                    key={`apy-${state?.apy}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="text-3xl font-semibold text-accent-teal"
                  >
                    {formatPercentage(state?.apy)}
                  </motion.div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white/5 backdrop-blur-sm  rounded-xl shadow-lg p-4">
                <CardHeader className="pb-1 pt-1">
                  <CardTitle className="text-sm font-normal text-gray-300">
                    Projected Monthly Yield
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-1">
                  <motion.p
                    key={`monthly-${projectedMonthlyYield}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl font-medium text-accent-teal"
                  >
                    {formatCurrency(
                      projectedMonthlyYield.toString(),
                      USDC_DECIMALS,
                      '',
                    )}{' '}
                    USDC
                  </motion.p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 backdrop-blur-sm  rounded-xl shadow-lg p-4">
                <CardHeader className="pb-1 pt-1">
                  <CardTitle className="text-sm font-normal text-gray-300">
                    Last Sweep
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-1">
                  <motion.p
                    key={`lastsweep-${state?.lastSweep}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl font-medium"
                  >
                    {timeAgo(state?.lastSweep)}
                  </motion.p>
                </CardContent>
              </Card>
            </div>
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setCurrentView('activity')}
                className="text-accent-teal hover:text-teal-300 text-base"
              >
                View Full Activity Log <ActivityIcon className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="mt-10 p-4 border border-dashed border-gray-700 rounded-lg">
              <p className="text-xs text-gray-500 mb-2">Dev Controls:</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentView('enable')}
                >
                  Show Enable
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentView('allocate')}
                >
                  Show Allocate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentView('confirm')}
                >
                  Show Confirm
                </Button>
              </div>
            </div>
          </motion.div>
        );
      case 'activity':
        return (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={springMotion}
            className="p-4 sm:p-6 md:p-8 w-full max-w-2xl mx-auto"
          >
            <Card className="bg-white shadow-xl rounded-2xl text-deep-navy">
              <CardHeader className="bg-gray-50 p-4 sm:p-6 border-b flex flex-row items-center justify-between">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentView('dashboard')}
                    className="mr-2 text-gray-600 hover:text-deep-navy"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </Button>
                  <CardTitle className="text-xl sm:text-2xl font-semibold text-deep-navy">
                    Activity Log
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => console.log('Download CSV clicked')}
                  className="text-xs"
                >
                  Download CSV
                </Button>
              </CardHeader>
              <CardContent className="p-0 max-h-[60vh] overflow-y-auto">
                {state?.events && state.events.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {state.events.map((event: SweepEvent) => (
                      <motion.li
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: state.events.indexOf(event) * 0.05,
                        }}
                        className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {event.status === 'success' && (
                              <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                            )}
                            {event.status === 'pending' && (
                              <Hourglass className="w-5 h-5 text-yellow-500 mr-3 shrink-0 animate-spin" />
                            )}
                            {event.status === 'failed' && (
                              <XCircle className="w-5 h-5 text-red-500 mr-3 shrink-0" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-deep-navy">
                                {event.status === 'success'
                                  ? 'Sweep Successful'
                                  : event.status === 'pending'
                                    ? 'Sweep Pending'
                                    : 'Sweep Failed'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatCurrency(event.amount, USDC_DECIMALS)}{' '}
                                &bull; APY at time:{' '}
                                {formatPercentage(event.apyAtTime)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              {new Date(event.timestamp).toLocaleDateString()}{' '}
                              {new Date(event.timestamp).toLocaleTimeString()}
                            </p>
                            {event.txHash && (
                              <p
                                className="text-xs text-gray-400 truncate max-w-[80px] sm:max-w-[120px]"
                                title={event.txHash}
                              >
                                Tx: {event.txHash}
                              </p>
                            )}
                          </div>
                        </div>
                        {event.status === 'failed' && event.failureReason && (
                          <p className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-md">
                            Reason: {event.failureReason}
                          </p>
                        )}
                        {event.status === 'failed' && (
                          <Button
                            size="sm"
                            variant="link"
                            className="text-xs text-accent-teal p-0 mt-1 h-auto"
                            onClick={() => console.log('Retry sweep', event.id)}
                          >
                            Retry Sweep
                          </Button>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-10 text-center text-gray-500">
                    <ActivityIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No sweep events yet.</p>
                    <p className="text-xs">
                      Once Auto-Earn is active, your sweeps will appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      case 'settings':
        // Ensure state is available for settings, otherwise show a restricted view or loading
        if (!state) {
          return (
            <div className="p-8  max-w-md mx-auto">
              <Card className="bg-white shadow-xl rounded-2xl text-deep-navy">
                <CardHeader>
                  <CardTitle>Loading Settings...</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Please wait while we fetch your current earn settings.</p>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentView('dashboard')}
                    className="mt-4"
                  >
                    Back to Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          );
        }
        const allocationForSettingsSlider =
          userInteractedAllocation ?? state.allocation;
        const estimatedYearlyGainForSettings = calculateYearlyGain(
          state?.totalBalance,
          allocationForSettingsSlider,
          state?.apy,
        );

        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={springMotion}
            className="p-4 sm:p-6 md:p-8 w-full max-w-2xl mx-auto"
          >
            <Card className="bg-white shadow-xl rounded-2xl text-deep-navy">
              <CardHeader className="bg-gray-50 p-4 sm:p-6 border-b flex flex-row items-center justify-between">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setUserInteractedAllocation(state.allocation);
                      setCurrentView('dashboard');
                    }}
                    className="mr-2 text-gray-600 hover:text-deep-navy"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                  </Button>
                  <CardTitle className="text-xl sm:text-2xl font-semibold text-deep-navy">
                    Manage Auto-Earn
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                {/* Pause/Resume Section */}
                <div>
                  <h3 className="text-lg font-medium text-deep-navy mb-2">
                    Auto-Earn Status
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                    <label
                      htmlFor="auto-earn-toggle"
                      className="text-sm font-medium text-gray-700"
                    >
                      {state.enabled
                        ? 'Auto-Earn is Active'
                        : 'Auto-Earn is Paused'}
                    </label>
                    <Switch
                      id="auto-earn-toggle"
                      checked={state.enabled}
                      onCheckedChange={handleTogglePause}
                      disabled={isEnabling || isDisabling}
                      className="[&>span]:bg-accent-teal"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {state.enabled
                      ? 'We are automatically sweeping funds to your earnings account based on your allocation.'
                      : 'Sweeping is currently paused. Your funds will remain in your main balance.'}
                  </p>
                </div>

                {/* Allocation Section - only if enabled */}
                {state.enabled && (
                  <div>
                    <h3 className="text-lg font-medium text-deep-navy mb-1">
                      Sweep Allocation
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                      Adjust what percentage of new deposits get swept.
                    </p>
                    <div className="text-center mb-4">
                      <motion.div
                        key={allocationForSettingsSlider}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 15,
                        }}
                        className="text-4xl font-bold text-accent-teal"
                      >
                        {formatPercentage(allocationForSettingsSlider)}
                      </motion.div>
                    </div>
                    <Slider
                      value={[allocationForSettingsSlider]}
                      max={100}
                      step={1}
                      onValueChange={(value) =>
                        setUserInteractedAllocation(value[0])
                      }
                      disabled={isSettingAllocation || !state.enabled}
                      className="my-4 [&>span:first-child]:h-3 [&>span:first-child>span]:bg-accent-teal [&>span:first-child>span]:h-3"
                    />
                    <div className="mt-2 p-3 bg-teal-50 rounded-lg border border-teal-200 text-xs">
                      <p className="text-teal-700">
                        Estimated yearly gain with this allocation:{' '}
                        <span className="font-semibold">
                          {formatCurrency(estimatedYearlyGainForSettings, 2)}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
              {state.enabled && (
                <CardFooter className="p-6 bg-gray-50 border-t">
                  <Button
                    className="w-full bg-accent-teal text-deep-navy font-semibold hover:bg-teal-500 py-3 text-base shadow-md"
                    onClick={async () => {
                      if (allocationForSettingsSlider === null) return;
                      try {
                        await setAllocation(allocationForSettingsSlider);
                        toast.success('Allocation Updated!', {
                          description: `${allocationForSettingsSlider}% will now be swept.`,
                        });
                        // Optionally navigate away or just show success
                        // setCurrentView('dashboard');
                      } catch (e: any) {
                        toast.error('Failed to update allocation.', {
                          description: e.message || setAllocationError?.message,
                        });
                      }
                    }}
                    disabled={
                      isSettingAllocation ||
                      allocationForSettingsSlider === state.allocation
                    }
                  >
                    {isSettingAllocation
                      ? 'Saving Allocation...'
                      : 'Save Allocation Changes'}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        );
      default:
        return (
          <div className="p-8  max-w-lg mx-auto">
            <Card className="bg-white shadow-xl rounded-2xl text-deep-navy">
              <CardHeader>
                <CardTitle>Simple Earn Dashboard (Dev)</CardTitle>
                <CardDescription>
                  Status: {state?.enabled ? 'Enabled' : 'Disabled'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Current View: {currentView}</p>
                <p>Allocation: {state?.allocation}%</p>
                <p>Total Balance: {formatCurrency(state?.totalBalance)}</p>
                <p>Earning Balance: {formatCurrency(state?.earningBalance)}</p>
                <p>APY: {formatPercentage(state?.apy)}</p>
                <p>Last Sweep: {timeAgo(state?.lastSweep)}</p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button
                  onClick={() => setCurrentView('enable')}
                  variant="outline"
                >
                  Show Enable
                </Button>
                <Button
                  onClick={() => setCurrentView('allocate')}
                  variant="outline"
                >
                  Show Allocate
                </Button>
                <Button
                  onClick={() => setCurrentView('confirm')}
                  variant="outline"
                >
                  Show Confirm
                </Button>
                <Button
                  onClick={() => setCurrentView('dashboard')}
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
                <Button
                  onClick={() => setCurrentView('settings')}
                  className="w-full"
                >
                  Go to Settings (TODO)
                </Button>
                <Button
                  onClick={() => setCurrentView('activity')}
                  className="w-full"
                >
                  Go to Activity
                </Button>
              </CardFooter>
            </Card>
          </div>
        );
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-deep-navy flex flex-col items-center justify-center font-inter p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: currentView === 'loading' ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ ...springMotion, duration: 0.3 }}
            className="w-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
