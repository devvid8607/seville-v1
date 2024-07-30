// store.ts
import { create } from "zustand";
import { QueryClient } from "@tanstack/react-query";
import { apiGet } from "@/app/helpers/apiClient";

const fetchAllModels = async () => {
  return apiGet<AllModelType[]>(`/allmodels`);
};

export interface AllModelType {
  id: string;
  name: string;
}

interface ModelState {
  allModels: AllModelType[];
  fetchAndSetAllModels: () => void;
  setAllModels: (models: AllModelType[]) => void;
}

export const useAllModelsStore = create<ModelState>((set) => ({
  allModels: [],

  fetchAndSetAllModels: async () => {
    const queryClient = new QueryClient();
    try {
      const models = await queryClient.fetchQuery({
        queryKey: ["allmodels"],
        queryFn: fetchAllModels,
      });

      if (models) {
        set({ allModels: models });
      }
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  },

  setAllModels: (models: AllModelType[]) => set({ allModels: models }),
}));
