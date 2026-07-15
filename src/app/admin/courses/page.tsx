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
    if (user) {
      fetch("/api/courses?limit=100")
        .then((r) => r.json())
        .then((d) => {
          if (d.success) {
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
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Courses</h1>
          <p className="text-slate-500 mt-1">{courses.length} course{courses.length !== 1 ? "s" : ""} published</p>
        </div>
        <Link href="/admin/courses/add" id="manage-add-btn"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
          <FiPlusCircle /> Add Course
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {fetching ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-16 h-10 rounded-lg skeleton shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 w-1/3 rounded skeleton" />
                  <div className="h-3 w-1/4 rounded skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FiBook className="text-indigo-400 text-3xl" />
            </div>
            <h2 className="text-lg font-bold text-slate-700 mb-2">No courses yet</h2>
            <p className="text-slate-400 text-sm mb-6">Create your first course to start teaching.</p>
            <Link href="/admin/courses/add" id="manage-empty-add-btn"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 transition-colors">
              <FiPlusCircle /> Add Your First Course
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-10 rounded-lg overflow-hidden shrink-0 shadow-sm border border-slate-200">
                          <Image src={course.image || "https://placehold.co/400x225/4F46E5/fff"} alt={course.title} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 line-clamp-1 max-w-[200px]">{course.title}</p>
                          <span className={`text-[10px] mt-1 uppercase tracking-wider font-bold inline-block px-2 py-0.5 rounded-full ${
                            course.level === "Beginner" ? "bg-emerald-50 text-emerald-600" :
                            course.level === "Intermediate" ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"
                          }`}>{course.level}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{course.category}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">৳{course.price}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-sm text-slate-600 font-medium"><FiUsers className="text-indigo-400" />{course.totalStudents || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-sm font-bold text-amber-500"><FiStar className="fill-amber-400" />{course.rating?.toFixed(1) || "N/A"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/courses/${course._id}`} id={`manage-view-${course._id}`}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                          <FiEye /> View
                        </Link>
                        <button id={`manage-delete-${course._id}`} onClick={() => setDeleteId(course._id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="text-red-600 text-xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 text-center mb-2">Delete Course?</h3>
            <p className="text-sm text-slate-500 text-center mb-6">This action cannot be undone. All enrollments and reviews will also be removed.</p>
            <div className="flex gap-3">
              <button id="delete-cancel-btn" onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 border border-slate-200 text-sm font-bold text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button id="delete-confirm-btn" onClick={handleDelete} disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60">
                {deleting ? "Deleting..." : "Delete Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
