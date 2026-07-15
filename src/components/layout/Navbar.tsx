"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";
import { FiBook, FiMenu, FiX, FiUser, FiLogOut, FiPlusCircle, FiList, FiPieChart, FiShoppingCart } from "react-icons/fi";
import toast from "react-hot-toast";

const publicLinks = [
  { href: "/", label: "Home", icon: null },
  { href: "/courses", label: "Courses", icon: null },
  { href: "/about", label: "About", icon: null },
];

const userLinks = [
  { href: "/", label: "Home", icon: null },
  { href: "/courses", label: "Courses", icon: null },
  { href: "/about", label: "About", icon: null },
];

const adminLinks = [
  { href: "/", label: "Home", icon: null },
  { href: "/courses", label: "Courses", icon: null },
  { href: "/admin", label: "Dashboard", icon: <FiPieChart /> },
  { href: "/about", label: "About", icon: null },
];

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cart, totalItems } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = !user ? publicLinks : user.role === "admin" ? adminLinks : userLinks;
  const isAdminRoute = pathname?.startsWith("/admin");

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
    setDropdownOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={isAdminRoute ? "/admin" : "/"} className="flex items-center gap-2 group" id="navbar-logo">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <FiBook className="text-white text-sm" />
            </div>
            <span className="text-xl font-bold text-slate-800">
              Skill<span className="text-indigo-600">Bridge</span>
            </span>
            {isAdminRoute && (
              <span className="ml-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[11px] font-bold rounded-full">Admin</span>
            )}
          </Link>

          {/* Desktop Links — hide on admin routes */}
          {!isAdminRoute && (
            <div className="hidden md:flex items-center gap-1">
              {links.map((l) => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  id={`nav-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === l.href
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {l.icon && <span className="text-base">{l.icon}</span>}
                  {l.label}
                </Link>
              ))}
            </div>
          )}

          {/* Auth buttons & Cart */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart Icon */}
            {!loading && user && user.role !== "admin" && (
              <Link href="/cart" className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors mr-1">
                <FiShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute top-0.5 right-0 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {loading ? (
              <div className="w-8 h-8 rounded-full skeleton" />
            ) : user ? (
              <div className="relative">
                <button
                  id="nav-profile-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all bg-white shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-24 truncate">{user.name}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{user.email}</p>
                    </div>
                    <Link
                      href={user.role === "admin" ? "/admin" : "/my-learning"}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {user.role === "admin" ? <FiPieChart className="text-indigo-500" /> : <FiList className="text-indigo-500" />} {user.role === "admin" ? "Dashboard" : "My Learning"}
                    </Link>
                    <button
                      id="nav-logout-btn"
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  id="nav-login-btn"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  id="nav-register-btn"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Cart Icon */}
            {!loading && user && user.role !== "admin" && (
              <Link href="/cart" className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <FiShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            <button
              id="nav-mobile-menu-btn"
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="container-custom py-4 flex flex-col gap-2">
            {!isAdminRoute && links.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === l.href
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {l.icon} {l.label}
              </Link>
            ))}
            <div className="border-t border-slate-100 pt-3 flex flex-col gap-2 mt-1">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2">
                    <FiUser className="text-indigo-500" />
                    <span className="text-sm font-medium text-slate-700">{user.name}</span>
                  </div>
                  <Link
                    href={user.role === "admin" ? "/admin" : "/my-learning"}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
                  >
                    {user.role === "admin" ? <FiPieChart className="text-indigo-500" /> : <FiList className="text-indigo-500" />} {user.role === "admin" ? "Dashboard" : "My Learning"}
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <FiLogOut /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm font-medium text-center text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm font-semibold text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
