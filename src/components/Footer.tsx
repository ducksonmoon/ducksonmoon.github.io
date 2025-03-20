export default function Footer() {
  return (
    <footer className="w-full py-6 sm:py-10 mt-8 sm:mt-16 text-center text-sm text-foreground shadow-md shadow-[#0a0d12]">
      <p className="text-xs text-gray-500 mt-2 px-4">
        &copy; {new Date().getFullYear()} to the moon 🚀.
      </p>
    </footer>
  );
}
