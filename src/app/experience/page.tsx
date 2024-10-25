"use client";

import { motion } from "framer-motion";
import { FaBriefcase } from "react-icons/fa";

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
  {
    company: "Nebig",
    role: "Frontend Developer",
    period: "Oct 2019 - Jun 2021",
    details: [
      "Built a PWA with React and JavaScript for a responsive experience.",
      "Implemented CI/CD pipelines with Jenkins and Docker.",
      "Reduced bugs by 30% using Test-Driven Development (TDD).",
    ],
  },
];

export default function ExperiencePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Work Experience</h1>
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <div className="flex-shrink-0">
              <FaBriefcase className="text-primary text-3xl" />
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-semibold">{exp.role}</h2>
              <p className="text-lg text-gray-400 mb-1">{exp.company}</p>
              <p className="text-sm text-gray-500 mb-3">{exp.period}</p>
              <ul className="list-disc list-inside space-y-1">
                {exp.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
