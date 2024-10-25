import SocialIcons from "./SocialIcons";
import { FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full py-6 bg-background flex flex-col items-center gap-4">
      <div className="flex gap-6">
        <SocialIcons />
        <a
          href="mailto:MehrshadBaqerzadegan@gmail.com"
          aria-label="Email"
          className="text-foreground hover:text-primary text-2xl transition-all"
        >
          <FaEnvelope />
        </a>
      </div>
      <p className="text-sm text-foreground">
        &copy; {new Date().getFullYear()} Mehrshad Baqerzadegan. All rights
        reserved.
      </p>
    </footer>
  );
}
