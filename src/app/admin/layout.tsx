"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { FiHome, FiBookOpen, FiUsers, FiMenu, FiX, FiPieChart, FiExternalLink, FiShoppingBag } from "react-icons/fi";

const sidebarLinks = [
  { href: "/admin", label: "Overview", icon: <FiPieChart /> },
  { href: "/admin/courses", label: "Manage Courses", icon: <FiBookOpen /> },
  { href: "/admin/users", label: "Manage Users", icon: <FiUsers /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        router.replace("/");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16 flex">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-4 rounded-full shadow-lg"
      >
        {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 fixed top-16 bottom-0 bg-white border-r border-slate-200 shadow-sm z-10">
        <div className="p-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Admin Dashboard</h2>
          <nav className="space-y-2">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className={isActive ? "text-indigo-600" : "text-slate-400"}>{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Live Site</p>
            <div className="space-y-2">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
              >
                <FiExternalLink className="text-emerald-600" />
                View Homepage
              </a>
              <a
                href="/courses"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                <FiShoppingBag className="text-indigo-500" />
                Browse Courses
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar (Mobile) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <aside
            className="w-64 h-full bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 mt-16">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Admin Dashboard</h2>
              <nav className="space-y-2">
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span className={isActive ? "text-indigo-600" : "text-slate-400"}>{link.icon}</span>
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              {/* Live Site Buttons */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Live Site</p>
                <div className="space-y-2">
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                  >
                    <FiExternalLink className="text-emerald-600" />
                    View Homepage
                  </a>
                  <a
                    href="/courses"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  >
                    <FiShoppingBag className="text-indigo-500" />
                    Browse Courses
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
