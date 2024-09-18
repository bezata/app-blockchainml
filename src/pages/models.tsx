import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpenIcon, Sparkles, Code, Zap } from "lucide-react";
import { NavBar } from "@/components/component/nav-bar";
import Image from "next/image";
import { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white p-6 mt-12 rounded-xl shadow-md"
  >
    <Icon className="w-12 h-12 text-green-500 mb-4" />
    <h3 className="text-lg  font-light text-gray-700 leading-tight mb-2">
      {title}
    </h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default function AIModelComponent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 font-sans">
      <NavBar />
      {/* Main Content */}
      <div className="min-h-screen md:max-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-12 max-w-3xl">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 60 }}
            className="inline-block"
          >
            <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-lg">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut",
                }}
              >
                <Image src="/angry.png" alt="AI" width={140} height={140} />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl font-light text-gray-700 leading-tight"
          >
            Are you{" "}
            <span className="text-green-500 font-normal">too curious</span>?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-2xl text-gray-600 font-light"
          >
            Our open source model marketplace is coming for AI Freedom!
          </motion.p>

          {isVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="space-y-6"
            >
              <Button className="bg-green-400 hover:bg-green-500 text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-md">
                <BookOpenIcon className="w-5 h-5 mr-2" />
                Read the docs
              </Button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
              >
                <FeatureCard
                  icon={Sparkles}
                  title="AI-Powered"
                  description="Cutting-edge AI models at your fingertips"
                />
                <FeatureCard
                  icon={Code}
                  title="Open Source"
                  description="Collaborate and contribute to the AI community"
                />
                <FeatureCard
                  icon={Zap}
                  title="Lightning Fast"
                  description="Optimized for speed and efficiency"
                />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-green-100 rounded-full opacity-20"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
}
