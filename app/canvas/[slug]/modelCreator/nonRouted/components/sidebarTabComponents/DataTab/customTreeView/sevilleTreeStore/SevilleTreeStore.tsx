import { create } from "zustand";
import { TreeDataType } from "../SevilleTreeTypes/TreeTypes";

type TreeState = {
  data: TreeDataType[];
  setData: (data: TreeDataType[]) => void;
  toggleNode: (nodeId: string) => void;
  addRootNode: (node: TreeDataType) => void;
  removeNode: (nodeId: string) => void;
};

export const useTreeStore = create<TreeState>((set) => ({
  data: [],
  setData: (data) => set({ data }),
  toggleNode: (nodeId) =>
    set((state) => ({
      data: state.data.map((node) =>
        node.id === nodeId ? { ...node, isOpen: !node.isOpen } : node
      ),
    })),
  addRootNode: (node) =>
    set((state) => ({
      data: [...state.data, node],
    })),
  removeNode: (nodeId) => {},
}));
