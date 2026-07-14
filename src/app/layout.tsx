import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SkillBridge — Learn From The Best",
  description:
    "SkillBridge is an online course marketplace offering top-quality courses in web development, data science, design, and more. Start learning today.",
  keywords: "online courses, e-learning, web development, programming, SkillBridge",
  openGraph: {
    title: "SkillBridge — Learn From The Best",
    description: "Discover thousands of courses and start your learning journey today.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { fontFamily: "Inter, sans-serif", fontSize: "14px", borderRadius: "10px" },
            }}
          />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
