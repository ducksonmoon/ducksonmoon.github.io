"use client";

import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { FaDownload } from "react-icons/fa";

export default function HomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-b from-background to-gray-900 px-4 text-center">
      <motion.h1
        className="text-5xl sm:text-6xl font-extrabold mb-4 leading-tight tracking-tight"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Mehrshad Baqerzadegan
      </motion.h1>

      <TypeAnimation
        sequence={[
          "Frontend Developer.",
          2000,
          "React | Angular | Next.js.",
          2000,
          "Passionate about Modern Web Development.",
          2000,
        ]}
        wrapper="p"
        className="text-lg sm:text-xl text-gray-400 max-w-xl mb-8"
        repeat={Infinity}
      />

      <motion.p
        className="text-md sm:text-lg text-gray-400 max-w-2xl mb-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        I create scalable, elegant, and efficient web solutions. Let's transform
        your ideas into reality with a focus on clean design and performance.
      </motion.p>

      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <motion.a
        href="/DucksOnMoon.github.io/Mehrshad-Baqerzadegan-Resume.pdf"
        download
        className="inline-flex items-center space-x-2 text-primary hover:underline mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.8 }}
      >
        <FaDownload className="text-xl" />
        <span>Download My Resume</span>
      </motion.a>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 animate-bounce"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
      >
        <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary" />
        </div>
      </motion.div>
    </div>
  );
}
