"use client"
import { AnimatePresence, motion } from "framer-motion"

export function IntroOutroOverlay({ showIntro, showOutro }: { showIntro?: boolean; showOutro?: boolean }) {
  const introText = "this is zero finance. a bank account that chases late invoices and sets aside your taxes."
  const outroMainText = "$99 lifetime" // Kept short as per script, URL is visual
  const outroSubText = "first 100 users with url 0.finance/signup."
  const outroCallToAction = "ready to fire your spreadsheet? grab lifetime access while it’s open."

  const textToShow = showIntro ? introText : showOutro ? outroMainText : null

  return (
    <AnimatePresence>
      {(showIntro || showOutro) && (
        <motion.div
          key={showIntro ? "intro" : "outro"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }} // Fast fade as per script
          className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100] p-8 text-center"
        >
          {textToShow && (
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }} // 200ms ease-in-out
              className="text-4xl md:text-5xl text-white font-medium"
            >
              {textToShow}
            </motion.p>
          )}
          {showOutro && (
            <>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut", delay: 0.3 }}
                className="text-2xl md:text-3xl text-gray-300 mt-4"
              >
                {outroSubText}
              </motion.p>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut", delay: 0.5 }}
                className="text-xl md:text-2xl text-gray-400 mt-10"
              >
                {outroCallToAction}
              </motion.p>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
