"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

// Array of fun philosophical quotes for the duck
const quotes = [
  "To debug or not to debug—that is the question.",
  "One cannot simply `console.log` their way to enlightenment.",
  "A quack a day keeps the bugs away.",
  "The journey of a thousand lines of code begins with a single import.",
  "If you can't explain it simply, you're probably overengineering it.",
  "Float like a duck, and don't let them see you paddling frantically under the water.",
  "The best code is the code you never have to write.",
  "A duck's wisdom comes from swimming in both shallow and deep waters.",
];

export default function HomePage() {
  const [quote, setQuote] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const midX = window.innerWidth / 2;
    const midY = window.innerHeight / 2;

    const moveX = (clientX - midX) * 0.03;
    const moveY = (clientY - midY) * 0.03;

    const parallaxElements = document.querySelectorAll(".parallax");
    parallaxElements.forEach((element, index) => {
      const depth = index * 0.2 + 0.8; // Different depths for each element
      (
        element as HTMLElement
      ).style.transform = `translate(${moveX * depth}px, ${moveY * depth}px)`;
    });
  };

  const handleDuckClick = () => {
    setIsAnimating(true);
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blue-800 to-gray-900 text-white px-4 sm:px-6"
      onMouseMove={handleMouseMove}
    >
      {/* Background elements - added more for depth */}
      <motion.div
        className="parallax absolute top-10 left-1/4 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-40 blur-3xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.div
        className="parallax absolute bottom-10 right-1/4 w-52 sm:w-72 h-52 sm:h-72 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 opacity-40 blur-3xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div
        className="parallax absolute top-1/3 right-1/5 w-36 sm:w-48 h-36 sm:h-48 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-30 blur-3xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        transition={{ duration: 2.5, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="parallax absolute bottom-1/3 left-1/5 w-40 sm:w-56 h-40 sm:h-56 rounded-full bg-gradient-to-r from-indigo-500 to-violet-400 opacity-30 blur-3xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        transition={{ duration: 2.5, ease: "easeInOut", delay: 1.5 }}
      />

      {/* Duck image with enhanced animations */}
      <motion.div
        className="relative z-10 mb-6 sm:mb-8"
        animate={{ 
          rotate: isAnimating ? [0, -10, 10, -5, 0] : 0 
        }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src="/duck.svg"
          alt="A wise duck"
          className="parallax w-24 h-24 sm:w-32 sm:h-32 cursor-pointer"
          initial={{ y: -20 }}
          animate={{ 
            y: [0, -10, 0],
            filter: ["drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))", "drop-shadow(0 0 12px rgba(59, 130, 246, 0.8))", "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))"]
          }}
          transition={{ 
            y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
            filter: { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }}
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDuckClick}
        />
        <motion.div 
          className="absolute -bottom-2 -left-2 -right-2 h-4 bg-black opacity-10 blur-md rounded-full"
          animate={{ 
            width: ["100%", "95%", "100%"]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3, 
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Quote bubble with improved design */}
      <motion.div
        className="relative bg-white bg-opacity-95 backdrop-blur-sm text-gray-800 p-4 sm:p-6 rounded-lg shadow-xl max-w-xs sm:max-w-sm md:max-w-xl z-10 border border-white border-opacity-20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        whileHover={{ boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)" }}
      >
        <p className="text-base sm:text-lg font-medium">{quote}</p>
        <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-white"></div>
        <motion.p 
          className="text-xs italic text-gray-500 mt-4 text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          Generated by ChatGPT
        </motion.p>
      </motion.div>

      {/* Description with improved styling */}
      <motion.div
        className="mt-10 px-5 sm:px-7 py-4 sm:py-5 max-w-xs sm:max-w-sm md:max-w-lg text-center text-gray-300 italic text-xs sm:text-sm z-10 bg-black bg-opacity-20 backdrop-blur-sm rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.5 }}
        whileHover={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      >
        <p>
          This page has no purpose—just wise, complex words, like life itself.
          Enjoy the randomness while it lasts!
        </p>
      </motion.div>

      {/* Button with enhanced styling and animation */}
      <motion.a
        href="/about"
        className="mt-8 sm:mt-12 px-7 sm:px-9 py-3 sm:py-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-all z-10 text-sm sm:text-base flex items-center gap-2 relative overflow-hidden group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="absolute inset-0 w-0 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full"></span>
        <span className="relative z-10">About Me</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.a>
    </div>
  );
}
