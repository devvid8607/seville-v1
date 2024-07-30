// store.ts
import { create } from "zustand";
import { QueryClient } from "@tanstack/react-query";
import { apiGet } from "@/app/helpers/apiClient";
import { queryClient } from "@/app/providers/QueryClientProvider";

const fetchAllCodeLists = async () => {
  return apiGet<AllCodeType[]>(`/allcodes`);
};

// const fetchCodeListProperties = async (codeListId: string) => {
//   return apiGet<Property[]>(`/allcodes/${codeListId}/properties`);
// };

export interface Property {
  id: string;
  name: string;
}

export interface AllCodeType {
  id: string;
  name: string;
  properties?: Property[];
}

interface AllCodesState {
  allCodes: AllCodeType[];
  fetchAndSetAllCodes: () => void;
  setAllCodes: (models: AllCodeType[]) => void;
  // fetchAndSetCodeListProperties: (codeListId: string) => Promise<void>;
  // updateCodeListProperties: (
  //   codeListId: string,
  //   properties: Property[]
  // ) => void;
  // getPropertiesByCodeListId: (codeListId: string) => Property[] | undefined;
}

export const useAllCodesStore = create<AllCodesState>((set, get) => ({
  allCodes: [],

  fetchAndSetAllCodes: async () => {
    const queryClient = new QueryClient();
    try {
      const codes = await queryClient.fetchQuery({
        queryKey: ["allcodes"],
        queryFn: fetchAllCodeLists,
      });

      if (codes) {
        set({ allCodes: codes });
      }
    } catch (error) {
      console.error("Error fetching codes:", error);
    }
  },

  setAllCodes: (codes: AllCodeType[]) => set({ allCodes: codes }),

  // fetchAndSetCodeListProperties: async (codeListId: string) => {
  //   try {
  //     const properties = await queryClient.fetchQuery({
  //       queryKey: ["allCodesProperties", codeListId],
  //       queryFn: () => fetchCodeListProperties(codeListId),
  //     });
  //     console.log("prop in store", properties, codeListId);
  //     if (properties) {
  //       set((state) => {
  //         const updatedCodes = state.allCodes.map((code) =>
  //           code.id === codeListId ? { ...code, properties } : code
  //         );
  //         return { allCodes: updatedCodes };
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching code list properties:", error);
  //   }
  // },
  // updateCodeListProperties: (codeListId, properties) =>
  //   set((state) => {
  //     const updatedCodes = state.allCodes.map((code) =>
  //       code.id === codeListId ? { ...code, properties } : code
  //     );
  //     return { allCodes: updatedCodes };
  //   }),

  // getPropertiesByCodeListId: (codeListId: string) => {
  //   const code = get().allCodes.find((code) => code.id === codeListId);
  //   return code?.properties;
  // },
}));
