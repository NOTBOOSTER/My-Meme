"use client";

import { motion } from "framer-motion";

const Loading = () => {
  return (
    <motion.div
      className="flex items-center justify-center min-h-100 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-t-violet-600 border-gray-200 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-t-violet-400 border-gray-300 rounded-full animate-spin animate-reverse"></div>
          </div>
        </div>
        <p className="text-gray-600 text-lg font-medium animate-pulse">
          Loading...
        </p>
      </div>
    </motion.div>
  );
};

export default Loading;