import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ['500', '600', '700', '800', '900']
})

export const metadata = {
  title: {
    default: "UniHub - Academic Collaboration Platform",
    template: "%s | UniHub",
  },
  description:
    "UniHub is a next-generation academic collaboration and learning platform that connects students, faculty, and academic resources in one centralized ecosystem.",
  keywords: [
    "UniHub",
    "Academic Platform",
    "Learning Management System",
    "University Collaboration",
    "Student Portal",
    "Course Management",
    "Academic Resources",
    "Education Technology",
    "Online Learning",
    "Campus Management",
  ],
  authors: [{ name: "Ashraful Hoda Jamshed" }],
  creator: "Ashraful Hoda Jamshed",
  applicationName: "UniHub",
  metadataBase: new URL("https://unihub.com"),
  openGraph: {
    title: "UniHub - Academic Collaboration Platform",
    description:
      "A next-generation academic collaboration and learning ecosystem for students and faculty.",
    url: "https://unihub.com",
    siteName: "UniHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UniHub - Academic Collaboration Platform",
    description:
      "A next-generation academic collaboration and learning ecosystem for students and faculty.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
