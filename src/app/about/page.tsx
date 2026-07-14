import Link from "next/link";
import { FiUsers, FiTarget, FiHeart, FiAward, FiGlobe, FiCode, FiLinkedin, FiGithub } from "react-icons/fi";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — SkillBridge",
  description: "Learn about SkillBridge's mission to make quality education accessible to everyone.",
};

const TEAM = [
  { name: "Arif Rahman", role: "CEO & Co-Founder", color: "bg-indigo-500", avatar: "AR", social: "#" },
  { name: "Nadia Islam", role: "Head of Curriculum", color: "bg-emerald-500", avatar: "NI", social: "#" },
  { name: "Tanvir Hassan", role: "Lead Developer", color: "bg-amber-500", avatar: "TH", social: "#" },
  { name: "Sadia Akter", role: "UX Design Lead", color: "bg-purple-500", avatar: "SA", social: "#" },
];

export default function AboutPage() {
  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 to-slate-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-96 h-96 bg-indigo-400 rounded-full absolute -top-20 -right-20 blur-3xl" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <span className="badge bg-white/10 text-white mb-4">Our Story</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            We&apos;re on a Mission to Make <br />
            <span className="bg-gradient-to-r from-indigo-300 to-emerald-300 bg-clip-text text-transparent">Quality Education Accessible</span>
          </h1>
          <p className="text-indigo-200 max-w-xl mx-auto leading-relaxed">
            SkillBridge was founded in 2023 with a simple belief: everyone deserves access to world-class education, regardless of their background or location.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge badge-primary mb-3">Our Mission</span>
              <h2 className="text-3xl font-bold text-slate-800 mb-5">Why We Built SkillBridge</h2>
              <p className="text-slate-500 leading-relaxed mb-4">
                We noticed that talented professionals in Bangladesh and South Asia struggled to access quality tech education at affordable prices. Traditional education was expensive, outdated, and disconnected from industry needs.
              </p>
              <p className="text-slate-500 leading-relaxed mb-6">
                SkillBridge bridges that gap by connecting world-class instructors with motivated learners through a platform built for the modern age.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <FiTarget className="text-indigo-600" />, label: "Goal-Oriented", desc: "Practical, career-focused courses" },
                  { icon: <FiHeart className="text-red-500" />, label: "Community First", desc: "Supportive learning environment" },
                  { icon: <FiGlobe className="text-emerald-600" />, label: "Global Reach", desc: "Learn from anywhere, anytime" },
                  { icon: <FiCode className="text-amber-600" />, label: "Industry Ready", desc: "Courses built with employers" },
                ].map((v) => (
                  <div key={v.label} className="bg-slate-50 rounded-xl p-4">
                    <div className="text-xl mb-2">{v.icon}</div>
                    <p className="text-sm font-semibold text-slate-800">{v.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <FiAward className="text-indigo-600 text-2xl" />, num: "500+", label: "Courses Available", bg: "bg-indigo-50" },
                { icon: <FiUsers className="text-emerald-600 text-2xl" />, num: "15K+", label: "Active Learners", bg: "bg-emerald-50" },
                { icon: <FiTarget className="text-amber-600 text-2xl" />, num: "120+", label: "Expert Instructors", bg: "bg-amber-50" },
                { icon: <FiHeart className="text-red-500 text-2xl" />, num: "4.9★", label: "Average Rating", bg: "bg-red-50" },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-6 text-center`}>
                  <div className="flex justify-center mb-3">{s.icon}</div>
                  <p className="text-2xl font-extrabold text-slate-800">{s.num}</p>
                  <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-slate-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="badge badge-secondary mb-3">The People Behind</span>
            <h2 className="text-3xl font-bold text-slate-800">Meet Our <span className="gradient-text">Team</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100 card-hover">
                <div className={`w-16 h-16 ${member.color} rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-md`}>
                  {member.avatar}
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">{member.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{member.role}</p>
                <div className="flex justify-center gap-2">
                  <a href={member.social} className="w-8 h-8 bg-slate-100 hover:bg-indigo-100 rounded-lg flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
                    <FiLinkedin size={14} />
                  </a>
                  <a href={member.social} className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors">
                    <FiGithub size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Ready to Start Learning?</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Join thousands of learners and take the next step in your career today.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/courses" id="about-explore-btn"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-md">
              Explore Courses
            </Link>
            <Link href="/contact" id="about-contact-btn"
              className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold text-sm rounded-xl transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
