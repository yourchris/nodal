"use client";

import React, { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { localDb } from "@/lib/dexie";
import { useSync } from "@/components/SyncProvider";
import GestureZone from "@/components/GestureZone";
import QuickEntryModal from "@/components/QuickEntryModal";
import CategoriesListModal from "@/components/CategoriesListModal";
import Navbar from "@/components/Navbar";
import * as Icons from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Real-time queries with useLiveQuery
  const activeTxs = useLiveQuery(() =>
    localDb.transactions.where("deleted").equals(0).toArray()
  ) || [];

  const activeCategories = useLiveQuery(() =>
    localDb.categories.where("deleted").equals(0).toArray()
  ) || [];

  const budgets = useLiveQuery(() =>
    localDb.budgets.toArray()
  ) || [];

  const { syncNow, syncStatus, isOnline } = useSync();

  // Handle client-side mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize a mock default budget if none exists
  useEffect(() => {
    async function initBudget() {
      const existing = await localDb.budgets.toArray();
      if (existing.length === 0) {
        await localDb.budgets.add({
          id: "default-budget",
          userId: "default-user-id",
          categoryId: "cat-food",
          limitAmount: 1500000,
          currentAmount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
    initBudget();
  }, []);

  // Compute stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const totalToday = activeTxs
    .filter((t) => new Date(t.createdAt) >= today)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalThisMonth = activeTxs
    .filter((t) => new Date(t.createdAt) >= startOfMonth)
    .reduce((sum, t) => sum + t.amount, 0);

  // Budget progress
  const mainBudgetLimit = budgets[0]?.limitAmount || 1500000;
  // Dynamic current amount calculated from transactions this month to ensure accuracy
  const mainBudgetUsed = totalThisMonth;
  const progressPercent = Math.min((mainBudgetUsed / mainBudgetLimit) * 100, 100);

  // Prepare chart data for last 7 days
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayLabel = d.toLocaleDateString("id-ID", { weekday: "short" });
    const dayStart = new Date(d);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(d);
    dayEnd.setHours(23, 59, 59, 999);

    const amountForDay = activeTxs
      .filter((t) => {
        const txDate = new Date(t.createdAt);
        return txDate >= dayStart && txDate <= dayEnd;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      day: dayLabel,
      amount: amountForDay,
      displayAmount: amountForDay >= 1000 ? `${amountForDay / 1000}k` : `${amountForDay}`,
    };
  });

  return (
    <div className="flex-1 flex flex-col relative h-full overflow-hidden">
      
      <div className="flex-1 overflow-y-auto p-4 pb-28 flex flex-col gap-4 no-scrollbar">
        {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            No Data Entry Ledger
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight leading-none mt-1">
            NODAL
          </h1>
        </div>
        <button
          onClick={syncNow}
          disabled={syncStatus === "syncing" || !isOnline}
          className={`p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer ${
            syncStatus === "syncing" ? "animate-spin" : ""
          }`}
        >
          <Icons.RefreshCw size={16} />
        </button>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl glass flex flex-col gap-1">
          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">
            Hari Ini
          </span>
          <span className="text-lg font-black text-neon-blue truncate leading-snug">
            Rp {totalToday.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="p-4 rounded-2xl glass flex flex-col gap-1">
          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">
            Bulan Ini
          </span>
          <span className="text-lg font-black text-neon-purple truncate leading-snug">
            Rp {totalThisMonth.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {/* Budget Bar Widget */}
      <div className="p-4 rounded-2xl glass flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-[10px] font-bold">
          <span className="text-slate-400 uppercase tracking-widest">Budget Bulanan</span>
          <span className="text-slate-200">
            {progressPercent.toFixed(0)}% ({mainBudgetUsed.toLocaleString("id-ID")} / {mainBudgetLimit.toLocaleString("id-ID")})
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              progressPercent >= 90
                ? "bg-rose-500"
                : progressPercent >= 75
                ? "bg-amber-500"
                : "bg-gradient-to-r from-neon-blue to-neon-purple"
            }`}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Recharts Chart Widget */}
      <div className="p-4 rounded-2xl glass flex flex-col gap-3">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
          Grafik Mingguan
        </span>
        <div className="w-full h-24 flex items-center justify-center">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis
                  dataKey="day"
                  stroke="#475569"
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.03)", radius: 4 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-950 border border-slate-800 px-2 py-1 rounded-md text-[10px] font-bold text-white shadow-lg">
                          Rp {payload[0].value?.toLocaleString("id-ID")}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="url(#chartColor)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full bg-slate-900/30 rounded-xl animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Interactive Gesture Entry Zone */}
      <div className="flex-1 flex flex-col gap-2">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest pl-1">
          Quick Entry Zone
        </span>
        <GestureZone
          onSwipeTriggered={(catId) => setActiveCategoryId(catId)}
          onOpenCategoriesList={() => setIsCategoriesOpen(true)}
        />
      </div>

      {/* Modals */}
      {activeCategoryId && (
        <QuickEntryModal
          categoryId={activeCategoryId}
          onClose={() => setActiveCategoryId(null)}
          onSave={() => {
            setActiveCategoryId(null);
          }}
        />
      )}

      {isCategoriesOpen && (
        <CategoriesListModal
          onClose={() => setIsCategoriesOpen(false)}
          onCategorySelect={(catId) => {
            setIsCategoriesOpen(false);
            setActiveCategoryId(catId);
          }}
        />
      )}

      </div>

      {/* Navigation */}
      <Navbar />
      
    </div>
  );
}
