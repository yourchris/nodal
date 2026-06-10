"use server";

import { db, user, transactions, categories, userGestures, budgets } from "@/db";
import { eq, and, inArray } from "drizzle-orm";

interface SyncPayload {
  userId: string;
  transactions: {
    id: string;
    categoryId: string;
    amount: number;
    note: string | null;
    deleted: number;
    createdAt: string;
    updatedAt: string;
  }[];
  categories: {
    id: string;
    name: string;
    icon: string;
    deleted: number;
    createdAt: string;
    updatedAt: string;
  }[];
  userGestures: {
    id: string;
    gesture: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export async function syncData(payload: SyncPayload) {
  const { userId, transactions: clientTx, categories: clientCat, userGestures: clientGest } = payload;

  if (!userId) {
    return { success: false, error: "User ID is required" };
  }

  try {
    // Ensure the user exists in the PostgreSQL user table to satisfy foreign key constraints
    const userExists = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });

    if (!userExists) {
      await db.insert(user).values({
        id: userId,
        name: "Default User",
        email: "default@nodal.app",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 1. Sync Categories
    for (const cat of clientCat) {
      if (cat.deleted === 1) {
        // Delete related transactions first to prevent foreign key errors (or let cascade handle it if configured, here we soft delete or restrict)
        await db.update(transactions)
          .set({ deleted: true, updatedAt: new Date() })
          .where(and(eq(transactions.userId, userId), eq(transactions.categoryId, cat.id)));
        
        await db.update(categories)
          .set({ deleted: true, updatedAt: new Date(cat.updatedAt) })
          .where(and(eq(categories.userId, userId), eq(categories.id, cat.id)));
      } else {
        // Upsert Category
        const existing = await db.query.categories.findFirst({
          where: and(eq(categories.userId, userId), eq(categories.id, cat.id)),
        });

        if (existing) {
          await db.update(categories)
            .set({
              name: cat.name,
              icon: cat.icon,
              deleted: false,
              updatedAt: new Date(cat.updatedAt),
            })
            .where(eq(categories.id, cat.id));
        } else {
          await db.insert(categories).values({
            id: cat.id,
            userId,
            name: cat.name,
            icon: cat.icon,
            deleted: false,
            createdAt: new Date(cat.createdAt),
            updatedAt: new Date(cat.updatedAt),
          });
        }
      }
    }

    // 2. Sync Transactions
    for (const tx of clientTx) {
      if (tx.deleted === 1) {
        await db.update(transactions)
          .set({ deleted: true, updatedAt: new Date(tx.updatedAt) })
          .where(and(eq(transactions.userId, userId), eq(transactions.id, tx.id)));
      } else {
        // Upsert Transaction
        const existing = await db.query.transactions.findFirst({
          where: and(eq(transactions.userId, userId), eq(transactions.id, tx.id)),
        });

        if (existing) {
          await db.update(transactions)
            .set({
              categoryId: tx.categoryId,
              amount: tx.amount.toString(),
              note: tx.note,
              deleted: false,
              updatedAt: new Date(tx.updatedAt),
            })
            .where(eq(transactions.id, tx.id));
        } else {
          await db.insert(transactions).values({
            id: tx.id,
            userId,
            categoryId: tx.categoryId,
            amount: tx.amount.toString(),
            note: tx.note,
            deleted: false,
            createdAt: new Date(tx.createdAt),
            updatedAt: new Date(tx.updatedAt),
          });
        }
      }
    }

    // 3. Sync Gestures
    for (const gest of clientGest) {
      const existing = await db.query.userGestures.findFirst({
        where: and(eq(userGestures.userId, userId), eq(userGestures.id, gest.id)),
      });

      if (existing) {
        await db.update(userGestures)
          .set({
            gesture: gest.gesture,
            categoryId: gest.categoryId,
            updatedAt: new Date(gest.updatedAt),
          })
          .where(eq(userGestures.id, gest.id));
      } else {
        await db.insert(userGestures).values({
          id: gest.id,
          userId,
          gesture: gest.gesture,
          categoryId: gest.categoryId,
          createdAt: new Date(gest.createdAt),
          updatedAt: new Date(gest.updatedAt),
        });
      }
    }

    // 4. Fetch all active server data to sync back to client
    const serverCategories = await db.query.categories.findMany({
      where: and(eq(categories.userId, userId), eq(categories.deleted, false)),
    });

    const serverTransactions = await db.query.transactions.findMany({
      where: and(eq(transactions.userId, userId), eq(transactions.deleted, false)),
    });

    const serverGestures = await db.query.userGestures.findMany({
      where: eq(userGestures.userId, userId),
    });

    return {
      success: true,
      data: {
        categories: serverCategories.map(c => ({
          id: c.id,
          userId: c.userId,
          name: c.name,
          icon: c.icon,
          deleted: 0,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString(),
        })),
        transactions: serverTransactions.map(t => ({
          id: t.id,
          userId: t.userId,
          categoryId: t.categoryId,
          amount: parseFloat(t.amount),
          note: t.note,
          deleted: 0,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
        })),
        userGestures: serverGestures.map(g => ({
          id: g.id,
          userId: g.userId,
          gesture: g.gesture,
          categoryId: g.categoryId,
          createdAt: g.createdAt.toISOString(),
          updatedAt: g.updatedAt.toISOString(),
        })),
      },
    };
  } catch (error: any) {
    console.error("Sync error:", error);
    return { success: false, error: error.message || "Unknown error during sync" };
  }
}

export async function resetServerData(userId: string) {
  if (!userId) {
    return { success: false, error: "User ID is required" };
  }

  try {
    // Delete all user transactions from PostgreSQL
    await db.delete(transactions).where(eq(transactions.userId, userId));
    // Delete all user budgets
    await db.delete(budgets).where(eq(budgets.userId, userId));
    // Delete custom gestures
    await db.delete(userGestures).where(eq(userGestures.userId, userId));
    // Delete custom user categories
    await db.delete(categories).where(eq(categories.userId, userId));

    return { success: true };
  } catch (error: any) {
    console.error("Reset server error:", error);
    return { success: false, error: error.message || "Failed to reset server data" };
  }
}
