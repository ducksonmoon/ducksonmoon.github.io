import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const socials = [
  { href: "https://github.com/ducksonmoon", icon: FaGithub, label: "GitHub" },
  {
    href: "https://www.linkedin.com/in/mehrshad-baqerzadegan",
    icon: FaLinkedin,
    label: "LinkedIn",
  },
  {
    href: "https://twitter.com/sinfulspinoza",
    icon: FaTwitter,
    label: "Twitter",
  },
];

export default function SocialIcons() {
  return (
    <div className="flex gap-3 sm:gap-4">
      {socials.map(({ href, icon: Icon, label }, index) => (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-gray-400 hover:text-[#00b4d8] text-xl sm:text-2xl transition-all"
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
