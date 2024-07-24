import { create } from "zustand";
import { Variable } from "./CommonStoreType";

// Global Variables Store
export interface CustomVariableState {
  variables: Variable[];
  findCustomVariableById: (id: string) => Variable | null;
}

export const useCustomVariableStore = create<CustomVariableState>(
  (set, get) => ({
    variables: [
      { id: "789", name: "MyVariable1", type: "singleValue" },
      {
        id: "585",
        name: "MyVariable2",
        type: "complexValue",
        children: [
          {
            id: "5644",
            name: "MyVariable2 - Name",
            type: "singleValue",
            children: [],
          },
          {
            id: "245114",
            name: "MyVariable2- Date",
            type: "singleValue",
            children: [],
          },
        ],
      },
    ],
    findCustomVariableById: (id: string) => {
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
