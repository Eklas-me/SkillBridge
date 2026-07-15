"use client";

import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiTrash2, FiArrowRight, FiShoppingCart } from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cart, removeFromCart, totalPrice, clearCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to checkout");
      router.push("/login");
      return;
    }

    if (cart.length === 0) return;

    setCheckingOut(true);
    try {
      // Modify checkout logic to send an array of course IDs
      const courseIds = cart.map(c => c.id);
      
      const res = await fetch("/api/payment/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseIds }),
      });

      const data = await res.json();
      if (data.success && data.url) {
        // Redirect to SSLCommerz
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Failed to initiate payment");
      }
    } catch (error) {
      toast.error("An error occurred during checkout");
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) return null;

  return (
    <div className="pt-24 pb-16 min-h-[80vh] bg-slate-50">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiShoppingCart className="text-indigo-400 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-3">Your cart is empty</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              Looks like you haven&apos;t added any courses yet. Explore our catalog and find something to learn!
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-6 group hover:shadow-md transition-shadow">
                  <div className="relative w-full sm:w-40 aspect-video rounded-xl overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between w-full">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg mb-1 line-clamp-2">{item.title}</h3>
                      <p className="text-sm text-slate-500 mb-3 sm:mb-0">By {item.instructorName}</p>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end sm:gap-4 w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                      <span className="font-bold text-slate-800 text-xl">৳{item.price}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <FiTrash2 /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <button
                  onClick={clearCart}
                  className="text-slate-500 hover:text-slate-700 text-sm font-medium underline"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Checkout Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h3>
                
                <div className="space-y-4 text-slate-600 mb-6">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>৳{totalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium border-b border-slate-100 pb-4">
                    <span>Discount</span>
                    <span className="text-emerald-500">- ৳0</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-slate-800 text-lg">Total</span>
                    <span className="font-bold text-slate-800 text-2xl">৳{totalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {checkingOut ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Proceed to Checkout <FiArrowRight />
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-slate-400 mt-4">
                  Secure checkout powered by SSLCommerz.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
