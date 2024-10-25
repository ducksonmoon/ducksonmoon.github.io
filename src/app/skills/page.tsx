"use client";

import { motion } from "framer-motion";
import { FaCode, FaDatabase, FaTools } from "react-icons/fa";

const skills = [
  {
    category: "Programming Languages",
    icon: FaCode,
    items: ["JavaScript (ES6+)", "TypeScript", "Python", "C#", "HTML5/CSS3"],
  },
  {
    category: "Frameworks & Libraries",
    icon: FaTools,
    items: [
      "React",
      "Next.js",
      "Angular",
      "Vue.js",
      "Redux",
      "Tailwind CSS",
      "Bootstrap",
      "Material-UI",
    ],
  },
  {
    category: "Databases & Tools",
    icon: FaDatabase,
    items: ["MySQL", "PostgreSQL", "MongoDB", "Firebase", "Docker"],
  },
];

export default function SkillsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Skills</h1>
      <div className="space-y-8">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <div className="flex-shrink-0">
              <skill.icon className="text-primary text-3xl" />
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-semibold">{skill.category}</h2>
              <ul className="list-disc list-inside space-y-1 mt-2">
                {skill.items.map((item, i) => (
                  <li key={i} className="text-lg text-gray-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
