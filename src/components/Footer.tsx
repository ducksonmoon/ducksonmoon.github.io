export default function Footer() {
  return (
    <footer className="w-full py-10 mt-16 text-center text-sm text-foreground shadow-md shadow-[#0a0d12]">
      <p className="text-xs text-gray-500 mt-2">
        &copy; {new Date().getFullYear()} All rights reserved.
      </p>
    </footer>
  );
}
