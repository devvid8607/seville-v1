import { create } from "zustand";
import { NodeStructureInput } from "../../../../FlowTypes/SevilleSchema";

type FlareDrawerStoreState = {
  isFlareDrawerOpen: boolean;
  setIsFlareDrawerOpen: (isFlareDrawerOpen: boolean) => void;
  flareInput: NodeStructureInput | null;
  setFlareInput: (input: NodeStructureInput) => void;
  ifConditionId: string | number | undefined | null;
  setIfConditionId: (ifConditionId: string | number | undefined | null) => void;
  ifValueId: string | null;
  setIfValueId: (ifValueId: string) => void;
  testItem: boolean;
  setTestItem: (testItem: boolean) => void;
  isFromIfInput: boolean;
  setIsFromIfInput: (testItem: boolean) => void;
  flareNodeId: string | null;
  setFlareNodeId: (flareNodeId: string) => void;
  textFieldId: string | null;
  setTextFieldId: (textFieldId: string | null) => void;
  iteratorItemToBeUpdated: string | null;
  setIteratorItemToBeUpdated: (iteratorItemToBeUpdated: string | null) => void;
};

export const useFlareDrawerStore = create<FlareDrawerStoreState>((set) => ({
  isFlareDrawerOpen: false,
  setIsFlareDrawerOpen: (isFlareDrawerOpen) =>
    set({ isFlareDrawerOpen: isFlareDrawerOpen }),
  flareInput: null,
  setFlareInput: (input) => set({ flareInput: input }),
  ifConditionId: null,
  setIfConditionId: (ifConditionId) => set({ ifConditionId: ifConditionId }),
  ifValueId: null,
  setIfValueId: (ifValueId) => set({ ifValueId: ifValueId }),
  testItem: false,
  setTestItem: (testItem) => set({ testItem: testItem }),
  isFromIfInput: false,
  setIsFromIfInput: (isFromIfInput) => set({ isFromIfInput: isFromIfInput }),
  flareNodeId: null,
  setFlareNodeId: (flareNodeId) => set({ flareNodeId: flareNodeId }),
  textFieldId: null,
  setTextFieldId: (textFieldId) => set({ textFieldId: textFieldId }),
  iteratorItemToBeUpdated: null,
  setIteratorItemToBeUpdated: (iteratorItemToBeUpdated) =>
    set({ iteratorItemToBeUpdated: iteratorItemToBeUpdated }),
}));
