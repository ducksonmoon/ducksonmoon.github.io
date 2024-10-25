"use client";

import { motion } from "framer-motion";
import { FaGlobe, FaGithub } from "react-icons/fa";

const projects = [
  {
    name: "Cryptocurrency Wallet",
    description:
      "A PWA built with Angular and PrimeNG to manage crypto assets.",
    link: "https://github.com/ducksonmoon/crypto-wallet",
  },
  {
    name: "ERP Module",
    description:
      "A frontend for an ERP system used by 85,000+ clients, built with Angular and TypeScript.",
    link: "",
  },
];

export default function ProjectsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Projects</h1>
      <div className="space-y-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <div className="flex-shrink-0">
              <FaGlobe className="text-primary text-3xl" />
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-semibold">{project.name}</h2>
              <p className="text-lg text-gray-400 mb-3">
                {project.description}
              </p>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-primary hover:underline"
                >
                  <FaGithub />
                  <span>View on GitHub</span>
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
