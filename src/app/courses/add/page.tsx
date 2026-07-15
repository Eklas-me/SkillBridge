"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { FiUpload, FiImage, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import Image from "next/image";

const CATEGORIES = ["Web Development","Mobile Development","Data Science","Machine Learning","UI/UX Design","Cloud Computing","Cyber Security","Digital Marketing"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function AddCoursePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "", shortDescription: "", fullDescription: "",
    price: "", category: "", level: "Beginner",
    image: "", duration: "", lessons: "", language: "English",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/login");
      else if (user.role !== "admin") router.replace("/");
    }
  }, [user, loading, router]);

  const set = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => { const n = { ...p }; delete n[k]; return n; });
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.success) {
      set("image", data.url);
      setImagePreview(data.url);
      toast.success("Image uploaded!");
    } else {
      toast.error("Image upload failed");
    }
    setUploading(false);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title || form.title.length < 5) e.title = "Title must be at least 5 characters";
    if (!form.shortDescription || form.shortDescription.length < 10) e.shortDescription = "Short description must be at least 10 characters";
    if (!form.fullDescription || form.fullDescription.length < 20) e.fullDescription = "Full description must be at least 20 characters";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) e.price = "Valid price is required";
    if (!form.category) e.category = "Please select a category";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        lessons: Number(form.lessons) || 20,
      }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Course created successfully! 🎉");
      router.push("/courses/manage");
    } else {
      toast.error(data.message);
    }
    setSubmitting(false);
  };

  if (loading || !user) return null;

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 py-10">
        <div className="container-custom">
          <h1 className="text-2xl font-bold text-white mb-1">Add New Course</h1>
          <p className="text-indigo-200 text-sm">Share your knowledge with thousands of learners</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <form id="add-course-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main fields */}
            <div className="lg:col-span-2 space-y-5">
              {/* Title */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-base font-bold text-slate-800 mb-4">Course Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Course Title *</label>
                    <input id="course-title" type="text" value={form.title} onChange={(e) => set("title", e.target.value)}
                      placeholder="e.g., Complete React Developer Course"
                      className={`w-full border rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${errors.title ? "border-red-400" : "border-slate-200"}`}
                    />
                    {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Short Description * <span className="text-slate-400 font-normal">(max 250 chars)</span></label>
                    <textarea id="course-short-desc" rows={2} value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)}
                      placeholder="A brief summary of what students will learn..."
                      className={`w-full border rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-400 resize-none ${errors.shortDescription ? "border-red-400" : "border-slate-200"}`}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.shortDescription ? <p className="text-xs text-red-500">{errors.shortDescription}</p> : <span />}
                      <p className="text-xs text-slate-400">{form.shortDescription.length}/250</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Description *</label>
                    <textarea id="course-full-desc" rows={6} value={form.fullDescription} onChange={(e) => set("fullDescription", e.target.value)}
                      placeholder="Detailed course description, topics covered, prerequisites..."
                      className={`w-full border rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-400 resize-none ${errors.fullDescription ? "border-red-400" : "border-slate-200"}`}
                    />
                    {errors.fullDescription && <p className="text-xs text-red-500 mt-1">{errors.fullDescription}</p>}
                  </div>
                </div>
              </div>

              {/* Pricing & Meta */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-base font-bold text-slate-800 mb-4">Pricing & Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Price (৳) *</label>
                    <input id="course-price" type="number" min={0} value={form.price} onChange={(e) => set("price", e.target.value)}
                      placeholder="499"
                      className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 ${errors.price ? "border-red-400" : "border-slate-200"}`}
                    />
                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category *</label>
                    <select id="course-category" value={form.category} onChange={(e) => set("category", e.target.value)}
                      className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 ${errors.category ? "border-red-400" : "border-slate-200"}`}
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Level *</label>
                    <select id="course-level" value={form.level} onChange={(e) => set("level", e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400"
                    >
                      {LEVELS.map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Duration</label>
                    <input id="course-duration" type="text" value={form.duration} onChange={(e) => set("duration", e.target.value)}
                      placeholder="e.g., 20 hours"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Number of Lessons</label>
                    <input id="course-lessons" type="number" min={1} value={form.lessons} onChange={(e) => set("lessons", e.target.value)}
                      placeholder="e.g., 40"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Language</label>
                    <input id="course-language" type="text" value={form.language} onChange={(e) => set("language", e.target.value)}
                      placeholder="English"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar — image & submit */}
            <div className="space-y-5">
              {/* Image */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h2 className="text-sm font-bold text-slate-800 mb-4">Course Thumbnail</h2>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }}
                />
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <Image src={imagePreview} alt="preview" width={400} height={225} className="w-full object-cover rounded-xl" />
                    <button onClick={() => { setImagePreview(""); set("image", ""); }}
                      className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md text-red-500">
                      <FiX size={14} />
                    </button>
                  </div>
                ) : (
                  <button id="course-image-upload-btn" type="button" onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-40 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors text-slate-400 disabled:opacity-60">
                    {uploading ? (
                      <><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /><span className="text-xs">Uploading...</span></>
                    ) : (
                      <><FiUpload className="text-2xl" /><span className="text-xs font-medium">Click to upload image</span><span className="text-xs">via ImgBB</span></>
                    )}
                  </button>
                )}
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Or paste Image URL</label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2">
                    <FiImage className="text-slate-400 text-sm shrink-0" />
                    <input id="course-image-url" type="url" value={form.image} onChange={(e) => { set("image", e.target.value); setImagePreview(e.target.value); }}
                      placeholder="https://..." className="flex-1 text-xs text-slate-600 outline-none" />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <button id="add-course-submit-btn" type="submit" disabled={submitting}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-60 shadow-md mb-3">
                  {submitting ? "Publishing..." : "Publish Course"}
                </button>
                <p className="text-xs text-center text-slate-400">Course will be visible immediately after publishing</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
