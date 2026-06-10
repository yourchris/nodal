"use client";

import React, { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { localDb } from "@/lib/dexie";
import { useSync } from "@/components/SyncProvider";
import Navbar from "@/components/Navbar";
import * as Icons from "lucide-react";

export default function HistoryPage() {
  const [filterRange, setFilterRange] = useState<"day" | "week" | "month" | "all">("all");
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>("");
  const [editNote, setEditNote] = useState<string>("");

  const { syncNow } = useSync();

  // Queries
  const transactions = useLiveQuery(() =>
    localDb.transactions.where("deleted").equals(0).reverse().sortBy("createdAt")
  ) || [];

  const categories = useLiveQuery(() =>
    localDb.categories.toArray()
  ) || [];

  const categoryMap = React.useMemo(() => {
    const map: Record<string, any> = {};
    categories.forEach((c) => {
      map[c.id] = c;
    });
    return map;
  }, [categories]);

  // Handle transaction soft deletion
  const handleDeleteTx = async (txId: string) => {
    if (!confirm("Hapus transaksi ini?")) return;

    const tx = await localDb.transactions.get(txId);
    if (!tx) return;

    // Soft delete
    await localDb.transactions.update(txId, {
      deleted: 1,
      synced: 0,
      updatedAt: new Date(),
    });

    // Recompute budget currentAmount
    const budget = await localDb.budgets.where({ userId: "default-user-id", categoryId: tx.categoryId }).first();
    if (budget) {
      await localDb.budgets.update(budget.id, {
        currentAmount: Math.max(0, budget.currentAmount - tx.amount),
        updatedAt: new Date(),
      });
    }

    // Trigger sync background
    syncNow();
  };

  // Open Edit Mode
  const startEdit = (tx: any) => {
    setEditingTxId(tx.id);
    setEditAmount(tx.amount.toString());
    setEditNote(tx.note || "");
  };

  // Save Edit
  const saveEdit = async (txId: string) => {
    const newAmt = parseFloat(editAmount);
    if (isNaN(newAmt) || newAmt <= 0) return;

    const tx = await localDb.transactions.get(txId);
    if (!tx) return;

    const diff = newAmt - tx.amount;

    await localDb.transactions.update(txId, {
      amount: newAmt,
      note: editNote.trim() || null,
      synced: 0,
      updatedAt: new Date(),
    });

    // Recompute budget
    const budget = await localDb.budgets.where({ userId: "default-user-id", categoryId: tx.categoryId }).first();
    if (budget) {
      await localDb.budgets.update(budget.id, {
        currentAmount: Math.max(0, budget.currentAmount + diff),
        updatedAt: new Date(),
      });
    }

    setEditingTxId(null);
    syncNow();
  };

  // Filter transactions
  const filteredTxs = transactions.filter((t) => {
    if (filterRange === "all") return true;

    const txDate = new Date(t.createdAt);
    const now = new Date();
    
    if (filterRange === "day") {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return txDate >= today;
    }
    
    if (filterRange === "week") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return txDate >= sevenDaysAgo;
    }

    if (filterRange === "month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return txDate >= startOfMonth;
    }

    return true;
  });

  const renderIcon = (iconName: string, size = 16) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent size={size} /> : <Icons.HelpCircle size={size} />;
  };

  return (
    <div className="flex-1 flex flex-col relative h-full overflow-hidden">
      
      <div className="flex-1 overflow-y-auto p-4 pb-28 flex flex-col gap-4 no-scrollbar">
        {/* Header */}
      <div>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Pengeluaran Anda
        </span>
        <h1 className="text-2xl font-black text-white tracking-tight leading-none mt-1">
          Riwayat Transaksi
        </h1>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/60 rounded-xl border border-slate-900/80">
        {[
          { key: "all", label: "Semua" },
          { key: "day", label: "Hari Ini" },
          { key: "week", label: "Minggu" },
          { key: "month", label: "Bulan" },
        ].map((range) => (
          <button
            key={range.key}
            onClick={() => setFilterRange(range.key as any)}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
              filterRange === range.key
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="flex-1 flex flex-col gap-2.5">
        {filteredTxs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
            <Icons.CalendarX size={32} className="text-slate-600 mb-2" />
            <p className="text-xs text-slate-500 font-semibold">Belum ada transaksi</p>
            <p className="text-[10px] text-slate-600 mt-1 max-w-[180px]">
              Gunakan gesture swipe di tab Ledger untuk menambah pengeluaran baru secara instan.
            </p>
          </div>
        ) : (
          filteredTxs.map((tx) => {
            const cat = categoryMap[tx.categoryId] || { name: "Lainnya", icon: "LayoutGrid" };
            const isEditing = editingTxId === tx.id;
            
            return (
              <div
                key={tx.id}
                className="p-4 rounded-2xl glass flex flex-col gap-3 transition-all duration-300"
              >
                {!isEditing ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-950 text-neon-blue">
                        {renderIcon(cat.icon)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {new Date(tx.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <h4 className="text-xs font-bold text-white leading-tight">
                          {cat.name}
                        </h4>
                        {tx.note && (
                          <span className="text-[10px] text-slate-400 italic mt-0.5">
                            {tx.note}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-white">
                        Rp {tx.amount.toLocaleString("id-ID")}
                      </span>
                      
                      {/* Action buttons */}
                      <div className="flex items-center gap-1 border-l border-slate-800/80 pl-2">
                        <button
                          onClick={() => startEdit(tx)}
                          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                        >
                          <Icons.Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteTx(tx.id)}
                          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <Icons.Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Edit view inline
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase w-12">Nominal</span>
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-neon-purple"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase w-12">Catatan</span>
                      <input
                        type="text"
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-neon-purple"
                        placeholder="Contoh: Beli bakso..."
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-1">
                      <button
                        onClick={() => setEditingTxId(null)}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-850 text-[10px] font-bold transition-all cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => saveEdit(tx.id)}
                        className="px-3 py-1 rounded-lg bg-neon-purple hover:bg-neon-purple/80 text-white text-[10px] font-bold transition-all cursor-pointer"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      </div>

      <Navbar />

    </div>
  );
}
