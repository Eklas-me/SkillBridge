"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";
import { FiBook, FiPlayCircle, FiClock } from "react-icons/fi";
import { ICourse } from "@/types";

export default function MyLearningPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [fetching, setFetching] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetch("/api/courses/my-learning")
        .then((r) => r.json())
        .then((d) => {
          if (d.success) {
            setCourses(d.data);
          }
        })
        .finally(() => setFetching(false));
    }
  }, [user]);

  if (loading || !user) return null;

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 py-10">
        <div className="container-custom">
          <h1 className="text-2xl font-bold text-white mb-1">My Learning</h1>
          <p className="text-indigo-200 text-sm">
            {courses.length} {courses.length === 1 ? "course" : "courses"} enrolled
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        {fetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 h-72 flex flex-col">
                <div className="w-full h-36 rounded-xl skeleton shrink-0" />
                <div className="flex-1 space-y-3 pt-4">
                  <div className="h-4 w-3/4 rounded skeleton" />
                  <div className="h-3 w-1/2 rounded skeleton" />
                  <div className="h-10 w-full rounded-xl skeleton mt-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FiBook className="text-indigo-400 text-3xl" />
            </div>
            <h2 className="text-lg font-bold text-slate-700 mb-2">You haven&apos;t enrolled in any courses yet</h2>
            <p className="text-slate-400 text-sm mb-6">Explore our catalog and start learning today!</p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col group">
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={course.image || "https://placehold.co/400x225/4F46E5/fff"}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiPlayCircle className="text-white text-4xl opacity-90" />
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <span className={`text-[10px] uppercase tracking-wider font-bold mb-2 inline-block w-fit px-2 py-0.5 rounded-full ${
                    course.level === "Beginner" ? "bg-emerald-50 text-emerald-600" :
                    course.level === "Intermediate" ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"
                  }`}>
                    {course.level}
                  </span>
                  
                  <h3 className="font-bold text-slate-800 text-base mb-2 line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-auto pt-4 border-t border-slate-100 mb-4">
                    <span className="flex items-center gap-1.5">
                      <FiClock className="text-indigo-400" /> {course.duration || "Self-paced"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiBook className="text-indigo-400" /> {course.lessons || 0} Lessons
                    </span>
                  </div>

                  <Link 
                    href={`/courses/${course._id}`}
                    className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-sm font-semibold rounded-xl text-center transition-colors"
                  >
                    Continue Learning
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
