'use client';

import { SquirrelIcon, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface EnableCardProps {
  onNext: () => void;
  isLoading: boolean;
}

export default function EnableCard({ onNext, isLoading }: EnableCardProps) {
  const springMotion = { type: 'spring' as const, stiffness: 320, damping: 30 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springMotion}
      className="p-4 sm:p-8 w-full"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-700 p-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, ...springMotion }}
            className="mx-auto mb-4 w-16 h-16 flex items-center justify-center bg-primary-500 dark:bg-primary-400 rounded-full shadow-md"
          >
            <SquirrelIcon
              size={36}
              className="text-white dark:text-deep-navy"
            />
          </motion.div>
          <h2 className="text-center text-2xl font-semibold text-gray-900 dark:text-white">
            Earn on Autopilot
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mt-1">
            Let your idle cash work for you, effortlessly.
          </p>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
            By enabling this feature, the Fluidkey Earn Module will
            automatically sweep a portion of your new deposits into high-yield
            &apos;earnings accounts&apos;. Your funds always remain in your
            Safe.
          </p>
          <button
            onClick={onNext}
            disabled={isLoading}
            className="w-full bg-primary-500 text-white dark:text-deep-navy font-semibold hover:bg-primary-600 dark:hover:bg-primary-300 transition-all duration-150 transform active:scale-95 py-3 text-base shadow-md hover:shadow-lg rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="mr-2"
                >
                  <Zap size={18} />
                </motion.div>
                Turning On...
              </>
            ) : (
              <>
                <Zap size={18} className="mr-2" />
                Turn It On
              </>
            )}
          </button>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center w-full">
            You can change this setting or pause anytime.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
