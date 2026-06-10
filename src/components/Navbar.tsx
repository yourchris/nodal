"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { useSync } from "./SyncProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { isOnline, syncStatus } = useSync();

  const navItems = [
    { href: "/", label: "Ledger", icon: Icons.Sparkles },
    { href: "/manual", label: "Manual", icon: Icons.PlusCircle },
    { href: "/history", label: "Riwayat", icon: Icons.History },
    { href: "/settings", label: "Pengaturan", icon: Icons.Settings },
  ];

  return (
    <div className="absolute bottom-3 left-0 right-0 px-6 z-40 pointer-events-none">
      <nav className="glass rounded-2xl p-2.5 flex items-center justify-between pointer-events-auto max-w-sm mx-auto shadow-xl">
        
        {/* Navigation Items */}
        <div className="flex items-center gap-1 flex-1 justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? "text-neon-blue bg-slate-900/60 font-bold scale-[1.02]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon size={18} />
                <span className="text-[9px] tracking-wider uppercase font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Sync/Online Indicator Dot */}
        <div className="border-l border-slate-800/80 pl-3 pr-1.5 flex items-center justify-center">
          <div className="relative group">
            <span
              className={`flex h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                !isOnline
                  ? "bg-slate-500"
                  : syncStatus === "syncing"
                  ? "bg-amber-400 animate-pulse"
                  : syncStatus === "error"
                  ? "bg-rose-500"
                  : "bg-emerald-500"
              }`}
            />
            {/* Tooltip on hover */}
            <div className="absolute bottom-6 right-0 scale-0 group-hover:scale-100 transition-all origin-bottom bg-slate-950 text-[8px] text-slate-300 py-1 px-2 rounded-md whitespace-nowrap shadow-lg border border-slate-800">
              {!isOnline
                ? "Offline (Local)"
                : syncStatus === "syncing"
                ? "Sinkronisasi..."
                : syncStatus === "error"
                ? "Gagal Sinkron"
                : "Tersinkron cloud"}
            </div>
          </div>
        </div>

      </nav>
    </div>
  );
}
