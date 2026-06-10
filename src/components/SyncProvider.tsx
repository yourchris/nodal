"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import { localDb } from "@/lib/dexie";
import { syncData } from "@/app/actions/sync";

type SyncStatus = "idle" | "syncing" | "success" | "error";

interface SyncContextType {
  isOnline: boolean;
  syncStatus: SyncStatus;
  lastSyncedAt: Date | null;
  syncNow: () => Promise<void>;
  userId: string;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export function SyncProvider({
  children,
  userId = "default-user-id", // fallback user for initial prototype/offline-only
}: {
  children: React.ReactNode;
  userId?: string;
}) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [, startTransition] = useTransition();

  // Self-healing check to pre-populate default categories, gestures, and budgets if empty
  useEffect(() => {
    async function initializeDefaults() {
      try {
        const catCount = await localDb.categories.count();
        if (catCount === 0) {
          await localDb.categories.bulkAdd([
            {
              id: "cat-food",
              userId: null,
              name: "Makanan",
              icon: "Utensils",
              synced: 0,
              deleted: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: "cat-transport",
              userId: null,
              name: "Transportasi",
              icon: "Car",
              synced: 0,
              deleted: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: "cat-entertainment",
              userId: null,
              name: "Hiburan",
              icon: "Clapperboard",
              synced: 0,
              deleted: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: "cat-other",
              userId: null,
              name: "Lainnya",
              icon: "LayoutGrid",
              synced: 0,
              deleted: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]);
        }

        const gestCount = await localDb.userGestures.count();
        if (gestCount === 0) {
          await localDb.userGestures.bulkAdd([
            {
              id: "gest-left",
              userId: userId,
              gesture: "swipe_left",
              categoryId: "cat-food",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: "gest-right",
              userId: userId,
              gesture: "swipe_right",
              categoryId: "cat-transport",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: "gest-up",
              userId: userId,
              gesture: "swipe_up",
              categoryId: "cat-entertainment",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]);
        }

        const budgetCount = await localDb.budgets.count();
        if (budgetCount === 0) {
          await localDb.budgets.add({
            id: "default-budget",
            userId: userId,
            categoryId: "cat-food",
            limitAmount: 1500000,
            currentAmount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } catch (err) {
        console.error("Failed to initialize default database values:", err);
      }
    }

    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);

      const handleOnline = () => {
        setIsOnline(true);
        triggerAutoSync();
      };
      const handleOffline = () => {
        setIsOnline(false);
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Perform initial check and sync on mount
      initializeDefaults().then(() => {
        if (navigator.onLine) {
          triggerAutoSync();
        }
      });

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, [userId]);

  const triggerAutoSync = () => {
    startTransition(async () => {
      await syncNow();
    });
  };

  const syncNow = async () => {
    if (!navigator.onLine || !userId) {
      setSyncStatus("idle");
      return;
    }

    setSyncStatus("syncing");

    try {
      // 1. Gather all local unsynced data
      const unsyncedTx = await localDb.transactions.where("synced").equals(0).toArray();
      const unsyncedCat = await localDb.categories.where("synced").equals(0).toArray();
      const localGest = await localDb.userGestures.toArray(); // gestures are small, we sync all

      // Prepare payload with stringified dates for next JSON serialization
      const payload = {
        userId,
        transactions: unsyncedTx.map((tx) => ({
          id: tx.id,
          categoryId: tx.categoryId,
          amount: tx.amount,
          note: tx.note,
          deleted: tx.deleted,
          createdAt: tx.createdAt.toISOString(),
          updatedAt: tx.updatedAt.toISOString(),
        })),
        categories: unsyncedCat.map((cat) => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          deleted: cat.deleted,
          createdAt: cat.createdAt.toISOString(),
          updatedAt: cat.updatedAt.toISOString(),
        })),
        userGestures: localGest.map((gest) => ({
          id: gest.id,
          gesture: gest.gesture,
          categoryId: gest.categoryId,
          createdAt: gest.createdAt.toISOString(),
          updatedAt: gest.updatedAt.toISOString(),
        })),
      };

      // 2. Call Server Action
      const result = await syncData(payload);

      if (result.success && result.data) {
        const { categories: sCat, transactions: sTx, userGestures: sGest } = result.data;

        // 3. Clear soft-deleted records from Dexie physically since they are confirmed deleted on server
        await localDb.transactions.where("deleted").equals(1).delete();
        await localDb.categories.where("deleted").equals(1).delete();

        // 4. Update the local tables with server confirmed data (which are now synced = 1, deleted = 0)
        // Set up client database categories
        for (const cat of sCat) {
          await localDb.categories.put({
            id: cat.id,
            userId: cat.userId,
            name: cat.name,
            icon: cat.icon,
            synced: 1,
            deleted: 0,
            createdAt: new Date(cat.createdAt),
            updatedAt: new Date(cat.updatedAt),
          });
        }

        // Set up client database transactions
        for (const tx of sTx) {
          await localDb.transactions.put({
            id: tx.id,
            userId: tx.userId,
            categoryId: tx.categoryId,
            amount: tx.amount,
            note: tx.note,
            synced: 1,
            deleted: 0,
            createdAt: new Date(tx.createdAt),
            updatedAt: new Date(tx.updatedAt),
          });
        }

        // Set up client database gestures
        for (const gest of sGest) {
          await localDb.userGestures.put({
            id: gest.id,
            userId: gest.userId,
            gesture: gest.gesture,
            categoryId: gest.categoryId,
            createdAt: new Date(gest.createdAt),
            updatedAt: new Date(gest.updatedAt),
          });
        }

        // 5. Mark remaining local items that weren't deleted but successfully uploaded as synced
        // In case client made modifications during sync, we update synced: 1 for rows we uploaded
        const uploadedTxIds = unsyncedTx.filter(t => t.deleted === 0).map(t => t.id);
        if (uploadedTxIds.length > 0) {
          await localDb.transactions.where("id").anyOf(uploadedTxIds).modify({ synced: 1 });
        }

        const uploadedCatIds = unsyncedCat.filter(c => c.deleted === 0).map(c => c.id);
        if (uploadedCatIds.length > 0) {
          await localDb.categories.where("id").anyOf(uploadedCatIds).modify({ synced: 1 });
        }

        setSyncStatus("success");
        setLastSyncedAt(new Date());
      } else {
        console.error("Sync failed:", result.error);
        setSyncStatus("error");
      }
    } catch (error) {
      console.error("Critical sync error:", error);
      setSyncStatus("error");
    }
  };

  return (
    <SyncContext.Provider value={{ isOnline, syncStatus, lastSyncedAt, syncNow, userId }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error("useSync must be used within a SyncProvider");
  }
  return context;
}
