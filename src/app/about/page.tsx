"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <motion.div
      className="p-10 max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold mb-4">About Me</h1>
      <p className="text-lg">
        I am a frontend developer with over 5 years of experience working with
        React, Next.js, and Angular. I love building elegant interfaces and
        delivering seamless user experiences.
      </p>
    </motion.div>
  );
}
