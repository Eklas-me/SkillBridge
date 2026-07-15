"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/providers/CartProvider";
import { FiCheckCircle, FiBookOpen } from "react-icons/fi";

export default function PaymentSuccessPage() {
  const { clearCart } = useCart();

  // Clear the cart after successful payment
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="pt-16 min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        {/* Animated checkmark */}
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <FiCheckCircle className="text-emerald-500 text-5xl" />
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h1>
        <p className="text-slate-500 mb-2">
          🎉 You have been successfully enrolled in your course(s).
        </p>
        <p className="text-sm text-slate-400 mb-8">
          Head to <strong>My Learning</strong> to start watching now!
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/my-learning"
            id="success-my-learning-btn"
            className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <FiBookOpen /> Go to My Learning
          </Link>
          <Link
            href="/courses"
            id="success-browse-btn"
            className="py-3 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            Browse More Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
