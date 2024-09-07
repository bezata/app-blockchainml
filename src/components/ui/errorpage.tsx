import React from "react";
import { motion } from "framer-motion";

export default function FuturisticErrorPage(): JSX.Element {
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
          <motion.path
            d="M 25,25 L 75,75 M 75,25 L 25,75"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </svg>
        <img
          src="/blockchainml.png"
          alt="BlockchainML Logo"
          className="w-48 h-48 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50"
        />
      </div>
      <motion.p
        className="text-white text-3xl font-bold relative z-10 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Oops! Something went wrong.
      </motion.p>
      <motion.p
        className="text-gray-400 text-xl relative z-10 mb-8 text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        We couldn&apos;t retrieve your datasets. Please try again later.
      </motion.p>
      <motion.button
        className="bg-white text-black px-6 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors duration-300 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.reload()}
      >
        Retry
      </motion.button>
    </div>
  );
}
