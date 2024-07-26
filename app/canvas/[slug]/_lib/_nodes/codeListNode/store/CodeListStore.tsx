// import codeListDetails from "../../../../_lib/dummyData/CodeListData.json";
import { apiGet } from "@/app/helpers/apiClient";
import { queryClient } from "@/app/providers/QueryClientProvider";
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
  addCodeList: (newCodeList: CodeList) => void;
  fetchCodeById: (codeListId: string) => Promise<void>;
}

const fetchCodeListById = async (codeListId: string) => {
  return apiGet<CodeList>(`/codelists/${codeListId}`);
};

export const useCodeListStore = create<CodeListState>((set, get) => ({
  codeLists: [],
  getCodeById: (codeListId) => {
    const { codeLists } = get();
    return codeLists.find((codeList) => codeList.id === codeListId);
  },
  addCodeList: (newCodeList: CodeList) => {
    set((state) => {
      const codeListExists = state.codeLists.some(
        (codeList) => codeList.id === newCodeList.id
      );
      if (!codeListExists) {
        return {
          codeLists: [...state.codeLists, newCodeList],
        };
      }
      return state;
    });
  },
  fetchCodeById: async (codeListId: string) => {
    try {
      const codelist = await queryClient.fetchQuery({
        queryKey: ["codelists", codeListId],
        queryFn: () => fetchCodeListById(codeListId),
      });
      if (codelist) {
        get().addCodeList(codelist);
      }
    } catch (error) {
      console.error("Error fetching code list:", error);
    }
  },
}));
