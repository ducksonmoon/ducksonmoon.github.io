"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialIcons from "./SocialIcons";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent scrolling when menu is open on mobile
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="w-full h-16 bg-[#101418] px-4 sm:px-8 fixed top-0 z-50 shadow-md border-b border-[#1f2933]">
      <div className="max-w-6xl mx-auto flex justify-between items-center h-full">
        <Link
          href="/"
          className="text-xl sm:text-2xl font-medium text-[#e2e8f0] tracking-tight hover:text-[#38bdf8] transition-colors"
        >
          Mehrshad B.
        </Link>

        <button
          onClick={toggleMenu}
          className="relative z-50 flex items-center justify-center w-10 h-10 text-[#e2e8f0] text-xl sm:text-2xl md:hidden focus:outline-none rounded-md hover:bg-[#1a202c] transition-colors"
          aria-label="Toggle navigation menu"
        >
          <span className={`absolute w-5 h-0.5 bg-current transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`}></span>
          <span className={`absolute w-5 h-0.5 bg-current transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`absolute w-5 h-0.5 bg-current transform transition-transform duration-300 ease-in-out ${isMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`}></span>
        </button>

        {/* Backdrop overlay for mobile */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        <ul
          className={`flex-col md:flex-row items-center md:flex md:items-center space-y-6 md:space-y-0 md:space-x-8 fixed md:static top-16 left-0 w-full md:w-auto bg-[#101418] md:bg-transparent p-8 md:p-0 transition-all duration-300 ease-in-out transform ${
            isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full md:translate-x-0 opacity-0 md:opacity-100"
          } md:translate-x-0 border-b border-[#1f2933] md:border-0 shadow-lg md:shadow-none z-40 h-[calc(100vh-4rem)] md:h-auto overflow-y-auto`}
        >
          <div className="pb-6 border-b border-[#1f2933] mb-6 text-center md:hidden">
            <span className="text-gray-400 text-sm uppercase tracking-wider">Navigation</span>
          </div>

          {[
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: "About", path: "/about" },
          ].map((item) => (
            <li key={item.path} className="w-full md:w-auto text-center">
              <Link
                href={item.path}
                className={`block py-3 md:py-0 px-5 md:px-0 text-base sm:text-lg transition-colors hover:text-[#38bdf8] ${
                  pathname === item.path
                    ? "text-[#38bdf8] font-semibold border-l-4 md:border-l-0 border-[#38bdf8] md:border-none"
                    : "text-[#a0aec0] border-l-4 border-transparent md:border-l-0"
                } rounded-sm active:bg-[#1a202c] md:active:bg-transparent`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}

          <div className="flex md:hidden mt-8 pt-6 border-t border-[#1f2933] space-x-4 text-[#a0aec0] justify-center w-full">
            <SocialIcons />
          </div>
        </ul>

        <div className="hidden md:flex space-x-4 items-center text-[#a0aec0]">
          <SocialIcons />
        </div>
      </div>
    </nav>
  );
}
