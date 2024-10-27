"use client";

import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaGlobe,
  FaGithub,
  FaCode,
  FaDatabase,
  FaTools,
} from "react-icons/fa";

const experiences = [
  {
    company: "System Group",
    role: "Senior Frontend Engineer",
    period: "Jun 2021 - Present",
    details: [
      "Developed 50+ web components with Angular and TypeScript.",
      "Led migration to microservices, improving UX by 30%.",
      "Mentored 3 junior developers, boosting their productivity by 50%.",
    ],
  },
];

const projects = [
  {
    name: "Cryptocurrency Wallet",
    description:
      "A PWA built with Angular and PrimeNG to manage crypto assets.",
    link: "https://github.com/ducksonmoon/crypto-wallet",
  },
];

const skills = [
  {
    category: "Programming Languages",
    icon: FaCode,
    items: ["JavaScript (ES6+)", "TypeScript", "Python", "C#", "HTML5/CSS3"],
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-24 text-[#e0e0e0] bg-[#101418]">
      <motion.div
        id="about"
        className="p-10 max-w-4xl mx-auto text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-bold mb-8 text-[#38bdf8]">
          Hey, I’m Mehrshad!
        </h1>
        <p className="text-xl leading-relaxed max-w-3xl mx-auto text-gray-300">
          I am a passionate frontend developer with over 5 years of experience
          creating seamless, elegant user interfaces. My expertise lies in
          crafting responsive designs, intuitive user experiences, and building
          web apps that make an impact.
        </p>
      </motion.div>

      {/* Work Experience Section */}
      <div id="experience" className="space-y-16">
        <h1 className="text-4xl font-bold mb-12 text-center text-[#38bdf8]">
          Work Experience
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="flex flex-col items-start bg-[#1a1e24] p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex-shrink-0 mb-4">
                <FaBriefcase className="text-[#38bdf8] text-4xl" />
              </div>
              <h2 className="text-3xl font-semibold mb-2">{exp.role}</h2>
              <p className="text-lg text-gray-400 mb-1">{exp.company}</p>
              <p className="text-sm text-gray-500 mb-4">{exp.period}</p>
              <ul className="list-disc list-inside space-y-2">
                {exp.details.map((detail, i) => (
                  <li key={i} className="leading-relaxed text-gray-300">
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <div id="projects" className="space-y-16">
        <h1 className="text-4xl font-bold mb-12 text-center text-[#38bdf8]">
          Featured Projects
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="flex flex-col items-start bg-[#1a1e24] p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex-shrink-0 mb-4">
                <FaGlobe className="text-[#38bdf8] text-4xl" />
              </div>
              <h2 className="text-3xl font-semibold mb-2">{project.name}</h2>
              <p className="text-lg text-gray-400 mb-4">
                {project.description}
              </p>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-[#38bdf8] hover:underline"
                >
                  <FaGithub />
                  <span>View on GitHub</span>
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div id="skills" className="space-y-16">
        <h1 className="text-4xl font-bold mb-12 text-center text-[#38bdf8]">
          My Skill Set
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="flex flex-col items-start bg-[#1a1e24] p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex-shrink-0 mb-4">
                <skill.icon className="text-[#38bdf8] text-4xl" />
              </div>
              <h2 className="text-3xl font-semibold mb-2">{skill.category}</h2>
              <ul className="list-disc list-inside space-y-2 mt-2">
                {skill.items.map((item, i) => (
                  <li key={i} className="text-lg text-gray-300">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
