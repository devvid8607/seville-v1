import { create } from "zustand";

interface CustomTreeStore {
  expandedNodes: Record<string, boolean>;
  toggleNode: (id: string) => void;
  setNodeExpansion: (nodes: Record<string, boolean>) => void;
  expandAll: () => void;
  collapseAll: () => void;
  allNodeIds: string[];
  setAllNodeIds: (ids: string[]) => void;
  clearAllExpandedNodes: () => void;
  loadingNodes: Record<string, boolean>;
  setNodeLoading: (nodeId: string, loading: boolean) => void;
}

const useToolBoxCustomTreeStore = create<CustomTreeStore>((set) => ({
  allNodeIds: [],
  loadingNodes: {},
  setAllNodeIds: (ids) => set({ allNodeIds: ids }),
  expandedNodes: {},
  toggleNode: (id: string) =>
    set((state) => ({
      expandedNodes: {
        ...state.expandedNodes,
        [id]: !state.expandedNodes[id], // Toggle the boolean value
      },
    })),
  setNodeExpansion: (nodes: Record<string, boolean>) =>
    set(() => ({
      expandedNodes: nodes, // Set multiple node expansions at once
    })),
  expandAll: () =>
    set((state) => {
      const allExpanded = state.allNodeIds.reduce<Record<string, boolean>>(
        (acc, nodeId) => {
          acc[nodeId] = true; // Mark as expanded
          return acc;
        },
        {}
      );
      return { expandedNodes: allExpanded };
    }),
  collapseAll: () => set({ expandedNodes: {} }),
  clearAllExpandedNodes: () => set({ expandedNodes: {} }),
  setNodeLoading: (nodeId, loading) =>
    set((state) => ({
      loadingNodes: { ...state.loadingNodes, [nodeId]: loading },
    })),
}));

export default useToolBoxCustomTreeStore;
