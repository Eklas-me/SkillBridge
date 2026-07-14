"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";
import { FiEye, FiTrash2, FiPlusCircle, FiBook, FiUsers, FiStar } from "react-icons/fi";
import { ICourse } from "@/types";
import toast from "react-hot-toast";

export default function ManageCoursesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [fetching, setFetching] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetch("/api/courses?limit=100")
        .then((r) => r.json())
        .then((d) => {
          if (d.success) {
            // Show only courses by current user
            const myCourses = d.data.filter((c: ICourse) => {
              const ins = typeof c.instructor === "object" ? c.instructor : null;
              return ins?._id === user._id || user.role === "admin";
            });
            setCourses(myCourses);
          }
        })
        .finally(() => setFetching(false));
    }
  }, [user]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/courses/${deleteId}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success("Course deleted");
      setCourses((prev) => prev.filter((c) => c._id !== deleteId));
    } else {
      toast.error(data.message);
    }
    setDeleting(false);
    setDeleteId(null);
  };

  if (loading || !user) return null;

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 py-10">
        <div className="container-custom flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">My Courses</h1>
            <p className="text-indigo-200 text-sm">{courses.length} course{courses.length !== 1 ? "s" : ""} published</p>
          </div>
          <Link href="/courses/add" id="manage-add-btn"
            className="flex items-center gap-2 bg-white text-indigo-700 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-md">
            <FiPlusCircle /> Add Course
          </Link>
        </div>
      </div>

      <div className="container-custom py-8">
        {fetching ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 flex gap-4 shadow-sm border border-slate-100">
                <div className="w-28 h-18 rounded-lg skeleton shrink-0" style={{ height: "72px" }} />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 w-3/4 rounded skeleton" />
                  <div className="h-3 w-1/2 rounded skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FiBook className="text-indigo-400 text-3xl" />
            </div>
            <h2 className="text-lg font-bold text-slate-700 mb-2">No courses yet</h2>
            <p className="text-slate-400 text-sm mb-6">Create your first course and start teaching!</p>
            <Link href="/courses/add" id="manage-empty-add-btn"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 transition-colors">
              <FiPlusCircle /> Add Your First Course
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Course</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Students</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Rating</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-10 rounded-lg overflow-hidden shrink-0">
                            <Image src={course.image || "https://placehold.co/400x225/4F46E5/fff"} alt={course.title} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 line-clamp-1">{course.title}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              course.level === "Beginner" ? "bg-emerald-50 text-emerald-600" :
                              course.level === "Intermediate" ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"
                            }`}>{course.level}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500">{course.category}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-700">৳{course.price}</td>
                      <td className="px-4 py-4">
                        <span className="flex items-center gap-1 text-sm text-slate-600"><FiUsers className="text-indigo-400" />{course.totalStudents || 0}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="flex items-center gap-1 text-sm text-amber-500"><FiStar className="fill-amber-400" />{course.rating?.toFixed(1) || "N/A"}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/courses/${course._id}`} id={`manage-view-${course._id}`}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                            <FiEye /> View
                          </Link>
                          <button id={`manage-delete-${course._id}`} onClick={() => setDeleteId(course._id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {courses.map((course) => (
                <div key={course._id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="flex gap-3 mb-3">
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0">
                      <Image src={course.image || "https://placehold.co/400x225/4F46E5/fff"} alt={course.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800 line-clamp-2">{course.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{course.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="font-semibold text-slate-700">৳{course.price}</span>
                    <span className="flex items-center gap-1"><FiUsers className="text-indigo-400" />{course.totalStudents || 0}</span>
                    <span className="flex items-center gap-1 text-amber-500"><FiStar className="fill-amber-400" />{course.rating?.toFixed(1) || "N/A"}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/courses/${course._id}`} className="flex-1 py-2 text-xs font-medium text-center text-indigo-600 bg-indigo-50 rounded-lg">View</Link>
                    <button onClick={() => setDeleteId(course._id)} className="flex-1 py-2 text-xs font-medium text-red-500 bg-red-50 rounded-lg">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="text-red-500 text-xl" />
            </div>
            <h3 className="text-base font-bold text-slate-800 text-center mb-2">Delete Course?</h3>
            <p className="text-sm text-slate-500 text-center mb-6">This action cannot be undone. All reviews will also be deleted.</p>
            <div className="flex gap-3">
              <button id="delete-cancel-btn" onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 border border-slate-200 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button id="delete-confirm-btn" onClick={handleDelete} disabled={deleting}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
