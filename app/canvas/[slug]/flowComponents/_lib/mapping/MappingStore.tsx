import { create } from "zustand";

type MappingStoreState = {
  isMappingDrawerOpen: boolean;
  setIsMappingDrawerOpen: (loading: boolean) => void;
  mappingModelId: string;
  setMappingModelId: (mappingModelId: string) => void;
  mappingNodeId: string;
  setMappingNodeId: (mappingNodeId: string) => void;
};

export const useMappingStore = create<MappingStoreState>((set) => ({
  isMappingDrawerOpen: false,
  setIsMappingDrawerOpen: (isMappingDrawerOpen) =>
    set({ isMappingDrawerOpen: isMappingDrawerOpen }),
  mappingModelId: "", // Initialize modelId with null
  setMappingModelId: (mappingModelId) => set({ mappingModelId }),
  mappingNodeId: "", // Initialize modelId with null
  setMappingNodeId: (mappingNodeId) => set({ mappingNodeId }),
}));
