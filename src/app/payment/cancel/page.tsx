import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi";

export default function PaymentCancelPage() {
  return (
    <div className="pt-16 min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiAlertCircle className="text-amber-500 text-4xl" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Payment Cancelled</h1>
        <p className="text-slate-500 mb-8">You cancelled the payment. Your enrollment was not processed.</p>
        <div className="flex flex-col gap-3">
          <Link href="/courses" id="cancel-back-btn"
            className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors">
            Back to Courses
          </Link>
          <Link href="/" className="py-3 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
