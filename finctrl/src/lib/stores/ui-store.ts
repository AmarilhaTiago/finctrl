import { create } from "zustand";

interface UIState {
  isTransactionModalOpen: boolean;
  openTransactionModal: () => void;
  closeTransactionModal: () => void;
  refetchKey: number;
  triggerRefetch: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isTransactionModalOpen: false,
  openTransactionModal: () => set({ isTransactionModalOpen: true }),
  closeTransactionModal: () => set({ isTransactionModalOpen: false }),
  refetchKey: 0,
  triggerRefetch: () => set((state) => ({ refetchKey: state.refetchKey + 1 })),
}));
