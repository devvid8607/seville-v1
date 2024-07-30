import { create } from "zustand";
import {
  ToolBoxType,
  ToolboxCategory,
} from "@/app/canvasBuilderv2/model/_lib/_queries/useToolBoxQueries";

interface ToolboxState {
  toolboxItems: ToolBoxType[];
  setToolboxItems: (items: ToolBoxType[]) => void;
  updateNodeChildren: (nodeId: string, children: ToolBoxType[]) => void;
  getItemsByType: (type: ToolboxCategory) => ToolBoxType[];
  getParentEntityId: (id: string) => string | undefined;
}

export const useToolboxStore = create<ToolboxState>((set, get) => ({
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
  getItemsByType: (type) => {
    const filterItems = (nodes: ToolBoxType[]): ToolBoxType[] => {
      let result: ToolBoxType[] = [];
      for (const node of nodes) {
        if (node.type === type) {
          result.push(node);
        }
        if (node.children) {
          result = result.concat(filterItems(node.children));
        }
      }
      return result;
    };
    return filterItems(get().toolboxItems);
  },
  getParentEntityId: (id) => {
    const findParentEntityId = (
      nodes: ToolBoxType[],
      targetId: string
    ): string | undefined => {
      for (const node of nodes) {
        if (node.children) {
          for (const child of node.children) {
            if (child.id === targetId) {
              return node.configuration?.entityId;
            }
          }
          const result = findParentEntityId(node.children, targetId);
          if (result) {
            return result;
          }
        }
      }
      return undefined;
    };

    return findParentEntityId(get().toolboxItems, id);
  },
}));
