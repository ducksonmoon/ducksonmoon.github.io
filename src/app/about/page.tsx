"use client";

import { motion } from "framer-motion";
import { FaCode } from "react-icons/fa";
import Image from "next/image";

// const experiences = [
//   {
//     company: "System Group",
//     role: "Senior Frontend Engineer",
//     period: "Jun 2021 - Present",
//     details: [],
//   },
//   {
//     company: "Nebig",
//     role: "Frontend Developer",
//     period: "Oct 2019 - Jun 2021",
//     details: [],
//   },
// ];

// const projects = [
//   {
//     name: "Cryptocurrency Wallet",
//     description:
//       "A PWA built with Angular and PrimeNG to manage crypto assets.",
//     link: "https://github.com/ducksonmoon/crypto-wallet",
//   },
// ];

const skills = [
  {
    category: "Programming Languages",
    icon: FaCode,
    items: ["JavaScript (ES6+)", "TypeScript", "Python", "C#", "HTML5/CSS3"],
  },
  {
    category: "Frameworks/Libraries",
    icon: FaCode,
    items: [
      "React",
      "Next.js",
      "Angular",
      "Vue.js",
      "RxJS",
      "Angular Material",
      "Tailwind",
      "Bootstrap",
      "Redux",
      "Styled Components",
      "Axios",
      "Material‑UI",
      "Django",
      "Django REST",
      ".Net",
    ],
  },
  {
    category: "Testing Tools",
    icon: FaCode,
    items: [
      "Jest",
      "Karma",
      "Cypress",
      "Selenium",
      "React Testing Library",
      "Enzyme",
    ],
  },
  {
    category: "Databases",
    icon: FaCode,
    items: [
      "MySQL",
      "PostgreSQL",
      "SQLite",
      "MongoDB",
      "Django ORM",
      "LINQ",
      "Prisma",
      "SQLAlchemy",
    ],
  },
];

const SectionHeader = ({ title }) => (
  <h1 className="text-4xl font-bold mb-12 text-center text-[#38bdf8]">
    {title}
  </h1>
);

// const ExperienceCard = ({ experience }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 50 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.8 }}
//     className="flex flex-col items-start bg-[#1a1e24] p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
//   >
//     <div className="flex-shrink-0 mb-4">
//       <FaBriefcase className="text-[#38bdf8] text-4xl" />
//     </div>
//     <h2 className="text-3xl font-semibold mb-2">{experience.role}</h2>
//     <p className="text-lg text-gray-400 mb-1">{experience.company}</p>
//     <p className="text-sm text-gray-500 mb-4">{experience.period}</p>
//     <ul className="list-disc list-inside space-y-2">
//       {experience.details.map((detail, i) => (
//         <li key={i} className="leading-relaxed text-gray-300">
//           {detail}
//         </li>
//       ))}
//     </ul>
//   </motion.div>
// );

// const ProjectCard = ({ project }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 50 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.8 }}
//     className="flex flex-col items-start bg-[#1a1e24] p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
//   >
//     <div className="flex-shrink-0 mb-4">
//       <FaGlobe className="text-[#38bdf8] text-4xl" />
//     </div>
//     <h2 className="text-3xl font-semibold mb-2">{project.name}</h2>
//     <p className="text-lg text-gray-400 mb-4">{project.description}</p>
//     {project.link && (
//       <a
//         href={project.link}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="inline-flex items-center space-x-2 text-[#38bdf8] hover:underline"
//       >
//         <FaGithub />
//         <span>View on GitHub</span>
//       </a>
//     )}
//   </motion.div>
// );

const SkillCard = ({ skill }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
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
);

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-24 text-[#e0e0e0] bg-[#101418]">
      <motion.div
        id="about"
        className="p-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12 bg-[#1a1e24] rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/profile-fox.jpg"
          alt="Mehrshad's Profile Picture"
          width={200}
          height={200}
          className="rounded-full border-4 border-[#38bdf8] shadow-md"
        />
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-5xl font-bold mb-4 text-[#38bdf8]">
            Hey, I’m Mehrshad!
          </h1>
          <p className="text-lg leading-relaxed max-w-3xl text-gray-300">
            I'm Mehrshad Baqerzadegan, a Software Engineer dedicated to creating
            scalable, user-focused web applications. Over the past five years,
            I've worked on everything from crafting intuitive user interfaces to
            architecting complex systems, including an ERP module used by
            85,000+ clients. I specialize in writing clean, efficient, and
            reusable code, leveraging modern frameworks like React, Next.js, and
            Angular. Collaboration is at the heart of my work—I thrive on
            bringing ideas to life alongside talented teams, continually
            optimizing performance, and mentoring others in building
            high-quality software. To me, software engineering is about solving
            meaningful problems with simplicity and precision, and I'm always
            eager to tackle the next big challenge.
          </p>
        </div>
      </motion.div>

      {/* Work Experience Section */}
      {/* <div id="experience" className="space-y-16">
        <SectionHeader title="Work Experience" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {experiences.map((exp, index) => (
            <ExperienceCard key={index} experience={exp} />
          ))}
        </div>
      </div> */}

      {/* Projects Section */}
      {/* <div id="projects" className="space-y-16">
        <SectionHeader title="Featured Projects" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div> */}

      {/* Skills Section */}
      <div id="skills" className="space-y-16">
        <SectionHeader title="My Skill Set" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {skills.map((skill, index) => (
            <SkillCard key={index} skill={skill} />
          ))}
        </div>
      </div>
    </div>
  );
}
