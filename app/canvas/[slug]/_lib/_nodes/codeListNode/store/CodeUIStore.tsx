import { create } from "zustand";

type CodeUIState = {
  showNodeContextMenu: boolean;
  nodeContextMenuPosition: { mouseX: number; mouseY: number } | null;
  setShowNodeContextMenu: (
    show: boolean,
    position?: { mouseX: number; mouseY: number } | null
  ) => void;
};

export const useCodeUIStore = create<CodeUIState>((set) => ({
  showNodeContextMenu: false, // Default state for sliderOpen
  nodeContextMenuPosition: null,
  setShowNodeContextMenu: (show, position = null) =>
    set({
      showNodeContextMenu: show,
      nodeContextMenuPosition: position,
    }),
}));
