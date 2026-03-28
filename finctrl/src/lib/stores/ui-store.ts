import { create } from "zustand";
import type { TransactionWithRelations } from "@/lib/types/database";

interface UIState {
  isTransactionModalOpen: boolean;
  openTransactionModal: () => void;
  closeTransactionModal: () => void;
  refetchKey: number;
  triggerRefetch: () => void;
  editingTransaction: TransactionWithRelations | null;
  openEditTransactionModal: (transaction: TransactionWithRelations) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isTransactionModalOpen: false,
  openTransactionModal: () => set({ isTransactionModalOpen: true, editingTransaction: null }),
  closeTransactionModal: () => set({ isTransactionModalOpen: false, editingTransaction: null }),
  refetchKey: 0,
  triggerRefetch: () => set((state) => ({ refetchKey: state.refetchKey + 1 })),
  editingTransaction: null,
  openEditTransactionModal: (transaction: TransactionWithRelations) =>
    set({ isTransactionModalOpen: true, editingTransaction: transaction }),
}));
