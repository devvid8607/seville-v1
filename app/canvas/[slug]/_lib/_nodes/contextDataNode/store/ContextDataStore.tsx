import { create } from "zustand";
import { Variable } from "./CommonStoreType";

// Global Variables Store
export interface ContextDataState {
  data: Variable[];
  findContextDataById: (id: string) => Variable | null;
}

export const useContextDataStore = create<ContextDataState>((set, get) => ({
  data: [
    {
      id: "123",
      name: "CentricOutputModel",
      type: "complexValue",
      children: [
        {
          id: "45644",
          name: "PalletInformation",
          type: "complexValue",
          children: [{ id: "345434", name: "Height", type: "singleValue" }],
        },
      ],
    },
    {
      id: "456",
      name: "VendorOutputModel",
      type: "complexValue",
      children: [
        { id: "345656", name: "Success", type: "singleValue" },
        {
          id: "3156",
          name: "Address",
          type: "complexValue",
          children: [
            { id: "156", name: "Address Line", type: "singleValue" },
            {
              id: "15655",
              name: "Zip Code",
              type: "complexValue",
              children: [
                { id: "156789", name: "Customer Name", type: "singleValue" },
              ],
            },
            { id: "955", name: "City", type: "complexValue" },
            {
              id: "22955",
              name: "Random User",
              type: "complexValue",
              children: [
                { id: "152346", name: "User Name", type: "singleValue" },
                { id: "100346", name: "User Role", type: "singleValue" },
                {
                  id: "900346",
                  name: "User Address",
                  type: "complexValue",
                  children: [
                    { id: "156", name: "Address Line", type: "singleValue" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  findContextDataById: (id: string) => {
    const search = (variables: Variable[]): Variable | null => {
      for (let variable of variables) {
        if (variable.id === id) {
          return variable;
        }
        if (variable.children) {
          const found = search(variable.children);
          if (found) {
            return found;
          }
        }
      }
      return null; // Not found
    };

    return search(get().data);
  },
}));
