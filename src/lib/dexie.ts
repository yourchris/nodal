import Dexie, { type Table } from "dexie";

export interface LocalTransaction {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  note: string | null;
  synced: number; // 0 = unsynced, 1 = synced
  deleted: number; // 0 = active, 1 = soft-deleted
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalCategory {
  id: string;
  userId: string | null; // null for global default categories
  name: string;
  icon: string;
  synced: number;
  deleted: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalBudget {
  id: string;
  userId: string;
  categoryId: string;
  limitAmount: number;
  currentAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalUserGesture {
  id: string;
  userId: string;
  gesture: string; // swipe_left, swipe_right, swipe_up, swipe_down
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

class NodalDatabase extends Dexie {
  transactions!: Table<LocalTransaction>;
  categories!: Table<LocalCategory>;
  budgets!: Table<LocalBudget>;
  userGestures!: Table<LocalUserGesture>;

  constructor() {
    super("NodalDatabase");
    this.version(1).stores({
      transactions: "id, userId, categoryId, synced, deleted, [synced+deleted]",
      categories: "id, userId, synced, deleted, [synced+deleted]",
      budgets: "id, userId, categoryId",
      userGestures: "id, userId, gesture",
    });

    this.on("populate", () => {
      // Pre-populate default categories
      this.categories.bulkAdd([
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

      // Pre-populate default user gestures
      this.userGestures.bulkAdd([
        {
          id: "gest-left",
          userId: "default-user-id",
          gesture: "swipe_left",
          categoryId: "cat-food",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "gest-right",
          userId: "default-user-id",
          gesture: "swipe_right",
          categoryId: "cat-transport",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "gest-up",
          userId: "default-user-id",
          gesture: "swipe_up",
          categoryId: "cat-entertainment",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    });
  }
}

export const localDb = new NodalDatabase();
