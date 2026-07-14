"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { FiMail, FiLock, FiEye, FiEyeOff, FiBook } from "react-icons/fi";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Invalid email";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success("Welcome back!");
      router.push("/");
    } else {
      toast.error(result.message);
    }
  };

  const demoLogin = async (type: "user" | "admin") => {
    const creds = type === "user"
      ? { email: "user@skillbridge.com", password: "User@123" }
      : { email: "admin@skillbridge.com", password: "Admin@123" };
    setEmail(creds.email);
    setPassword(creds.password);
    setLoading(true);
    const result = await login(creds.email, creds.password);
    setLoading(false);
    if (result.success) {
      toast.success(`Logged in as ${type}`);
      router.push("/");
    } else {
      toast.error("Demo login failed — seed the database first");
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-slate-50 flex">
      {/* Left — Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-900 to-slate-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-emerald-600/15 rounded-full blur-3xl" />
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <FiBook className="text-white text-3xl" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome Back!</h2>
          <p className="text-indigo-200 leading-relaxed">Sign in to continue your learning journey and access your enrolled courses.</p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[{ val: "500+", label: "Courses" }, { val: "15K+", label: "Students" }, { val: "4.9★", label: "Rating" }].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3">
                <p className="text-white font-bold text-lg">{s.val}</p>
                <p className="text-indigo-300 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FiBook className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-slate-800">Skill<span className="text-indigo-600">Bridge</span></span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Sign In</h1>
            <p className="text-slate-500 text-sm">Enter your credentials to continue</p>
          </div>

          {/* Demo Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button id="demo-user-btn" onClick={() => demoLogin("user")} disabled={loading}
              className="py-2 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-colors disabled:opacity-50">
              Demo User Login
            </button>
            <button id="demo-admin-btn" onClick={() => demoLogin("admin")} disabled={loading}
              className="py-2 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors disabled:opacity-50">
              Demo Admin Login
            </button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or continue with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
              <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-white transition-colors ${errors.email ? "border-red-400" : "border-slate-200 focus-within:border-indigo-400"}`}>
                <FiMail className="text-slate-400 text-sm shrink-0" />
                <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" className="flex-1 text-sm text-slate-700 outline-none bg-transparent" />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
              <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-white transition-colors ${errors.password ? "border-red-400" : "border-slate-200 focus-within:border-indigo-400"}`}>
                <FiLock className="text-slate-400 text-sm shrink-0" />
                <input id="login-password" type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" className="flex-1 text-sm text-slate-700 outline-none bg-transparent" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-slate-400 hover:text-slate-600">
                  {showPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <button id="login-submit-btn" type="submit" disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-60 shadow-md">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-600 font-semibold hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
