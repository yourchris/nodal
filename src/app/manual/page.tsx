"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { localDb } from "@/lib/dexie";
import { useSync } from "@/components/SyncProvider";
import * as Icons from "lucide-react";

export default function ManualEntryPage() {
  const router = useRouter();
  const { syncNow } = useSync();

  const [amount, setAmount] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [datetime, setDatetime] = useState<string>("");
  const [note, setNote] = useState<string>("");

  // Load categories
  const categories = useLiveQuery(() =>
    localDb.categories.where("deleted").equals(0).toArray()
  ) || [];

  // Set default datetime and category on load
  useEffect(() => {
    // Current local time formatted for input type="datetime-local" (YYYY-MM-DDTHH:MM)
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localISO = new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
    setDatetime(localISO);

    // Set default category to food if available, or first item
    if (categories.length > 0) {
      const defaultCat = categories.find((c) => c.id === "cat-food") || categories[0];
      setSelectedCategoryId(defaultCat.id);
    }
  }, [categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalAmount = parseFloat(amount);
    if (isNaN(finalAmount) || finalAmount <= 0) {
      alert("Masukkan nominal transaksi yang valid!");
      return;
    }

    if (!selectedCategoryId) {
      alert("Pilih kategori terlebih dahulu!");
      return;
    }

    const txId = crypto.randomUUID();
    const newTx = {
      id: txId,
      userId: "default-user-id",
      categoryId: selectedCategoryId,
      amount: finalAmount,
      note: note.trim() || null,
      synced: 0,
      deleted: 0,
      createdAt: new Date(datetime),
      updatedAt: new Date(),
    };

    // Save to Local DB
    await localDb.transactions.add(newTx);

    // Update budget usage if necessary
    const budget = await localDb.budgets.where({ userId: "default-user-id", categoryId: selectedCategoryId }).first();
    if (budget) {
      await localDb.budgets.update(budget.id, {
        currentAmount: budget.currentAmount + finalAmount,
        updatedAt: new Date(),
      });
    }

    // Trigger background sync
    syncNow();

    // Redirect to Dashboard
    router.push("/");
  };

  const renderIcon = (iconName: string, size = 16) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent size={size} /> : <Icons.HelpCircle size={size} />;
  };

  return (
    <div className="flex-1 flex flex-col p-6 gap-6 relative h-full overflow-y-auto no-scrollbar justify-center">
      
      {/* Header */}
      <div>
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-3 cursor-pointer"
        >
          <Icons.ChevronLeft size={16} />
          Kembali ke Ledger
        </button>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Pencatatan Konvensional
        </span>
        <h1 className="text-2xl font-black text-white tracking-tight leading-none mt-1">
          Form Catat Manual
        </h1>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="p-5 rounded-2xl glass flex flex-col gap-5 shadow-2xl">
        
        {/* Nominal Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Nominal Transaksi (Rp)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-extrabold text-slate-500">Rp</span>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-neon-blue rounded-xl text-sm text-white font-extrabold outline-none transition-all placeholder-slate-700"
              placeholder="0"
              autoFocus
              min="1"
            />
          </div>
        </div>

        {/* Category Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Kategori
          </label>
          <div className="relative">
            <select
              required
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-neon-blue rounded-xl text-xs text-slate-200 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>Pilih Kategori...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
              <Icons.ChevronDown size={14} />
            </div>
          </div>
        </div>

        {/* Date & Time Picker */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Tanggal & Waktu
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              required
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-neon-blue rounded-xl text-xs text-slate-200 outline-none transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* Note / Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Catatan / Detail Belanja
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-neon-blue rounded-xl text-xs text-slate-200 outline-none transition-all min-h-[90px] resize-none placeholder-slate-700"
            placeholder="Contoh: Nasi goreng kambing di warung dekat kos..."
            maxLength={150}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 mt-2">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex-1 py-3.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-95 text-xs font-extrabold text-white shadow-lg shadow-neon-blue/20 transition-all cursor-pointer"
          >
            Simpan Transaksi
          </button>
        </div>

      </form>

    </div>
  );
}
