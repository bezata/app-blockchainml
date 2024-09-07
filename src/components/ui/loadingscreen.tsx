import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FuturisticLoadingScreen(): JSX.Element {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="relative z-10 mb-12">
        <svg className="w-64 h-64" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="#333"
            strokeWidth="4"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress / 100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </svg>
        <img
          src="/blockchainml.png"
          alt="BlockchainML Logo"
          className="w-48 h-48 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <motion.p
        className="text-white text-2xl font-bold relative z-10 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        WE WILL GET YOUR DATASETS!
      </motion.p>
      <AnimatePresence>
        {progress === 100 && (
          <motion.p
            className="text-white text-lg mt-4 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            Ready to explore your data!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
