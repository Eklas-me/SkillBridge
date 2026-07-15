"use client";

import { useEffect, useState } from "react";
import { FiUsers, FiBookOpen, FiDollarSign, FiShield } from "react-icons/fi";
import Link from "next/link";

interface AdminStats {
  totalCourses: number;
  totalUsers: number;
  totalAdmins: number;
  totalRevenue: number;
  recentPayments: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { title: "Total Users", value: stats?.totalUsers || 0, icon: <FiUsers />, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Courses", value: stats?.totalCourses || 0, icon: <FiBookOpen />, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Total Revenue", value: `৳${stats?.totalRevenue || 0}`, icon: <FiDollarSign />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Admins", value: stats?.totalAdmins || 0, icon: <FiShield />, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome to the SkillBridge Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Courses</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats?.recentPayments?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No transactions found</td>
                </tr>
              ) : (
                stats?.recentPayments?.map((payment, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{payment.transactionId}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-800">{payment.user?.name || "Unknown"}</p>
                      <p className="text-xs text-slate-500">{payment.user?.email || "N/A"}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 truncate max-w-[200px]" title={payment.courses?.map((c: any) => c.title).join(", ")}>
                      {payment.courses?.map((c: any) => c.title).join(", ") || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">৳{payment.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        payment.status === "completed" ? "bg-emerald-50 text-emerald-700" :
                        payment.status === "failed" ? "bg-red-50 text-red-700" :
                        payment.status === "cancelled" ? "bg-slate-100 text-slate-700" :
                        "bg-amber-50 text-amber-700"
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
