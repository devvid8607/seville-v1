import codeListDetails from "../../../../_lib/dummyData/CodeListData.json";
import { create } from "zustand";

interface Property {
  id: string;
  name: string;
}

export interface CodeList {
  id: string;
  name: string;
  properties: Property[];
  data: any[];
}

interface CodeListState {
  codeLists: CodeList[];
  getCodeById: (codeListId: string) => CodeList | undefined;
}

export const useCodeListStore = create<CodeListState>((set, get) => ({
  codeLists: codeListDetails.codeListData,
  getCodeById: (codeListId) => {
    const { codeLists } = get();
    return codeLists.find((codeList) => codeList.id === codeListId);
  },
}));
