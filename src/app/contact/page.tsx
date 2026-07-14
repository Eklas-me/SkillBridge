"use client";

import { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200)); // simulate send
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setSending(false);
  };

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-900 to-slate-900 py-16">
        <div className="container-custom text-center">
          <span className="badge bg-white/10 text-white mb-3">Get In Touch</span>
          <h1 className="text-4xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-indigo-200 max-w-md mx-auto">Have a question or feedback? We&apos;d love to hear from you. Our team responds within 24 hours.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info Cards */}
            <div className="space-y-4">
              {[
                { icon: <FiMail className="text-indigo-600 text-xl" />, title: "Email Us", info: "support@skillbridge.com", sub: "We reply within 24 hours", bg: "bg-indigo-50" },
                { icon: <FiPhone className="text-emerald-600 text-xl" />, title: "Call Us", info: "+880 1700-000000", sub: "Mon–Fri, 9am–6pm BST", bg: "bg-emerald-50" },
                { icon: <FiMapPin className="text-amber-600 text-xl" />, title: "Visit Us", info: "Bashundhara R/A", sub: "Dhaka-1229, Bangladesh", bg: "bg-amber-50" },
                { icon: <FiClock className="text-purple-600 text-xl" />, title: "Working Hours", info: "Mon – Friday", sub: "9:00 AM – 6:00 PM BST", bg: "bg-purple-50" },
              ].map((c) => (
                <div key={c.title} className={`${c.bg} rounded-2xl p-5 flex items-start gap-4`}>
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">{c.icon}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{c.title}</p>
                    <p className="text-sm text-slate-700 font-medium">{c.info}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Send a Message</h2>
              <form id="contact-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Your Name *</label>
                    <input id="contact-name" required type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="John Doe"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address *</label>
                    <input id="contact-email" required type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Subject *</label>
                  <input id="contact-subject" required type="text" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                    placeholder="How can we help?"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Message *</label>
                  <textarea id="contact-message" required rows={5} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us more about your question or feedback..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
                  />
                </div>
                <button id="contact-submit-btn" type="submit" disabled={sending}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-60 shadow-md">
                  <FiSend /> {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
