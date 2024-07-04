// store.ts
import { create } from "zustand";

interface Field {
  label: string;
  category: string;
  id?: string;
  name?: string;
  dataType: string;
}

interface FieldStore {
  recentFields: Field[];
  addRecentField: (field: Field) => void;
}

const useFieldStore = create<FieldStore>((set) => ({
  recentFields: [], // This will initially be empty

  addRecentField: (field: Field) =>
    set((state) => {
      // Remove the existing entry if it exists
      const filteredRecentFields = state.recentFields.filter(
        (f) => f.label !== field.label
      );
      // Prepend the new/updated field
      const updatedRecentFields = [field, ...filteredRecentFields].slice(0, 3);
      return { recentFields: updatedRecentFields };
    }),
}));

export default useFieldStore;
