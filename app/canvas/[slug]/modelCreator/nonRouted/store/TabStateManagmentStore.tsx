import { create } from "zustand";
import { Model } from "../store/modelStore/ModelDetailsFromBackendStore";

type MenuPosition = {
  x: number;
  y: number;
};

// Define a store and its interface
type TabState = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
  sliderOpen: boolean;
  setSliderOpen: (open: boolean) => void;
  modelId: string;
  setModelId: (modelId: string) => void;
  attributeId: string;
  setAttributeId: (fieldId: string) => void;
  showContextMenu: boolean;
  setShowContextMenu: (show: boolean) => void;
  menuPosition: MenuPosition;
  setMenuPosition: (position: MenuPosition) => void;
  handleId: string | null;
  setHandleId: (handleId: string | null) => void;
  handleExists: boolean;
  setHandleExists: (handleExists: boolean) => void;
  sourceNodeForEdge: string;
  setSourceNodeForEdge: (sourceNodeForEdge: string) => void;
  model: Model | null;
  setModel: (model: Model) => void;
  showNodeContextMenu: boolean;
  nodeContextMenuPosition: { mouseX: number; mouseY: number } | null;
  setShowNodeContextMenu: (
    show: boolean,
    position?: { mouseX: number; mouseY: number } | null
  ) => void;
  isModelPropertyShowing: boolean;
  setIsModelPropertyShowing: (isModelPropertyShowing: boolean) => void;
  replaceModelContextMenuSource: string;
  setReplaceModelContextMenuSource: (
    replaceModelContextMenuSource: string
  ) => void;

  showLogicOutputNodeContextMenu: boolean;
  logicOutputNodeContextMenuPosition: { mouseX: number; mouseY: number } | null;
  setShowLogicOutputNodeContextMenu: (
    show: boolean,
    position?: { mouseX: number; mouseY: number } | null
  ) => void;
  ruleIdForPropertiesTab: string | null;
  setRuleIdForPropertiesTab: (ruleIdForPropertiesTab: string | null) => void;
  isSystemNodeHeaderPropertyShowing: boolean | null;
  setIsSystemNodeHeaderPropertyShowing: (ruleId: boolean | null) => void;
  showMiniMap: boolean;
  setShowMiniMap: (showMiniMap: boolean) => void;
  initialSchema: any;
  setInitialSchema: (initialSchema: any) => void;
};

export const useTabStore = create<TabState>((set) => ({
  loading: true,
  setLoading: (loading) => set({ loading: loading }),
  showMiniMap: true,
  setShowMiniMap: (showMiniMap) => set({ showMiniMap: showMiniMap }),
  initialSchema: {},
  setInitialSchema: (initialSchema) => set({ initialSchema: initialSchema }),
  model: null,
  setModel: (model) => set({ model: model }),
  isModelPropertyShowing: false,
  setIsModelPropertyShowing: (isModelPropertyShowing) =>
    set({ isModelPropertyShowing: isModelPropertyShowing }),
  activeTabIndex: 0, // Default active tab index
  setActiveTabIndex: (index) => set({ activeTabIndex: index }),
  sliderOpen: false, // Default state for sliderOpen
  setSliderOpen: (open) => set({ sliderOpen: open }),
  modelId: "", // Initialize modelId with null
  setModelId: (modelId) => set({ modelId }), // Implement setModelId
  attributeId: "", // Initialize fieldId with null
  setAttributeId: (attributeId) => set({ attributeId }), // Implement setFieldId
  showContextMenu: false,
  setShowContextMenu: (show) => set({ showContextMenu: show }),
  menuPosition: { x: 0, y: 0 },
  setMenuPosition: (position) => set({ menuPosition: position }),
  handleId: "",
  setHandleId: (handleId) => set({ handleId: handleId }),
  handleExists: false,
  setHandleExists: (show) => set({ handleExists: show }),
  sourceNodeForEdge: "", // Initialize modelId with null
  setSourceNodeForEdge: (sourceNodeForEdge) => set({ sourceNodeForEdge }), // Implement setModelId
  showNodeContextMenu: false, // Default state for sliderOpen
  nodeContextMenuPosition: null,
  setShowNodeContextMenu: (show, position = null) =>
    set({
      showNodeContextMenu: show,
      nodeContextMenuPosition: position,
    }),

  showLogicOutputNodeContextMenu: false, // Default state for sliderOpen
  logicOutputNodeContextMenuPosition: null,
  setShowLogicOutputNodeContextMenu: (show, position = null) =>
    set({
      showLogicOutputNodeContextMenu: show,
      logicOutputNodeContextMenuPosition: position,
    }),

  ruleIdForPropertiesTab: null, // Initialize modelId with null
  setRuleIdForPropertiesTab: (ruleIdForPropertiesTab) =>
    set({ ruleIdForPropertiesTab: ruleIdForPropertiesTab }), // Implement setModelId

  isSystemNodeHeaderPropertyShowing: null, // Initialize modelId with null
  setIsSystemNodeHeaderPropertyShowing: (isSystemNodeHeaderPropertyShowing) =>
    set({ isSystemNodeHeaderPropertyShowing }), // Implement setModelId

  replaceModelContextMenuSource: "",
  setReplaceModelContextMenuSource: (replaceModelContextMenuSource) =>
    set({ replaceModelContextMenuSource: replaceModelContextMenuSource }),
}));
