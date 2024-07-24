import { create } from "zustand";
import { Variable } from "./CommonStoreType";

// Global Variables Store
export interface GlobalVariableState {
  variables: Variable[];
  findGlobalVariableById: (id: string) => Variable | null;
}

export const useGlobalVariableStore = create<GlobalVariableState>(
  (set, get) => ({
    variables: [
      { id: "13324", name: "System Date Time", type: "singleValue" },
      {
        id: "2234",
        name: "Logged in User ",
        type: "complexValue",
        children: [
          {
            id: "245644",
            name: "Logged In User Name",
            type: "singleValue",
            children: [],
          },
          {
            id: "2454",
            name: "Logged In User Email",
            type: "singleValue",
            children: [],
          },
        ],
      },
      {
        id: "223453432",
        name: "Sample List ",
        type: "listValue",
      },
    ],
    findGlobalVariableById: (id: string) => {
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

      return search(get().variables);
    },
  })
);
