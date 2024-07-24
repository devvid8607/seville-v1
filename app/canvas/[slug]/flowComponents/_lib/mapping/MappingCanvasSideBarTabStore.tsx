import { create } from "zustand";

// Define a store and its interface
type MappingTabState = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
  sliderOpen: boolean;
  setSliderOpen: (open: boolean) => void;
  isComplexItem: boolean;
  setIsComplexItem: (isComplexItem: boolean) => void;
  editedMapId: string;
  setEditedMapId: (editedMapId: string) => void;
  rootMapId: string;
  setRootMapId: (editedMapId: string) => void;
  rootNodeId: string;
  setRootNodeId: (rootNodeId: string) => void;
  isTranformProp: boolean;
  setIsTranformProp: (isTranformProp: boolean) => void;
  isMappingProp: boolean;
  setIsMappingProp: (isMappingProp: boolean) => void;
  isEditingParentProp: boolean;
  setIsEditingParentProp: (isEditingParentProp: boolean) => void;
};

export const useMappingTabStore = create<MappingTabState>((set) => ({
  loading: true,
  setLoading: (loading) => set({ loading: loading }),
  model: null,

  activeTabIndex: 0, // Default active tab index
  setActiveTabIndex: (index) => set({ activeTabIndex: index }),
  sliderOpen: false, // Default state for sliderOpen
  setSliderOpen: (open) => set({ sliderOpen: open }),
  isComplexItem: false,
  setIsComplexItem: (isComplexItem) => set({ isComplexItem: isComplexItem }),
  editedMapId: "",
  setEditedMapId: (editedMapId) => set({ editedMapId: editedMapId }),
  rootMapId: "",
  setRootMapId: (rootMapId) => set({ rootMapId: rootMapId }),
  rootNodeId: "",
  setRootNodeId: (rootNodeId) => set({ rootNodeId: rootNodeId }),
  isTranformProp: false,
  setIsTranformProp: (isTranformProp) =>
    set({ isTranformProp: isTranformProp }),
  isMappingProp: false,
  setIsMappingProp: (isMappingProp) => set({ isMappingProp: isMappingProp }),
  isEditingParentProp: false,
  setIsEditingParentProp: (isEditingParentProp) =>
    set({ isEditingParentProp: isEditingParentProp }),
}));
