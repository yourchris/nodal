"use client";

import React, { useState, useRef, useEffect } from "react";
import * as Icons from "lucide-react";
import { localDb } from "@/lib/dexie";

interface GestureZoneProps {
  onSwipeTriggered: (categoryId: string) => void;
  onOpenCategoriesList: () => void;
}

export default function GestureZone({
  onSwipeTriggered,
  onOpenCategoriesList,
}: GestureZoneProps) {
  const [gestureMap, setGestureMap] = useState<Record<string, string>>({
    swipe_left: "cat-food",
    swipe_right: "cat-transport",
    swipe_up: "cat-entertainment",
  });
  const [categories, setCategories] = useState<Record<string, any>>({});

  // Touch/Mouse state
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  // Load category details for display labels
  useEffect(() => {
    async function loadData() {
      // Load mapping
      const mapping = await localDb.userGestures.where({ userId: "default-user-id" }).toArray();
      const newMap: Record<string, string> = { ...gestureMap };
      mapping.forEach((m) => {
        newMap[m.gesture] = m.categoryId;
      });
      setGestureMap(newMap);

      // Load all categories for quick lookup of names/icons
      const allCats = await localDb.categories.toArray();
      const catMap: Record<string, any> = {};
      allCats.forEach((c) => {
        catMap[c.id] = c;
      });
      setCategories(catMap);
    }
    loadData();
  }, []);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
    setDrag({ x: 0, y: 0 });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - startPos.current.x;
    const dy = clientY - startPos.current.y;
    
    // Dampen drag to create an "elastic" physical feel (max 100px)
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 120;
    
    if (distance > maxDist) {
      const angle = Math.atan2(dy, dx);
      setDrag({
        x: Math.cos(angle) * maxDist,
        y: Math.sin(angle) * maxDist,
      });
    } else {
      setDrag({ x: dx, y: dy });
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 70;
    const { x, y } = drag;
    const absX = Math.abs(x);
    const absY = Math.abs(y);

    if (absX < 15 && absY < 15) {
      // It is a Tap!
      onOpenCategoriesList();
    } else if (absX > absY && absX > threshold) {
      // Horizontal swipe
      if (x < 0) {
        // Swipe Left
        const catId = gestureMap.swipe_left;
        if (catId) onSwipeTriggered(catId);
      } else {
        // Swipe Right
        const catId = gestureMap.swipe_right;
        if (catId) onSwipeTriggered(catId);
      }
    } else if (absY > absX && absY > threshold) {
      // Vertical swipe
      if (y < 0) {
        // Swipe Up
        const catId = gestureMap.swipe_up;
        if (catId) onSwipeTriggered(catId);
      } else {
        // Swipe Down -> default to Category list
        onOpenCategoriesList();
      }
    }

    // Reset position
    setDrag({ x: 0, y: 0 });
  };

  // Render Category Icon dynamically
  const renderCatIcon = (gestureKey: string, size = 20) => {
    const catId = gestureMap[gestureKey];
    const cat = categories[catId];
    if (!cat) return <Icons.HelpCircle size={size} />;
    const IconComponent = (Icons as any)[cat.icon];
    return IconComponent ? <IconComponent size={size} /> : <Icons.HelpCircle size={size} />;
  };

  const getCatName = (gestureKey: string) => {
    const catId = gestureMap[gestureKey];
    return categories[catId]?.name || "";
  };

  // Calculate dynamic styling based on drag values
  const dragDistance = Math.sqrt(drag.x * drag.x + drag.y * drag.y);
  const leftOpacity = drag.x < 0 ? Math.min(Math.abs(drag.x) / 80, 1) : 0;
  const rightOpacity = drag.x > 0 ? Math.min(drag.x / 80, 1) : 0;
  const topOpacity = drag.y < 0 ? Math.min(Math.abs(drag.y) / 80, 1) : 0;
  const bottomOpacity = drag.y > 0 ? Math.min(drag.y / 80, 1) : 0;

  return (
    <div
      className="relative flex-1 w-full bg-slate-950 rounded-3xl border border-slate-900 overflow-hidden flex flex-col items-center justify-center min-h-[360px] touch-none cursor-grab active:cursor-grabbing select-none"
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => isDragging && handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      
      {/* Background Glowing Overlays */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-neon-rose/20 to-transparent pointer-events-none transition-opacity duration-150"
        style={{ opacity: leftOpacity }}
      ></div>
      <div
        className="absolute inset-0 bg-gradient-to-l from-neon-blue/20 to-transparent pointer-events-none transition-opacity duration-150"
        style={{ opacity: rightOpacity }}
      ></div>
      <div
        className="absolute inset-0 bg-gradient-to-b from-neon-purple/20 to-transparent pointer-events-none transition-opacity duration-150"
        style={{ opacity: topOpacity }}
      ></div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none transition-opacity duration-150"
        style={{ opacity: bottomOpacity }}
      ></div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Edge Category Indicators */}
      
      {/* LEFT: Food */}
      <div
        className="absolute left-6 flex flex-col items-center gap-1 transition-all pointer-events-none"
        style={{
          transform: `translateX(${drag.x < 0 ? Math.min(Math.abs(drag.x) / 3, 15) : 0}px) scale(${1 + leftOpacity * 0.15})`,
          color: drag.x < 0 ? "#f43f5e" : "#64748b",
        }}
      >
        <div className={`p-3 rounded-full border ${drag.x < 0 ? "bg-neon-rose/10 border-neon-rose shadow-lg shadow-neon-rose/10" : "bg-slate-900/60 border-slate-800"}`}>
          {renderCatIcon("swipe_left")}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">{getCatName("swipe_left") || "Makanan"}</span>
      </div>

      {/* RIGHT: Transport */}
      <div
        className="absolute right-6 flex flex-col items-center gap-1 transition-all pointer-events-none"
        style={{
          transform: `translateX(${drag.x > 0 ? -Math.min(drag.x / 3, 15) : 0}px) scale(${1 + rightOpacity * 0.15})`,
          color: drag.x > 0 ? "#0ea5e9" : "#64748b",
        }}
      >
        <div className={`p-3 rounded-full border ${drag.x > 0 ? "bg-neon-blue/10 border-neon-blue shadow-lg shadow-neon-blue/10" : "bg-slate-900/60 border-slate-800"}`}>
          {renderCatIcon("swipe_right")}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">{getCatName("swipe_right") || "Transportasi"}</span>
      </div>

      {/* TOP: Entertainment */}
      <div
        className="absolute top-6 flex flex-col items-center gap-1 transition-all pointer-events-none"
        style={{
          transform: `translateY(${drag.y < 0 ? Math.min(Math.abs(drag.y) / 3, 15) : 0}px) scale(${1 + topOpacity * 0.15})`,
          color: drag.y < 0 ? "#a855f7" : "#64748b",
        }}
      >
        <div className={`p-3 rounded-full border ${drag.y < 0 ? "bg-neon-purple/10 border-neon-purple shadow-lg shadow-neon-purple/10" : "bg-slate-900/60 border-slate-800"}`}>
          {renderCatIcon("swipe_up")}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">{getCatName("swipe_up") || "Hiburan"}</span>
      </div>

      {/* BOTTOM: Tap to show all */}
      <div
        className="absolute bottom-6 flex flex-col items-center gap-1 transition-all pointer-events-none"
        style={{
          transform: `translateY(${drag.y > 0 ? -Math.min(drag.y / 3, 15) : 0}px) scale(${1 + bottomOpacity * 0.1})`,
          color: drag.y > 0 ? "#10b981" : "#64748b",
        }}
      >
        <span className="text-[10px] font-black uppercase tracking-widest">Kategori Lain</span>
        <div className={`p-2 rounded-full border ${drag.y > 0 ? "bg-emerald-500/10 border-emerald-500" : "bg-slate-900/40 border-slate-800/60"}`}>
          <Icons.ChevronDown size={14} />
        </div>
      </div>

      {/* Center Interactive Elastic Target */}
      <div
        className="relative flex flex-col items-center justify-center z-10 transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${drag.x}px, ${drag.y}px, 0)`,
        }}
      >
        <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border shadow-2xl relative transition-all duration-300 ${
          isDragging 
            ? "scale-105 bg-slate-900 border-neon-purple shadow-neon-purple/20" 
            : "bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-slate-950/80"
        }`}>
          {/* Outer pulsing circle when idle */}
          {!isDragging && (
            <div className="absolute inset-0 rounded-full border border-neon-purple/30 animate-ping opacity-60"></div>
          )}

          <Icons.Sparkles size={28} className={isDragging ? "text-neon-purple animate-spin-slow" : "text-slate-400"} />
          <span className="text-[10px] text-slate-500 font-extrabold uppercase mt-1 tracking-wider">
            {isDragging ? "Tarik" : "Swipe"}
          </span>
        </div>
      </div>

      {/* Bottom helper guidelines label */}
      <div className="absolute bottom-16 text-center pointer-events-none select-none">
        <p className="text-[11px] text-slate-500 font-medium tracking-wide">
          Swipe ke arah kategori atau <span className="text-neon-purple font-bold">Tap Tengah</span> untuk membuka menu
        </p>
      </div>

    </div>
  );
}
