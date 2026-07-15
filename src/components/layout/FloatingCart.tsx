"use client";

import { useCart } from "@/providers/CartProvider";
import { usePathname, useRouter } from "next/navigation";
import { FiShoppingCart, FiArrowRight } from "react-icons/fi";
import { useEffect, useState } from "react";

export default function FloatingCart() {
  const { totalItems, totalPrice } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [bounce, setBounce] = useState(false);

  // Don't show on cart page, admin pages, or payment pages
  const isHidden = pathname === "/cart" || pathname?.startsWith("/admin") || pathname?.startsWith("/payment");

  useEffect(() => {
    if (totalItems > 0 && !isHidden) {
      setVisible(true);
      // Trigger bounce animation on item count change
      setBounce(true);
      const t = setTimeout(() => setBounce(false), 600);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [totalItems, isHidden]);

  if (!visible) return null;

  return (
    <div
      onClick={() => router.push("/cart")}
      className={`fixed bottom-6 right-6 z-50 cursor-pointer group ${bounce ? "animate-bounce" : ""}`}
      role="button"
      aria-label="Open cart"
    >
      {/* Main Floating Button */}
      <div className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white pl-4 pr-5 py-3.5 rounded-2xl shadow-2xl shadow-indigo-500/40 transition-all duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/60">
        {/* Cart Icon with Badge */}
        <div className="relative">
          <FiShoppingCart size={22} />
          <span className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-amber-400 text-slate-900 text-[11px] font-extrabold flex items-center justify-center rounded-full shadow-sm border-2 border-indigo-600">
            {totalItems}
          </span>
        </div>

        {/* Labels */}
        <div className="flex flex-col leading-none">
          <span className="text-[11px] font-medium text-indigo-200">
            {totalItems} {totalItems === 1 ? "item" : "items"} in cart
          </span>
          <span className="text-base font-bold">৳{totalPrice}</span>
        </div>

        {/* Arrow */}
        <FiArrowRight size={18} className="text-indigo-200 group-hover:translate-x-1 transition-transform duration-200" />
      </div>

      {/* Ping ring effect */}
      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 opacity-75 animate-ping" />
    </div>
  );
}
