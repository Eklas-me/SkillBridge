"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiBook, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name || form.name.length < 2) e.name = "Name must be at least 2 characters";
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email address";
    if (!form.password || form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = await register(form.name, form.email, form.password);
    setLoading(false);
    if (result.success) {
      toast.success("Account created! Welcome to SkillBridge 🎉");
      router.push("/");
    } else {
      toast.error(result.message);
    }
  };

  const strength = form.password.length >= 8 && /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) ? "strong" : form.password.length >= 6 ? "medium" : "weak";

  return (
    <div className="pt-16 min-h-screen bg-slate-50 flex">
      {/* Left */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-900 to-slate-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-48 h-48 bg-emerald-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <FiBook className="text-white text-3xl" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Join SkillBridge</h2>
          <p className="text-emerald-200 leading-relaxed mb-8">Start your learning journey today. Access 500+ courses for free.</p>
          {[
            "Access all courses",
            "Track your progress",
            "Earn certificates",
            "Learn at your pace",
          ].map((f) => (
            <div key={f} className="flex items-center gap-3 mb-3 text-left">
              <FiCheckCircle className="text-emerald-400 shrink-0" />
              <span className="text-emerald-100 text-sm">{f}</span>
            </div>
          ))}
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
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Create Account</h1>
            <p className="text-slate-500 text-sm">Join 15,000+ learners today</p>
          </div>

          <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
              <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-white ${errors.name ? "border-red-400" : "border-slate-200 focus-within:border-indigo-400"}`}>
                <FiUser className="text-slate-400 text-sm shrink-0" />
                <input id="register-name" type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="John Doe" className="flex-1 text-sm text-slate-700 outline-none bg-transparent" />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
              <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-white ${errors.email ? "border-red-400" : "border-slate-200 focus-within:border-indigo-400"}`}>
                <FiMail className="text-slate-400 text-sm shrink-0" />
                <input id="register-email" type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@example.com" className="flex-1 text-sm text-slate-700 outline-none bg-transparent" />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
              <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-white ${errors.password ? "border-red-400" : "border-slate-200 focus-within:border-indigo-400"}`}>
                <FiLock className="text-slate-400 text-sm shrink-0" />
                <input id="register-password" type={showPass ? "text" : "password"} value={form.password} onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Min. 6 characters" className="flex-1 text-sm text-slate-700 outline-none bg-transparent" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-slate-400">
                  {showPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              {form.password && (
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex gap-1 flex-1">
                    {["weak", "medium", "strong"].map((s, i) => (
                      <div key={s} className={`h-1 flex-1 rounded-full ${
                        (strength === "weak" && i === 0) ? "bg-red-400" :
                        (strength === "medium" && i <= 1) ? "bg-amber-400" :
                        (strength === "strong") ? "bg-emerald-400" : "bg-slate-200"
                      }`} />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${strength === "strong" ? "text-emerald-600" : strength === "medium" ? "text-amber-600" : "text-red-500"}`}>{strength}</span>
                </div>
              )}
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Confirm Password</label>
              <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-white ${errors.confirm ? "border-red-400" : "border-slate-200 focus-within:border-indigo-400"}`}>
                <FiLock className="text-slate-400 text-sm shrink-0" />
                <input id="register-confirm" type="password" value={form.confirm} onChange={(e) => handleChange("confirm", e.target.value)}
                  placeholder="Repeat password" className="flex-1 text-sm text-slate-700 outline-none bg-transparent" />
              </div>
              {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
            </div>

            <button id="register-submit-btn" type="submit" disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-60 shadow-md mt-2">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
