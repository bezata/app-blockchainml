"use client";

import React from "react";
import { motion } from "framer-motion";

export default function FuturisticErrorPage(): JSX.Element {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center overflow-hidden font-sans">
      <div className="relative z-10 mb-12">
        <svg className="w-64 h-64" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="4"
          />
          <motion.path
            d="M 30,30 L 70,70 M 70,30 L 30,70"
            fill="none"
            stroke="#ED8936"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </svg>
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-4 shadow-md"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <svg
            className="w-32 h-32 text-orange-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </motion.div>
      </div>
      <motion.h1
        className="text-gray-800 text-3xl font-light relative z-10 mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        A Moment of Pause
      </motion.h1>
      <motion.p
        className="text-gray-600 text-xl relative z-10 mb-8 text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        We encountered an obstacle while retrieving your datasets. Let&apos;s
        take a breath and try again.
      </motion.p>
      <motion.button
        className="bg-orange-400 text-white px-8 py-3 rounded-full font-light text-lg hover:bg-orange-500 transition-colors duration-300 relative z-10 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-opacity-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.reload()}
      >
        Refresh
      </motion.button>
      <motion.p
        className="text-gray-500 text-sm mt-6 relative z-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        If the issue persists, please contact our support team.
      </motion.p>
    </div>
  );
}
