import { create } from "zustand";
import { TreeDataType } from "../../../_lib/_components/sidebarTabComponents/dataTab/customTreeView/sevilleTreeTypes/TreeTypes";
import { DataItem } from "../../../_lib/_nodes/listGridNode/inputs/SampleTable";

// interface GridDataType {
//   gridData: DataItem[];
// }

interface DroppableStore {
  treeSelectorNodes: Map<string, TreeDataType | null>;
  setTreeSelectorNode: (
    nodeId: string,
    treeSelectorNode: TreeDataType | null
  ) => void;
  removeTreeSelectorNode: (nodeId: string) => void;
  resetTreeSelectorNodes: () => void;
  getTreeSelectorNode: (nodeId: string) => TreeDataType | null;

  gridSelectorNodes: Map<string, DataItem[] | null>;
  setGridSelectorNode: (
    nodeId: string,
    gridSelectorNode: DataItem[] | null
  ) => void;
  removeGridSelectorNode: (nodeId: string) => void;
  resetGridSelectorNodes: () => void;
  getGridSelectorNode: (nodeId: string) => DataItem[] | null;
}

export const useDroppableStore = create<DroppableStore>((set, get) => ({
  treeSelectorNodes: new Map(), // Initialize as an empty Map
  gridSelectorNodes: new Map(),

  setTreeSelectorNode: (nodeId, treeSelectorNode) =>
    set((state) => {
      const newNodes = new Map(state.treeSelectorNodes);
      newNodes.set(nodeId, treeSelectorNode);
      return { treeSelectorNodes: newNodes };
    }),

  removeTreeSelectorNode: (nodeId) =>
    set((state) => {
      const newNodes = new Map(state.treeSelectorNodes);
      newNodes.delete(nodeId);
      return { treeSelectorNodes: newNodes };
    }),

  resetTreeSelectorNodes: () => set({ treeSelectorNodes: new Map() }),
  getTreeSelectorNode: (nodeId: string) => {
    const result = get().treeSelectorNodes.get(nodeId);
    return result === undefined ? null : result;
  },

  setGridSelectorNode: (nodeId, gridSelectorNode) =>
    set((state) => {
      const newNodes = new Map(state.gridSelectorNodes);
      newNodes.set(nodeId, gridSelectorNode);
      return { gridSelectorNodes: newNodes };
    }),

  removeGridSelectorNode: (nodeId) =>
    set((state) => {
      const newNodes = new Map(state.gridSelectorNodes);
      newNodes.delete(nodeId);
      return { gridSelectorNodes: newNodes };
    }),

  resetGridSelectorNodes: () => set({ gridSelectorNodes: new Map() }),
  getGridSelectorNode: (nodeId: string) => {
    const result = get().gridSelectorNodes.get(nodeId);
    return result === undefined ? null : result;
  },
}));
