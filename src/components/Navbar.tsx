"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialIcons from "./SocialIcons";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="w-full h-16 bg-[#101418] px-8 fixed top-0 z-50 shadow-md border-b border-[#1f2933]">
      <div className="max-w-6xl mx-auto flex justify-between items-center h-full">
        <Link
          href="/"
          className="text-2xl font-medium text-[#e2e8f0] tracking-tight hover:text-[#38bdf8] transition-colors"
        >
          Mehrshad B.
        </Link>

        <button
          onClick={toggleMenu}
          className="text-[#e2e8f0] text-2xl md:hidden focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul
          className={`flex-col md:flex-row items-center md:flex space-x-8 space-y-4 md:space-y-0 fixed md:static top-16 left-0 w-full md:w-auto bg-[#101418] md:bg-transparent p-8 md:p-0 transition-transform transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          {[
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: "About", path: "/about" },
          ].map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`block text-lg transition-colors hover:text-[#38bdf8] ${
                  pathname === item.path
                    ? "text-[#38bdf8] font-semibold"
                    : "text-[#a0aec0]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}

          <div className="flex md:hidden mt-6 space-x-4 text-[#a0aec0]">
            <SocialIcons />
          </div>
        </ul>

        <div className="hidden md:flex space-x-4 items-center text-[#a0aec0] hover:text-[#38bdf8] transition-colors">
          <SocialIcons />
        </div>
      </div>
    </nav>
  );
}
