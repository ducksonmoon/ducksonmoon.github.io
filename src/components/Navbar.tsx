import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full h-16 bg-background p-4 fixed top-0 z-50">
      <div className="max-w-5xl mx-auto flex justify-between items-center h-full">
        <h1 className="text-xl font-bold text-primary">
          Mehrshad Baqerzadegan
        </h1>
        <ul className="flex space-x-6">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/experience">Experience</Link>
          </li>
          <li>
            <Link href="/projects">Projects</Link>
          </li>
          <li>
            <Link href="/skills">Skills</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
