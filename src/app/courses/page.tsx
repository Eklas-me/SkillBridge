"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import CourseCard from "@/components/courses/CourseCard";
import SkeletonCard from "@/components/courses/SkeletonCard";
import { ICourse } from "@/types";

const CATEGORIES = ["Web Development","Mobile Development","Data Science","Machine Learning","UI/UX Design","Cloud Computing","Cyber Security","Digital Marketing"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const SORTS = [
  { value: "newest", label: "Newest First" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

function CoursesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [level, setLevel] = useState(searchParams.get("level") || "");
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get("maxPrice")) || 5000);
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (level) params.set("level", level);
    params.set("maxPrice", String(maxPrice));
    params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", "12");

    const res = await fetch(`/api/courses?${params.toString()}`);
    const data = await res.json();
    if (data.success) {
      setCourses(data.data);
      setTotal(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
    }
    setLoading(false);
  }, [search, category, level, maxPrice, sort, page]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const clearFilters = () => {
    setSearch(""); setCategory(""); setLevel(""); setMaxPrice(5000); setSort("newest"); setPage(1);
  };

  const hasFilters = search || category || level || maxPrice < 5000;

  const FilterSidebar = () => (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2"><FiFilter /> Filters</h3>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1">
            <FiX size={12} /> Clear All
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Category</p>
        <div className="space-y-2">
          {CATEGORIES.map((c) => (
            <label key={c} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio" name="category" value={c}
                checked={category === c}
                onChange={() => { setCategory(c); setPage(1); }}
                className="text-indigo-600"
              />
              <span className="text-sm text-slate-600 group-hover:text-indigo-600 transition-colors">{c}</span>
            </label>
          ))}
          {category && (
            <button onClick={() => setCategory("")} className="text-xs text-slate-400 hover:text-slate-600 mt-1">Show all categories</button>
          )}
        </div>
      </div>

      {/* Level */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Level</p>
        <div className="space-y-2">
          {LEVELS.map((l) => (
            <label key={l} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio" name="level" value={l}
                checked={level === l}
                onChange={() => { setLevel(l); setPage(1); }}
                className="text-indigo-600"
              />
              <span className="text-sm text-slate-600 group-hover:text-indigo-600 transition-colors">{l}</span>
            </label>
          ))}
          {level && (
            <button onClick={() => setLevel("")} className="text-xs text-slate-400 hover:text-slate-600 mt-1">Show all levels</button>
          )}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Max Price: ৳{maxPrice}</p>
        <input
          type="range" min={0} max={5000} step={100} value={maxPrice}
          onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1); }}
          className="w-full accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1"><span>৳0</span><span>৳5000</span></div>
      </div>
    </div>
  );

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 py-12">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-white mb-2">Explore Courses</h1>
          <p className="text-indigo-200 text-sm mb-6">Discover {total} courses to boost your skills</p>
          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <form
              onSubmit={(e) => { e.preventDefault(); setPage(1); fetchCourses(); }}
              className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-md"
            >
              <FiSearch className="text-slate-400 shrink-0" />
              <input
                id="courses-search-input"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="flex-1 text-sm text-slate-700 outline-none"
              />
              {search && <button type="button" onClick={() => { setSearch(""); setPage(1); }}><FiX className="text-slate-400" /></button>}
            </form>
            <select
              id="courses-sort-select"
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="bg-white border-0 rounded-xl px-4 py-2.5 text-sm text-slate-700 shadow-md outline-none font-medium"
            >
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <button
              id="courses-filter-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 shadow-md"
            >
              <FiFilter /> Filters
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        <div className="flex gap-6">
          {/* Sidebar — desktop */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20"><FilterSidebar /></div>
          </div>

          {/* Mobile sidebar */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-5 overflow-y-auto shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <button onClick={() => setSidebarOpen(false)}><FiX /></button>
                </div>
                <FilterSidebar />
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="flex-1">
            {/* Active filters chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {category && <span className="badge badge-primary gap-1">{category} <button onClick={() => setCategory("")}><FiX size={10} /></button></span>}
                {level && <span className="badge badge-secondary gap-1">{level} <button onClick={() => setLevel("")}><FiX size={10} /></button></span>}
                {maxPrice < 5000 && <span className="badge badge-accent gap-1">Max ৳{maxPrice} <button onClick={() => setMaxPrice(5000)}><FiX size={10} /></button></span>}
              </div>
            )}

            <p className="text-sm text-slate-500 mb-4">{loading ? "Searching..." : `${total} courses found`}</p>

            {/* Course grid — 4 cols desktop, 2 tablet, 1 mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {loading
                ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
                : courses.length === 0
                ? (
                  <div className="col-span-full text-center py-16">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-slate-500 font-medium">No courses found</p>
                    <button onClick={clearFilters} className="mt-3 text-indigo-600 text-sm font-medium hover:underline">Clear filters</button>
                  </div>
                )
                : courses.map((c) => <CourseCard key={c._id} course={c} />)
              }
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  id="courses-prev-page"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:border-indigo-300 transition-colors"
                >
                  <FiChevronLeft /> Prev
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    id={`courses-page-${i + 1}`}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      page === i + 1 ? "bg-indigo-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  id="courses-next-page"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:border-indigo-300 transition-colors"
                >
                  Next <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="pt-16 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading courses...</p>
        </div>
      </div>
    }>
      <CoursesContent />
    </Suspense>
  );
}
