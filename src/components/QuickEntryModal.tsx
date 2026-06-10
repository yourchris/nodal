"use client";

import React, { useState, useEffect, useRef } from "react";
import * as Icons from "lucide-react";
import { localDb } from "@/lib/dexie";
import { useSync } from "./SyncProvider";

interface QuickEntryModalProps {
  categoryId: string;
  onClose: () => void;
  onSave: (amount: number, note: string | null) => void;
}

function getContextualLabels(categoryId: string): { defaultNote: string; tags: string[] } {
  const hour = new Date().getHours();
  
  if (categoryId === "cat-food") {
    if (hour >= 5 && hour < 11) {
      return { defaultNote: "Sarapan", tags: ["Sarapan", "Kopi", "Jajan", "Bubur"] };
    } else if (hour >= 11 && hour < 15) {
      return { defaultNote: "Makan Siang", tags: ["Makan Siang", "Minuman", "Kantin", "Gofood"] };
    } else if (hour >= 15 && hour < 18) {
      return { defaultNote: "Jajan Sore", tags: ["Jajan Sore", "Kopi", "Roti", "Boba"] };
    } else if (hour >= 18 && hour < 23) {
      return { defaultNote: "Makan Malam", tags: ["Makan Malam", "Dine Out", "Gofood", "Martabak"] };
    } else {
      return { defaultNote: "Camilan Malam", tags: ["Indomaret", "Jajan Malam", "Susu", "Roti"] };
    }
  }

  if (categoryId === "cat-transport") {
    return { defaultNote: "Transportasi", tags: ["Ojek Online", "MRT/LRT", "Angkot/Bus", "Bensin"] };
  }

  if (categoryId === "cat-entertainment") {
    return { defaultNote: "Hiburan", tags: ["Nongkrong", "Game/Steam", "Bioskop", "Streaming"] };
  }

  return { defaultNote: "Pengeluaran", tags: ["Kebutuhan", "Bulanan", "Darurat", "Jasa"] };
}

export default function QuickEntryModal({
  categoryId,
  onClose,
  onSave,
}: QuickEntryModalProps) {
  const [category, setCategory] = useState<any>(null);
  const [amount, setAmount] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(3.0); // 3.0 seconds auto-save timer
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [presets, setPresets] = useState<number[]>([10000, 15000, 25000, 50000]);
  const [context, setContext] = useState<{ defaultNote: string; tags: string[] }>({
    defaultNote: "Pengeluaran",
    tags: ["Kebutuhan", "Bulanan", "Darurat", "Jasa"]
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { syncNow } = useSync();

  // Load category and calculate presets from history
  useEffect(() => {
    async function loadCategoryAndPresets() {
      const cat = await localDb.categories.get(categoryId);
      if (cat) {
        setCategory(cat);
      }

      setContext(getContextualLabels(categoryId));

      // Query past transactions for this category to determine dynamic presets
      const txs = await localDb.transactions
        .where("categoryId")
        .equals(categoryId)
        .reverse()
        .limit(20)
        .toArray();

      if (txs.length > 0) {
        // Count frequencies of transaction amounts
        const freqs: Record<number, number> = {};
        txs.forEach((t) => {
          freqs[t.amount] = (freqs[t.amount] || 0) + 1;
        });

        // Sort by frequency, then amount
        const sortedPresets = Object.keys(freqs)
          .map(Number)
          .sort((a, b) => freqs[b] - freqs[a]);

        // Merge with defaults if we have fewer than 4 distinct historical values
        const merged = Array.from(new Set([...sortedPresets, 10000, 20000, 50000, 100000])).slice(0, 4);
        setPresets(merged.sort((a, b) => a - b));
      } else {
        // Category-specific default presets
        if (categoryId === "cat-food") setPresets([15000, 20000, 30000, 50000]);
        else if (categoryId === "cat-transport") setPresets([10000, 15000, 25000, 40000]);
        else if (categoryId === "cat-entertainment") setPresets([20000, 50000, 100000, 150000]);
        else setPresets([10000, 20000, 50000, 100000]);
      }
    }

    loadCategoryAndPresets();
  }, [categoryId]);

  // Handle countdown
  useEffect(() => {
    if (!isTimerActive) return;

    const interval = 100; // tick every 100ms
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timerRef.current!);
          handleAutoSave();
          return 0;
        }
        return prev - 0.1;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive, category, presets]);

  const handleAutoSave = () => {
    // Save using the first preset (recommended default)
    const defaultAmount = presets[0] || 15000;
    saveTransaction(defaultAmount, context.defaultNote);
  };

  const saveTransaction = async (finalAmount: number, note: string | null = null) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const txId = crypto.randomUUID();
    const newTx = {
      id: txId,
      userId: "default-user-id",
      categoryId,
      amount: finalAmount,
      note,
      synced: 0,
      deleted: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await localDb.transactions.add(newTx);

    // Update the budget usage for this category dynamically
    const budget = await localDb.budgets.where({ userId: "default-user-id", categoryId }).first();
    if (budget) {
      await localDb.budgets.update(budget.id, {
        currentAmount: budget.currentAmount + finalAmount,
        updatedAt: new Date(),
      });
    }

    onSave(finalAmount, note);
    // Background sync
    syncNow();
  };

  // Keyboard input handlers
  const handleNumberClick = (num: string) => {
    setIsTimerActive(false); // Cancel countdown
    if (amount.length >= 9) return; // limit digits
    setAmount((prev) => prev + num);
  };

  const handleDelete = () => {
    setIsTimerActive(false);
    setAmount((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setIsTimerActive(false);
    setAmount("");
  };

  const handleOk = () => {
    const finalVal = parseInt(amount, 10);
    if (isNaN(finalVal) || finalVal <= 0) return;
    saveTransaction(finalVal, context.defaultNote);
  };

  const handlePresetSelect = (val: number) => {
    saveTransaction(val, context.defaultNote);
  };

  const handleTagClick = (tag: string) => {
    const finalAmt = isTimerActive 
      ? (presets[0] || 15000) 
      : (parseInt(amount, 10) || presets[0] || 15000);
    saveTransaction(finalAmt, tag);
  };

  // Dynamic Icon
  const IconComponent = category?.icon ? (Icons as any)[category.icon] : null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="w-full bg-[#111827] rounded-t-3xl border-t border-slate-800 p-6 flex flex-col gap-5 max-w-md shadow-2xl relative">
        
        {/* Progress bar countdown */}
        {isTimerActive && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800 rounded-t-3xl overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-rose to-neon-purple transition-all duration-100 ease-linear"
              style={{ width: `${(timeLeft / 3.0) * 100}%` }}
            ></div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-neon-purple">
              {IconComponent && <IconComponent size={24} />}
            </div>
            <div>
              <span className="text-xs text-slate-400">Mencatat Pengeluaran</span>
              <h3 className="text-lg font-bold text-white leading-tight">
                {category?.name || "Memuat..."}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <Icons.X size={20} />
          </button>
        </div>

        {/* Amount Display */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[90px]">
          {isTimerActive ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-extrabold text-neon-blue animate-pulse">
                Rp {(presets[0] || 15000).toLocaleString("id-ID")}
              </span>
              <span className="text-[9px] text-slate-500 tracking-wider uppercase font-medium">
                Auto-save sebagai "{context.defaultNote}" dalam {timeLeft.toFixed(1)}s
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1">
              <span className="text-3xl font-black text-white leading-none">
                Rp {amount ? parseInt(amount, 10).toLocaleString("id-ID") : "0"}
              </span>
              <span className="text-[9px] text-slate-500 font-medium">
                Catatan default: "{context.defaultNote}"
              </span>
            </div>
          )}
        </div>

        {/* Quick Presets */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase">
            Rekomendasi Nominal
          </span>
          <div className="grid grid-cols-4 gap-2">
            {presets.map((val) => (
              <button
                key={val}
                onClick={() => handlePresetSelect(val)}
                className="py-2.5 px-1 rounded-xl text-xs font-bold bg-slate-900/80 hover:bg-neon-purple hover:text-white border border-slate-800 hover:border-neon-purple text-slate-300 text-center transition-all cursor-pointer"
              >
                {val >= 1000 ? `${val / 1000}k` : val}
              </button>
            ))}
          </div>
        </div>

        {/* Smart Tags (Label Cepat) */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase">
            Smart Tags (Sekali-Ketuk)
          </span>
          <div className="grid grid-cols-4 gap-2">
            {context.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="py-2.5 px-1 rounded-xl text-[10px] font-bold bg-slate-900/60 hover:bg-neon-blue hover:text-white border border-slate-800 hover:border-neon-blue text-slate-300 text-center transition-all cursor-pointer truncate"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Minimal Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2 mt-1">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="py-3.5 rounded-xl text-lg font-bold bg-slate-900/40 hover:bg-slate-900 text-slate-200 border border-slate-800/50 hover:border-slate-700 transition-colors cursor-pointer"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="py-3.5 rounded-xl text-sm font-semibold bg-slate-900/40 hover:bg-slate-900/80 text-rose-400 border border-slate-800/50 hover:border-rose-950 transition-colors cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={() => handleNumberClick("0")}
            className="py-3.5 rounded-xl text-lg font-bold bg-slate-900/40 hover:bg-slate-900 text-slate-200 border border-slate-800/50 hover:border-slate-700 transition-colors cursor-pointer"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="py-3.5 rounded-xl flex items-center justify-center bg-slate-900/40 hover:bg-slate-900/80 text-amber-400 border border-slate-800/50 hover:border-amber-950 transition-colors cursor-pointer"
          >
            <Icons.Delete size={20} />
          </button>
        </div>

        {/* Confirm Button */}
        {!isTimerActive && (
          <button
            onClick={handleOk}
            disabled={!amount || parseInt(amount, 10) <= 0}
            className={`w-full py-4 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              amount && parseInt(amount, 10) > 0
                ? "bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-lg shadow-neon-blue/20"
                : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800"
            }`}
          >
            <Icons.CheckCircle2 size={18} />
            Simpan Transaksi
          </button>
        )}
      </div>
    </div>
  );
}
