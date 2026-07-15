"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiStar, FiUsers, FiClock, FiBook, FiBarChart, FiGlobe, FiArrowLeft, FiCheckCircle, FiShoppingCart } from "react-icons/fi";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/providers/CartProvider";
import CourseCard from "@/components/courses/CourseCard";
import { ICourse, IReview } from "@/types";
import toast from "react-hot-toast";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <FiStar key={s} className={`text-sm ${s <= rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
      ))}
    </div>
  );
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [course, setCourse] = useState<ICourse | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [related, setRelated] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "reviews">("overview");
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setCourse(d.data);
          setReviews(d.reviews || []);
          setRelated(d.related || []);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    if (!user) { toast.error("Please login to enroll"); router.push("/login"); return; }
    
    // Add to cart and redirect
    if (course && !isInCart(course._id)) {
      addToCart({
        id: course._id,
        title: course.title,
        price: course.price,
        image: course.image,
        instructorName: typeof course.instructor === "object" ? course.instructor.name : "Unknown",
      });
    }
    router.push("/cart");
  };

  const handleAddToCart = () => {
    if (!course) return;
    addToCart({
      id: course._id,
      title: course.title,
      price: course.price,
      image: course.image,
      instructorName: typeof course.instructor === "object" ? course.instructor.name : "Unknown",
    });
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please login to submit a review"); return; }
    setSubmitting(true);
    const res = await fetch(`/api/courses/${id}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: reviewRating, comment: reviewText }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Review submitted!");
      setReviews((prev) => [data.data, ...prev]);
      setReviewText("");
    } else {
      toast.error(data.message);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-slate-50">
        <div className="container-custom py-10 space-y-4">
          <div className="h-72 rounded-2xl skeleton" />
          <div className="h-6 w-1/2 rounded skeleton" />
          <div className="h-4 w-full rounded skeleton" />
          <div className="h-4 w-3/4 rounded skeleton" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center"><p className="text-slate-500 text-lg mb-4">Course not found</p>
          <Link href="/courses" className="text-indigo-600 font-medium hover:underline">← Back to Courses</Link></div>
      </div>
    );
  }

  const instructor = typeof course.instructor === "object" ? course.instructor : null;

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 py-12">
        <div className="container-custom">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-indigo-300 hover:text-white text-sm mb-6 transition-colors">
            <FiArrowLeft /> Back to Courses
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <span className="badge bg-indigo-500/30 text-indigo-200 mb-3">{course.category}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">{course.title}</h1>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">{course.shortDescription}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <span className="flex items-center gap-1.5"><StarRating rating={Math.round(course.rating)} /><span className="font-semibold text-white">{course.rating?.toFixed(1)}</span><span>({course.totalReviews} reviews)</span></span>
                <span className="flex items-center gap-1.5"><FiUsers className="text-indigo-400" />{course.totalStudents || 0} students</span>
                <span className="flex items-center gap-1.5"><FiBarChart className="text-emerald-400" />{course.level}</span>
              </div>
              {instructor && (
                <p className="mt-3 text-sm text-slate-400">
                  Created by <span className="text-indigo-300 font-medium">{instructor.name}</span>
                </p>
              )}
            </div>
            {/* Price Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="relative h-44">
                <Image src={course.image} alt={course.title} fill className="object-cover" />
              </div>
              <div className="p-5">
                <p className="text-3xl font-extrabold text-slate-800 mb-1">৳{course.price}</p>
                <p className="text-xs text-slate-400 mb-4">One-time payment · Lifetime access</p>
                
                <div className="space-y-3 mb-4">
                  {course && isInCart(course._id) ? (
                    <Link
                      href="/cart"
                      className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      View in Cart <FiArrowLeft className="rotate-180" />
                    </Link>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <FiShoppingCart /> Add to Cart
                    </button>
                  )}
                  
                  <button
                    id="course-enroll-btn"
                    onClick={handleEnroll}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-md"
                  >
                    Buy Now — ৳{course.price}
                  </button>
                </div>
                
                <p className="text-xs text-center text-slate-400">7-day money-back guarantee</p>
                <div className="mt-4 space-y-2">
                  {[
                    { icon: <FiClock className="text-indigo-500 text-xs" />, text: course.duration || "10 hours" },
                    { icon: <FiBook className="text-indigo-500 text-xs" />, text: `${course.lessons || 20} lessons` },
                    { icon: <FiGlobe className="text-indigo-500 text-xs" />, text: course.language || "English" },
                    { icon: <FiCheckCircle className="text-emerald-500 text-xs" />, text: "Certificate of completion" },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">{f.icon} {f.text}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="container-custom py-8">
        <div className="lg:w-2/3">
          {/* Tabs */}
          <div className="flex gap-1 border-b border-slate-200 mb-6">
            {(["overview", "specs", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                id={`course-tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab === "specs" ? "Key Info" : tab}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Course Overview</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{course.fullDescription}</p>
            </div>
          )}

          {/* Specs */}
          {activeTab === "specs" && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-5">Key Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Category", value: course.category },
                  { label: "Level", value: course.level },
                  { label: "Duration", value: course.duration || "10 hours" },
                  { label: "Lessons", value: `${course.lessons || 20} lessons` },
                  { label: "Language", value: course.language || "English" },
                  { label: "Price", value: `৳${course.price}` },
                  { label: "Students Enrolled", value: `${course.totalStudents || 0}` },
                  { label: "Rating", value: `${course.rating?.toFixed(1) || "N/A"} / 5` },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <FiCheckCircle className="text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">{f.label}</p>
                      <p className="text-sm font-semibold text-slate-700">{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {/* Submit Review */}
              {user && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-base font-bold text-slate-800 mb-4">Write a Review</h3>
                  <form id="review-form" onSubmit={handleReview} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Rating:</span>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} type="button" onClick={() => setReviewRating(s)} id={`review-star-${s}`}>
                          <FiStar className={`text-xl ${s <= reviewRating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      id="review-comment"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                      rows={3}
                      placeholder="Share your experience with this course..."
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
                    />
                    <button
                      id="review-submit-btn"
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg disabled:opacity-60"
                    >
                      {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                </div>
              )}
              {/* Reviews list */}
              {reviews.length === 0 ? (
                <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-slate-100">
                  <p className="text-slate-400">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                reviews.map((r) => {
                  const reviewer = typeof r.user === "object" ? r.user : null;
                  return (
                    <div key={r._id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {reviewer?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-slate-800">{reviewer?.name || "User"}</p>
                            <span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                          </div>
                          <StarRating rating={r.rating} />
                          <p className="text-sm text-slate-600 mt-2 leading-relaxed">{r.comment}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Related Courses */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Related Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((c) => <CourseCard key={c._id} course={c} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
