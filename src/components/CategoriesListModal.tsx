"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { localDb } from "@/lib/dexie";

interface CategoriesListModalProps {
  onClose: () => void;
  onCategorySelect: (categoryId: string) => void;
}

const AVAILABLE_ICONS = [
  "Utensils", "Car", "Clapperboard", "LayoutGrid",
  "ShoppingBag", "Coffee", "HeartPulse", "Lightbulb",
  "Home", "BookOpen", "Smartphone", "Dumbbell"
];

export default function CategoriesListModal({
  onClose,
  onCategorySelect,
}: CategoriesListModalProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("ShoppingBag");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const list = await localDb.categories.where("deleted").equals(0).toArray();
    setCategories(list);
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newId = crypto.randomUUID();
    const newCategory = {
      id: newId,
      userId: "default-user-id",
      name: newCatName.trim(),
      icon: newCatIcon,
      synced: 0,
      deleted: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await localDb.categories.add(newCategory);
    setNewCatName("");
    setIsAdding(false);
    loadCategories();
  };

  const renderIcon = (iconName: string, size = 20) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent size={size} /> : <Icons.HelpCircle size={size} />;
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="w-full bg-[#111827] rounded-t-3xl border-t border-slate-800 p-6 flex flex-col gap-4 max-w-md shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Pilih Kategori</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <Icons.X size={18} />
          </button>
        </div>


        {/* Create new Category Toggle */}
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-2.5 rounded-xl border border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/40 text-xs font-semibold text-slate-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Icons.Plus size={14} />
            Kategori Kustom Baru
          </button>
        ) : (
          <form onSubmit={handleCreateCategory} className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nama kategori..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-neon-purple transition-all"
                maxLength={20}
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-2 bg-neon-purple rounded-xl text-xs font-bold text-white transition-all hover:bg-neon-purple/90 cursor-pointer"
              >
                Tambah
              </button>
            </div>
            
            {/* Icon Picker */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Pilih Ikon</span>
              <div className="grid grid-cols-6 gap-2">
                {AVAILABLE_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewCatIcon(icon)}
                    className={`p-2 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                      newCatIcon === icon
                        ? "bg-neon-purple/15 border-neon-purple text-neon-purple"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400"
                    }`}
                  >
                    {renderIcon(icon, 16)}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-[10px] text-slate-500 hover:text-slate-400 text-center font-medium mt-1"
            >
              Batal
            </button>
          </form>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat.id)}
              className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:border-slate-700 flex flex-col items-center justify-center gap-2 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <div className="p-2.5 rounded-xl bg-slate-950 text-neon-blue">
                {renderIcon(cat.icon, 20)}
              </div>
              <span className="text-[11px] font-bold text-center leading-tight truncate w-full">
                {cat.name}
              </span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
