import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";

export default function PaymentSuccessPage() {
  return (
    <div className="pt-16 min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="text-emerald-500 text-4xl" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h1>
        <p className="text-slate-500 mb-8">You have been enrolled in the course. Start learning now!</p>
        <div className="flex flex-col gap-3">
          <Link href="/courses" id="success-browse-btn"
            className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors">
            Browse More Courses
          </Link>
          <Link href="/" className="py-3 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
