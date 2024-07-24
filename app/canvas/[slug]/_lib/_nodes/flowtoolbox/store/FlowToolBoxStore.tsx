import { create } from "zustand";
import { ToolBoxType } from "@/app/canvas/[slug]/modelCreator/_lib/_queries/useToolBoxQueries";

interface ToolboxState {
  toolboxItems: ToolBoxType[];
  setToolboxItems: (items: ToolBoxType[]) => void;
  updateNodeChildren: (nodeId: string, children: ToolBoxType[]) => void;
}

export const useToolboxStore = create<ToolboxState>((set) => ({
  toolboxItems: [],
  setToolboxItems: (items) => set({ toolboxItems: items }),
  updateNodeChildren: (nodeId, children) =>
    set((state) => {
      const updateTreeData = (nodes: ToolBoxType[]): ToolBoxType[] => {
        return nodes.map((node) => {
          if (node.id === nodeId) {
            return { ...node, children };
          }
          if (node.children) {
            return { ...node, children: updateTreeData(node.children) };
          }
          return node;
        });
      };
      return { toolboxItems: updateTreeData(state.toolboxItems) };
    }),
}));
