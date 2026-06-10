"use client";

import React, { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { localDb } from "@/lib/dexie";
import { useSync } from "@/components/SyncProvider";
import Navbar from "@/components/Navbar";
import * as Icons from "lucide-react";
import { resetServerData } from "@/app/actions/sync";

export default function SettingsPage() {
  const [budgetLimit, setBudgetLimit] = useState<string>("");
  const [editingGesture, setEditingGesture] = useState<string | null>(null);
  
  const { syncNow, userId } = useSync();

  // Queries
  const budgets = useLiveQuery(() => localDb.budgets.toArray()) || [];
  const categories = useLiveQuery(() => localDb.categories.where("deleted").equals(0).toArray()) || [];
  const userGestures = useLiveQuery(() => localDb.userGestures.toArray()) || [];

  useEffect(() => {
    if (budgets.length > 0) {
      setBudgetLimit(budgets[0].limitAmount.toString());
    }
  }, [budgets]);

  // Update Budget Limit
  const handleSaveBudget = async () => {
    const limit = parseFloat(budgetLimit);
    if (isNaN(limit) || limit <= 0) return;

    const mainBudget = budgets[0];
    if (mainBudget) {
      await localDb.budgets.update(mainBudget.id, {
        limitAmount: limit,
        updatedAt: new Date(),
      });
      alert("Batas budget berhasil disimpan!");
    }
  };

  // Re-map gesture to category
  const handleMapGesture = async (gestureId: string, categoryId: string) => {
    await localDb.userGestures.update(gestureId, {
      categoryId,
      updatedAt: new Date(),
    });
    setEditingGesture(null);
    syncNow();
  };

  // Reset database tool (useful for prototypes)
  const handleResetDb = async () => {
    if (!confirm("Peringatan: Reset database akan menghapus semua riwayat transaksi lokal dan cloud. Lanjutkan?")) return;
    
    try {
      const result = await resetServerData(userId);
      if (!result.success) {
        alert("Gagal mereset database cloud: " + result.error);
        return;
      }
    } catch (err: any) {
      console.error("Gagal melakukan reset database server:", err);
      alert("Gagal terhubung ke server untuk mereset database.");
      return;
    }
    
    await localDb.transactions.clear();
    await localDb.categories.clear();
    await localDb.budgets.clear();
    await localDb.userGestures.clear();
    
    // Refresh to trigger populate event on database restart
    window.location.reload();
  };

  const renderIcon = (iconName: string, size = 16) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent size={size} /> : <Icons.HelpCircle size={size} />;
  };

  const getGestureLabel = (gestureKey: string) => {
    if (gestureKey === "swipe_left") return "Swipe Kiri";
    if (gestureKey === "swipe_right") return "Swipe Kanan";
    if (gestureKey === "swipe_up") return "Swipe Atas";
    return gestureKey;
  };

  return (
    <div className="flex-1 flex flex-col p-6 pb-28 gap-5 relative h-full overflow-y-auto no-scrollbar">
      
      {/* Header */}
      <div>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Konfigurasi NODAL
        </span>
        <h1 className="text-2xl font-black text-white tracking-tight leading-none mt-1">
          Pengaturan
        </h1>
      </div>

      {/* Budget Limit Setup */}
      <div className="p-5 rounded-2xl glass flex flex-col gap-4">
        <div className="flex items-center gap-2 text-neon-blue">
          <Icons.PiggyBank size={18} />
          <h3 className="text-sm font-extrabold text-white leading-none">Batas Budget Bulanan</h3>
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">Rp</span>
            <input
              type="number"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-neon-blue font-bold"
              placeholder="1500000"
            />
          </div>
          <button
            onClick={handleSaveBudget}
            className="px-4 py-2 bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white rounded-xl transition-all cursor-pointer"
          >
            Simpan
          </button>
        </div>
      </div>

      {/* Gesture Customization */}
      <div className="p-5 rounded-2xl glass flex flex-col gap-4">
        <div className="flex items-center gap-2 text-neon-purple">
          <Icons.Sliders size={18} />
          <h3 className="text-sm font-extrabold text-white leading-none">Kustomisasi Gesture</h3>
        </div>

        <div className="flex flex-col gap-3">
          {userGestures.map((gest) => {
            const currentCat = categories.find((c) => c.id === gest.categoryId);
            const isEditing = editingGesture === gest.id;

            return (
              <div key={gest.id} className="p-3 bg-slate-900/40 rounded-xl border border-slate-850 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest">Aksi Gesture</span>
                    <span className="text-xs font-bold text-white mt-0.5">{getGestureLabel(gest.gesture)}</span>
                  </div>

                  {!isEditing ? (
                    <button
                      onClick={() => setEditingGesture(gest.id)}
                      className="flex items-center gap-1.5 py-1 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                    >
                      {currentCat && renderIcon(currentCat.icon, 12)}
                      <span>{currentCat?.name || "Pilih Kategori"}</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">Memilih...</span>
                  )}
                </div>

                {/* Dropdown list of categories when editing */}
                {isEditing && (
                  <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-900/80">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleMapGesture(gest.id, c.id)}
                        className={`flex items-center gap-1.5 p-2 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                          gest.categoryId === c.id
                            ? "bg-neon-purple/10 border-neon-purple text-neon-purple"
                            : "bg-slate-950 border-slate-850 hover:border-slate-800 text-slate-400"
                        }`}
                      >
                        {renderIcon(c.icon, 12)}
                        <span className="truncate">{c.name}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => setEditingGesture(null)}
                      className="col-span-2 text-center text-[9px] text-slate-500 font-semibold py-1 hover:text-slate-400 cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Maintenance & Reset Tools */}
      <div className="p-5 rounded-2xl glass flex flex-col gap-3.5">
        <div className="flex items-center gap-2 text-rose-500">
          <Icons.Wrench size={18} />
          <h3 className="text-sm font-extrabold text-white leading-none">Alat Developer</h3>
        </div>

        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
          Gunakan tombol di bawah jika Anda ingin mengosongkan semua data IndexedDB lokal dan mengulangi inisialisasi kategori.
        </p>

        <button
          onClick={handleResetDb}
          className="w-full py-2.5 rounded-xl border border-rose-950 bg-rose-950/10 hover:bg-rose-950/30 text-rose-400 hover:text-rose-300 text-[10px] font-extrabold transition-all cursor-pointer"
        >
          Reset Local Database
        </button>
      </div>

      <Navbar />

    </div>
  );
}
