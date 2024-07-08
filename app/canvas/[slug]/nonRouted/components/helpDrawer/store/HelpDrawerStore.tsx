import { create } from "zustand";

type HelpStoreState = {
  isHelpDrawerOpen: boolean;
  setIsHelpDrawerOpen: (loading: boolean) => void;
};

export const useHelpStore = create<HelpStoreState>((set) => ({
  isHelpDrawerOpen: false,
  setIsHelpDrawerOpen: (isHelpDrawerOpen) =>
    set({ isHelpDrawerOpen: isHelpDrawerOpen }),
}));
