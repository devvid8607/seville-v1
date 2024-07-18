import { create } from "zustand";
import axios from "axios";
import dataTypeDataDromJSON from "../../_lib/dummyData/DataTypes.json";

// Define a type for the store's state for better TypeScript support (optional)
export type DataType = {
  id: string;
  code: string;
  name: string;
  icon: string;
  isRecursive: boolean;
  properties: any[];
};

type DataTypesStore = {
  dataTypes: DataType[];
  currentListValueFromStore: any[];
  setCurrentListValueToStore: (value: any) => void;
  selectNumber: number;
  incrementSelectNumber: () => void;
  fetchData: () => Promise<void>;
  getDataTypeByCode: (code: string) => DataType | undefined;
  getDataTypeById: (id: string) => DataType | undefined;
  getCurrentListItemById: (id: string) => any;
  getNameByCode: (code: string) => String | undefined;
};

// Create the store
const useDataTypesStore = create<DataTypesStore>((set, get) => ({
  dataTypes: [], // Initial state
  currentListValueFromStore: [],
  selectNumber: 0,
  incrementSelectNumber: () => {
    const currSelectNumber = get().selectNumber;
    const newSelectNumber = currSelectNumber + 1;
    set({ selectNumber: newSelectNumber });
  },
  setCurrentListValueToStore: (items) => {
    set((state) => {
      const updatedList = Array.isArray(items) ? items : [items];
      // Check and add each item only if it doesn't exist
      const newList = state.currentListValueFromStore.concat(
        updatedList.filter(
          (newItem) =>
            !state.currentListValueFromStore.some(
              (item) => item.id === newItem.id
            )
        )
      );
      return { currentListValueFromStore: newList };
    });
  },
  fetchData: async () => {
    const currentData = get().dataTypes;
    // Only fetch if dataTypes is empty
    if (currentData.length === 0) {
      try {
        //const response = await axios.get("https://api.example.com/dataTypes");

        set({ dataTypes: dataTypeDataDromJSON.types });
      } catch (error) {
        console.error("Failed to fetch data types:", error);
        // Optionally set a default or fallback state if the fetch fails
        set({ dataTypes: [] }); // Example fallback to an empty array
      }
    }
  },
  getDataTypeByCode: (code) => {
    const { dataTypes } = get();
    return dataTypes.find((type) => type.code === code);
  },
  getDataTypeById: (id) => {
    const { dataTypes } = get();
    return dataTypes.find((type) => type.id === id);
  },
  getCurrentListItemById: (id) => {
    const { currentListValueFromStore } = get();
    return currentListValueFromStore.find((item) => item.id === id);
  },
  getNameByCode: (code) => {
    const { currentListValueFromStore } = get();
    const currDataType = currentListValueFromStore.find(
      (item) => item.code === code
    );
    if (currDataType) return currDataType.name;
  },
}));

export default useDataTypesStore;
