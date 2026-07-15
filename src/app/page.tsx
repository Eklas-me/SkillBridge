"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  FiSearch, FiArrowRight, FiStar, FiUsers, FiBook, FiAward,
  FiCode, FiSmartphone, FiDatabase, FiCpu, FiPenTool, FiCloud,
  FiShield, FiTrendingUp, FiCheckCircle, FiPlayCircle, FiChevronDown, FiChevronUp
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import CourseCard from "@/components/courses/CourseCard";
import SkeletonCard from "@/components/courses/SkeletonCard";
import { ICourse, StatsData } from "@/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ── Data ──────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Web Development", icon: <FiCode />, color: "bg-indigo-50 text-indigo-600", count: "120+ courses" },
  { name: "Mobile Development", icon: <FiSmartphone />, color: "bg-emerald-50 text-emerald-600", count: "80+ courses" },
  { name: "Data Science", icon: <FiDatabase />, color: "bg-amber-50 text-amber-600", count: "95+ courses" },
  { name: "Machine Learning", icon: <FiCpu />, color: "bg-purple-50 text-purple-600", count: "60+ courses" },
  { name: "UI/UX Design", icon: <FiPenTool />, color: "bg-pink-50 text-pink-600", count: "70+ courses" },
  { name: "Cloud Computing", icon: <FiCloud />, color: "bg-sky-50 text-sky-600", count: "50+ courses" },
  { name: "Cyber Security", icon: <FiShield />, color: "bg-red-50 text-red-600", count: "45+ courses" },
  { name: "Digital Marketing", icon: <FiTrendingUp />, color: "bg-orange-50 text-orange-600", count: "65+ courses" },
];

const INSTRUCTORS = [
  { name: "Sarah Johnson", title: "Senior Web Developer", students: "12K", rating: 4.9, avatar: "SJ", color: "bg-indigo-500" },
  { name: "James Lee", title: "ML Engineer @ Google", students: "9K", rating: 4.8, avatar: "JL", color: "bg-emerald-500" },
  { name: "Priya Sharma", title: "UX Design Lead", students: "7K", rating: 4.9, avatar: "PS", color: "bg-amber-500" },
  { name: "David Kim", title: "Cloud Architect", students: "8K", rating: 4.7, avatar: "DK", color: "bg-purple-500" },
];

const TESTIMONIALS = [
  {
    text: "SkillBridge completely changed my career. I went from a junior dev to a senior engineer in 8 months thanks to the web development courses.",
    name: "Rahim Uddin", role: "Senior Developer", rating: 5, avatar: "RU", color: "bg-indigo-500",
  },
  {
    text: "The data science course was incredibly well-structured. Real projects, amazing instructors, and a supportive community.",
    name: "Fatima Noor", role: "Data Analyst", rating: 5, avatar: "FN", color: "bg-emerald-500",
  },
  {
    text: "Best investment I've made in my education. The courses are practical, up-to-date, and the instructors are world-class.",
    name: "Alex Chen", role: "Freelance Designer", rating: 5, avatar: "AC", color: "bg-amber-500",
  },
];

const FAQS = [
  { q: "How do I enroll in a course?", a: "Simply create an account, browse courses, click 'View Details', and proceed to checkout. After payment, you're instantly enrolled." },
  { q: "Are the courses self-paced?", a: "Yes! All courses are 100% self-paced. Learn at your own schedule, anytime and anywhere." },
  { q: "What payment methods are supported?", a: "We support all major credit/debit cards, bKash, Nagad, and Rocket through our secure SSLCommerz payment gateway." },
  { q: "Can I get a refund?", a: "Yes, we offer a 7-day money-back guarantee if you're not satisfied with the course content." },
  { q: "How do I become an instructor?", a: "Register an account, go to 'Add Course', fill in the details and publish. Our team reviews and approves courses within 24 hours." },
];

const PIE_COLORS = ["#4f46e5", "#059669", "#d97706", "#7c3aed"];

// ── Animated Counter ──────────────────────────────────────────────────────────
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = Math.ceil(end / 60);
        const timer = setInterval(() => {
          start = Math.min(start + step, end);
          setCount(start);
          if (start >= end) clearInterval(timer);
        }, 25);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [stats, setStats] = useState<StatsData>({ totalStudents: 0, totalCourses: 0, totalInstructors: 0, totalReviews: 0 });
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/courses?limit=8&sort=popular")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCourses(d.data);
      })
      .catch((err) => console.error("Fetch courses error:", err))
      .finally(() => setLoadingCourses(false));

    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.data); });

    const t = setInterval(() => setActiveTestimonial((p) => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/courses?search=${encodeURIComponent(search)}`);
  };

  const chartData = [
    { name: "Courses", value: stats.totalCourses || 520 },
    { name: "Students", value: stats.totalStudents || 15000 },
    { name: "Instructors", value: stats.totalInstructors || 120 },
    { name: "Reviews", value: stats.totalReviews || 8500 },
  ];

  return (
    <div className="pt-16">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="min-h-[65vh] flex items-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-amber-600/10 rounded-full blur-2xl" />

        <div className="container-custom relative z-10 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <FiAward className="text-amber-400 text-sm" />
              <span className="text-white/90 text-xs font-medium">#1 Online Learning Platform in Bangladesh</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-5">
              Learn Skills That{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                Transform
              </span>{" "}
              Your Future
            </h1>

            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              Access 500+ expert-led courses in tech, design, and business. Learn at your own pace and launch the career of your dreams.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white rounded-2xl p-2 shadow-2xl max-w-xl mx-auto mb-8">
              <FiSearch className="text-slate-400 ml-2 text-lg shrink-0" />
              <input
                id="hero-search-input"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for courses..."
                className="flex-1 text-sm text-slate-700 outline-none px-2 bg-transparent"
              />
              <button
                id="hero-search-btn"
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shrink-0"
              >
                Search
              </button>
            </form>

            {/* CTA */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/courses"
                id="hero-explore-btn"
                className="flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-lg"
              >
                Explore Courses <FiArrowRight />
              </Link>
              <Link
                href="/register"
                id="hero-start-btn"
                className="flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 font-semibold text-sm px-6 py-3 rounded-xl transition-all"
              >
                <FiPlayCircle /> Start for Free
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex items-center justify-center gap-8 mt-10 flex-wrap">
              {[
                { icon: <FiBook />, val: "500+", label: "Courses" },
                { icon: <FiUsers />, val: "15K+", label: "Students" },
                { icon: <FiStar />, val: "4.9", label: "Avg Rating" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2 text-white/80">
                  <span className="text-indigo-400">{s.icon}</span>
                  <span className="font-bold text-white">{s.val}</span>
                  <span className="text-sm">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────────────────────── */}
      <section className="section-padding bg-white" id="categories">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="badge badge-primary mb-3">Explore by Category</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
              Popular <span className="gradient-text">Categories</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">Find the perfect course in your area of interest. We cover all major tech disciplines.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/courses?category=${encodeURIComponent(cat.name)}`}
                id={`category-${cat.name.toLowerCase().replace(/\s/g, "-")}`}
                className="flex flex-col items-center text-center p-5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all duration-300 group bg-white"
              >
                <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">{cat.name}</h3>
                <span className="text-xs text-slate-400">{cat.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Courses ───────────────────────────────────────────────── */}
      <section className="section-padding bg-slate-50" id="featured-courses">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="badge badge-secondary mb-3">Handpicked for You</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                Featured <span className="gradient-text">Courses</span>
              </h2>
            </div>
            <Link href="/courses" id="featured-view-all" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:gap-3 transition-all">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingCourses
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : courses.map((c) => <CourseCard key={c._id} course={c} />)}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
              View All Courses <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Statistics ─────────────────────────────────────────────────────── */}
      <section className="section-padding bg-white" id="statistics">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="badge badge-accent mb-3">Our Impact</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              Numbers That <span className="gradient-text">Speak</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Counters */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: <FiBook className="text-indigo-600" />, end: stats.totalCourses || 520, suffix: "+", label: "Total Courses", bg: "bg-indigo-50" },
                { icon: <FiUsers className="text-emerald-600" />, end: stats.totalStudents || 15000, suffix: "+", label: "Happy Students", bg: "bg-emerald-50" },
                { icon: <FiAward className="text-amber-600" />, end: stats.totalInstructors || 120, suffix: "+", label: "Expert Instructors", bg: "bg-amber-50" },
                { icon: <FiStar className="text-purple-600" />, end: stats.totalReviews || 8500, suffix: "+", label: "Reviews", bg: "bg-purple-50" },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-6 text-center`}>
                  <div className="flex justify-center mb-3 text-2xl">{s.icon}</div>
                  <p className="text-3xl font-extrabold text-slate-800 mb-1">
                    <Counter end={s.end} suffix={s.suffix} />
                  </p>
                  <p className="text-sm text-slate-500 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
            {/* Recharts Bar Chart */}
            <div className="bg-slate-50 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-slate-700 mb-4">Platform Overview</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barSize={32}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }}
                  />
                  <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <section className="section-padding bg-gradient-to-br from-indigo-50 to-slate-50" id="how-it-works">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="badge badge-primary mb-3">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              How <span className="gradient-text">SkillBridge</span> Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-indigo-200 to-emerald-200 z-0" />
            {[
              { step: "01", icon: <FiSearch className="text-2xl text-indigo-600" />, title: "Browse Courses", desc: "Explore 500+ expert-led courses across 8 categories. Filter by level, price, and rating.", bg: "bg-indigo-50" },
              { step: "02", icon: <FiBook className="text-2xl text-emerald-600" />, title: "Enroll & Pay", desc: "Securely enroll via SSLCommerz. Pay with card, bKash, Nagad, or Rocket.", bg: "bg-emerald-50" },
              { step: "03", icon: <FiAward className="text-2xl text-amber-600" />, title: "Learn & Grow", desc: "Start learning at your own pace, earn certificates, and land your dream job.", bg: "bg-amber-50" },
            ].map((s) => (
              <div key={s.step} className="relative z-10 bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center card-hover">
                <div className={`w-16 h-16 ${s.bg} rounded-2xl flex items-center justify-center mx-auto mb-5`}>{s.icon}</div>
                <span className="text-4xl font-black text-slate-100 absolute top-4 right-4">{s.step}</span>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Instructors ────────────────────────────────────────────────── */}
      <section className="section-padding bg-white" id="instructors">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="badge badge-secondary mb-3">Learn from the Best</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              Top <span className="gradient-text">Instructors</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INSTRUCTORS.map((ins) => (
              <div key={ins.name} className="bg-slate-50 rounded-2xl p-6 text-center card-hover border border-slate-100">
                <div className={`w-16 h-16 ${ins.color} rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-md`}>
                  {ins.avatar}
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">{ins.name}</h3>
                <p className="text-xs text-slate-500 mb-3">{ins.title}</p>
                <div className="flex items-center justify-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-amber-500"><FiStar className="fill-amber-500" /> {ins.rating}</span>
                  <span className="flex items-center gap-1 text-slate-500"><FiUsers /> {ins.students} students</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────────── */}
      <section className="section-padding bg-gradient-to-br from-indigo-900 to-slate-900 relative overflow-hidden" id="testimonials">
        <div className="absolute inset-0 opacity-10">
          <div className="w-96 h-96 bg-indigo-400 rounded-full absolute -top-20 -left-20 blur-3xl" />
          <div className="w-72 h-72 bg-emerald-400 rounded-full absolute -bottom-10 -right-10 blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <span className="badge bg-white/10 text-white mb-3">Student Stories</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              What Our <span className="bg-gradient-to-r from-indigo-300 to-emerald-300 bg-clip-text text-transparent">Students Say</span>
            </h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center transition-all duration-500">
              <div className="flex justify-center mb-4 gap-1">
                {Array.from({ length: TESTIMONIALS[activeTestimonial].rating }).map((_, i) => (
                  <FiStar key={i} className="text-amber-400 fill-amber-400 text-lg" />
                ))}
              </div>
              <p className="text-slate-200 text-lg leading-relaxed mb-6 italic">
                &quot;{TESTIMONIALS[activeTestimonial].text}&quot;
              </p>
              <div className={`w-12 h-12 ${TESTIMONIALS[activeTestimonial].color} rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2`}>
                {TESTIMONIALS[activeTestimonial].avatar}
              </div>
              <p className="text-white font-semibold">{TESTIMONIALS[activeTestimonial].name}</p>
              <p className="text-slate-400 text-sm">{TESTIMONIALS[activeTestimonial].role}</p>
            </div>
            <div className="flex justify-center gap-2 mt-5">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeTestimonial ? "bg-white w-6" : "bg-white/30"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ─────────────────────────────────────────────────────── */}
      <section className="section-padding bg-white" id="newsletter">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <span className="badge bg-white/20 text-white mb-4">Stay Updated</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Get Free Course Updates
              </h2>
              <p className="text-indigo-200 mb-8 max-w-md mx-auto">
                Subscribe to get the latest courses, exclusive deals and learning tips delivered to your inbox.
              </p>
              <form
                id="newsletter-form"
                onSubmit={(e) => { e.preventDefault(); alert("Subscribed! Thank you."); }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  id="newsletter-subscribe-btn"
                  type="submit"
                  className="bg-white text-indigo-700 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors shrink-0"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="section-padding bg-slate-50" id="faq">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="badge badge-primary mb-3">Common Questions</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>
          <div className="max-w-2xl mx-auto flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <button
                  id={`faq-btn-${i}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-slate-800 text-sm hover:bg-slate-50 transition-colors"
                >
                  {faq.q}
                  {openFaq === i ? <FiChevronUp className="text-indigo-600 shrink-0" /> : <FiChevronDown className="text-slate-400 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────────────── */}
      <section className="section-padding bg-white" id="cta">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Ready to Start Your <span className="gradient-text">Learning Journey?</span>
          </h2>
          <p className="text-slate-500 mb-8 max-w-lg mx-auto">
            Join 15,000+ learners who are already building their dream careers with SkillBridge.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { icon: <FiCheckCircle className="text-indigo-500" />, text: "No hidden fees" },
              { icon: <FiCheckCircle className="text-indigo-500" />, text: "7-day money back" },
              { icon: <FiCheckCircle className="text-indigo-500" />, text: "Lifetime access" },
            ].map((f) => (
              <span key={f.text} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                {f.icon} {f.text}
              </span>
            ))}
          </div>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              href="/courses"
              id="cta-explore-btn"
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg"
            >
              Browse All Courses
            </Link>
            <Link
              href="/register"
              id="cta-register-btn"
              className="px-8 py-3.5 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold text-sm rounded-xl transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
