import "./globals.css";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("../components/Navbar"));
const Footer = dynamic(() => import("../components/Footer"));

export const metadata = {
  title: "Mehrshad Baqerzadegan Portfolio",
  description: "Software Engineer, Frontend - Portfolio showcasing skills, projects, and experience in web development",
  icons: {
    icon: [
      { url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>🚀</text></svg>" },
    ],
  },
  openGraph: {
    title: "Mehrshad Baqerzadegan Portfolio",
    description: "Software Engineer, Frontend - Portfolio showcasing skills, projects, and experience in web development",
    url: "https://ducksonmoon.github.io/",
    siteName: "Mehrshad Baqerzadegan Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://ducksonmoon.github.io/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Mehrshad Baqerzadegan Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mehrshad Baqerzadegan",
    description: "Software Engineer, Frontend - Portfolio showcasing skills, projects, and experience in web development",
    creator: "@sinfulspinoza",
    images: ["https://ducksonmoon.github.io/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body className="flex flex-col min-h-screen pt-16 bg-background text-foreground">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
