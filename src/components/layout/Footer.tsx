"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBook, FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiFacebook, FiTwitter } from "react-icons/fi";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 — Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 w-fit" id="footer-logo">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center">
                <FiBook className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-white">
                Skill<span className="text-indigo-400">Bridge</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Empowering learners worldwide with high-quality online courses. Start your learning journey today.
            </p>
            <div className="flex items-center gap-3">
              {[
                { href: "https://github.com", icon: <FiGithub />, id: "footer-github" },
                { href: "https://linkedin.com", icon: <FiLinkedin />, id: "footer-linkedin" },
                { href: "https://facebook.com", icon: <FiFacebook />, id: "footer-facebook" },
                { href: "https://twitter.com", icon: <FiTwitter />, id: "footer-twitter" },
              ].map((s) => (
                <a
                  key={s.id}
                  id={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/courses", label: "Browse Courses" },
                { href: "/courses/add", label: "Teach on SkillBridge" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href + l.label}>
                  <Link
                    href={l.href}
                    id={`footer-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors hover:translate-x-1 inline-block transition-transform duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Support */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-3">
              {[
                { href: "/contact", label: "Help Center" },
                { href: "/contact", label: "Report an Issue" },
                { href: "/about", label: "Privacy Policy" },
                { href: "/about", label: "Terms of Service" },
                { href: "/contact", label: "Refund Policy" },
              ].map((l, i) => (
                <li key={i}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMail className="text-indigo-400 mt-0.5 shrink-0" />
                <a href="mailto:support@skillbridge.com" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  support@skillbridge.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FiPhone className="text-indigo-400 mt-0.5 shrink-0" />
                <a href="tel:+8801700000000" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  +880 1700-000000
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FiMapPin className="text-indigo-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-400">
                  Bashundhara R/A, Dhaka, Bangladesh
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} SkillBridge. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Built with ❤️ using Next.js & TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
}
