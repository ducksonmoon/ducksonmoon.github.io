"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { FaCode, FaLaptopCode, FaDatabase, FaVial, FaBrain, FaRobot, FaCloudUploadAlt, FaToolbox, FaFileDownload, FaGithub, FaLinkedinIn, FaTwitter, FaEnvelope, FaChevronUp } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const skills = [
  {
    category: "Programming Languages",
    icon: FaCode,
    items: ["JavaScript (ES6+)", "TypeScript", "Python", "C#", "HTML5/CSS3"],
  },
  {
    category: "Frameworks/Libraries",
    icon: FaLaptopCode,
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
    icon: FaVial,
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
    icon: FaDatabase,
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

const learningTopics = [
  {
    title: "Artificial Intelligence",
    description: "Exploring machine learning algorithms and neural networks for intelligent applications",
    icon: FaBrain,
    color: "from-blue-400 to-purple-500"
  },
  {
    title: "Generative AI",
    description: "Delving into generative models and their applications in creative content development",
    icon: FaRobot,
    color: "from-purple-400 to-pink-500"
  },
  {
    title: "Cloud Architecture",
    description: "Advancing my knowledge in scalable cloud infrastructure and serverless applications",
    icon: FaCloudUploadAlt,
    color: "from-cyan-400 to-blue-500"
  },
  {
    title: "Systems Design",
    description: "Studying advanced patterns for building highly available and performant distributed systems",
    icon: FaToolbox,
    color: "from-amber-400 to-orange-500"
  }
];

// Social media links
const socialLinks = [
  {
    name: "GitHub",
    icon: FaGithub,
    url: "https://github.com/ducksonmoon/",
    color: "from-gray-500 to-gray-700"
  },
  {
    name: "LinkedIn",
    icon: FaLinkedinIn,
    url: "https://www.linkedin.com/in/mehrshad-baqerzadegan/",
    color: "from-blue-500 to-blue-700"
  },
  {
    name: "Twitter",
    icon: FaTwitter,
    url: "https://x.com/sinfulspinoza/",
    color: "from-sky-500 to-sky-700"
  },
  {
    name: "Email",
    icon: FaEnvelope,
    url: "mailto:MehrshadBaqerzadegan@gmail.com",
    color: "from-red-500 to-red-700"
  }
];

const SectionHeader = ({ title }) => (
  <div className="relative mb-16">
    <h1 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#6d28d9]">
      {title}
    </h1>
    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#38bdf8] to-[#6d28d9] rounded-full"></div>
  </div>
);

const fadeInUpVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const SkillCard = ({ skill, index }) => (
  <motion.div
    initial="initial"
    whileInView="animate"
    viewport={{ once: true, margin: "-50px" }}
    variants={fadeInUpVariants}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="flex flex-col items-start bg-gradient-to-b from-[#1a1e24] to-[#141a20] p-8 rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#38bdf8]/10 transition-all duration-300 border border-[#2a3038]"
  >
    <div className="flex-shrink-0 mb-4 p-3 bg-[#1e262f] rounded-lg">
      <skill.icon className="text-[#38bdf8] text-3xl" />
    </div>
    <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#6d28d9]">
      {skill.category}
    </h2>
    <ul className="space-y-2 mt-2 w-full">
      {skill.items.map((item, i) => (
        <li key={i} className="text-lg text-gray-300 flex items-center">
          <span className="mr-2 text-xs text-[#38bdf8]">•</span>
          {item}
        </li>
      ))}
    </ul>
  </motion.div>
);

// Learning topic card component
const LearningTopicCard = ({ topic, index }) => (
  <motion.div
    initial="initial"
    whileInView="animate"
    viewport={{ once: true, margin: "-50px" }}
    variants={fadeInUpVariants}
    transition={{ duration: 0.5, delay: index * 0.15 }}
    className="bg-gradient-to-br from-[#1a1e24] to-[#15191f] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-[#2a3038] group"
  >
    <div className={`h-2 w-full bg-gradient-to-r ${topic.color}`}></div>
    <div className="p-6">
      <div className="flex items-start mb-4">
        <div className="p-3 rounded-lg bg-[#1e262f] mr-4 group-hover:bg-gradient-to-br group-hover:from-[#1e262f] group-hover:to-[#2a3038] transition-all duration-300">
          <topic.icon className={`text-3xl bg-gradient-to-r ${topic.color} text-transparent bg-clip-text`} />
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-[#38bdf8] to-[#6d28d9] text-transparent bg-clip-text">
          {topic.title}
        </h3>
      </div>
      <p className="text-gray-300 text-base">
        {topic.description}
      </p>
    </div>
  </motion.div>
);

// Social icon component
const SocialIcon = ({ social, index }) => (
  <motion.a
    href={social.url}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    whileHover={{ 
      scale: 1.1,
      transition: { duration: 0.2 }
    }}
    whileTap={{ scale: 0.95 }}
    className="relative group"
  >
    <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${social.color} blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
    <div className="relative flex items-center justify-center w-16 h-16 bg-[#1a1e24] rounded-full border border-[#2a3038] shadow-lg z-10 overflow-hidden">
      <social.icon className={`text-2xl text-white z-20`} />
      <div className={`absolute inset-0 bg-gradient-to-r ${social.color} opacity-0 group-hover:opacity-80 transition-opacity duration-300`}></div>
    </div>
    <span className="sr-only">{social.name}</span>
  </motion.a>
);

// Back to top button component
const BackToTopButton = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show button when page is scrolled down 300px
      setIsVisible(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <motion.button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-[#1a1e24] border border-[#2a3038] shadow-lg flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="none" 
          stroke="#38bdf8" 
          strokeWidth="3"
          strokeDasharray="283"
          strokeDashoffset="283"
          style={{ strokeDashoffset: 283 * (1 - scrollYProgress.get()), opacity: 0.5 }}
        />
      </svg>
      <FaChevronUp className="text-[#38bdf8] text-lg z-10" />
    </motion.button>
  );
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#101418] to-[#0a0c0f] text-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">
        {/* About Me Section */}
        <motion.div
          id="about"
          className="p-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 bg-gradient-to-br from-[#1a1e24] to-[#15191f] rounded-2xl shadow-xl border border-[#2a3038]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#38bdf8] to-[#6d28d9] blur-md opacity-70 animate-pulse"></div>
            <Image
              src="/profile-fox.jpg"
              alt="Mehrshad's Profile Picture"
              width={220}
              height={220}
              className="relative rounded-full border-4 border-[#38bdf8] shadow-lg z-10"
            />
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <motion.h1 
              className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#6d28d9]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Hey, I'm Mehrshad!
            </motion.h1>
            <motion.p 
              className="text-xl leading-relaxed max-w-3xl text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Senior Frontend Engineer with 5+ years of experience developing both enterprise (B2B) and consumer (B2C) web applications.
              Proficient in JavaScript and TypeScript, with expertise in Angular and React for professional projects, and Node.js and Nest.js
              for side projects. Skilled at crafting system designs and micro frontend architecture. Open to working with different stacks and
              frameworks.
            </motion.p>
            
            {/* Resume Download Button */}
            <motion.a
              href="/resume-Mehrshad-Baqerzadegan.pdf" 
              download
              className="group relative mt-8 inline-flex items-center gap-2 px-6 py-3 overflow-hidden rounded-lg bg-gradient-to-br from-[#1a1e24] to-[#15191f] border border-[#2a3038] text-lg font-medium text-white shadow-md transition-all duration-300 hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="absolute inset-0 scale-x-0 rounded-lg bg-gradient-to-r from-[#38bdf8] to-[#6d28d9] opacity-40 transition-transform duration-300 ease-out origin-left group-hover:scale-x-100"></span>
              <FaFileDownload className="text-[#38bdf8] group-hover:text-white transition-colors duration-300 z-10" />
              <span className="z-10 bg-gradient-to-r from-[#38bdf8] to-[#6d28d9] bg-clip-text text-transparent group-hover:text-white transition-colors duration-300">
                Download Resume
              </span>
            </motion.a>
          </div>
        </motion.div>

        {/* What I'm Currently Learning Section */}
        <div id="learning" className="space-y-16">
          <SectionHeader title="What I'm Currently Learning" />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xl text-center max-w-3xl mx-auto mb-10 text-gray-300"
          >
            I believe in continuous growth and staying ahead in this ever-evolving tech landscape. 
            Here are some areas I'm currently exploring and developing expertise in:
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {learningTopics.map((topic, index) => (
              <LearningTopicCard key={index} topic={topic} index={index} />
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div id="skills" className="space-y-16">
          <SectionHeader title="My Skill Set" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <SkillCard key={index} skill={skill} index={index} />
            ))}
          </div>
        </div>

        {/* Contact Me Section */}
        <div id="contact" className="space-y-16">
          <SectionHeader title="Let's Connect" />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-xl text-gray-300 mb-12">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to reach out through any of these platforms.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              {socialLinks.map((social, index) => (
                <SocialIcon key={index} social={social} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  );
}
