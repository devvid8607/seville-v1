import { create } from "zustand";
import { GridJsonType } from "../types";

// Define types for table state
interface TableState {
  sortedColumn?: { columnName: string; sortDirection: "1" | "-1" };
  currentPageIndex: number;
  currentPageSize: number;
  totalPages: number;
  gridJson: GridJsonType; // Adjust the type according to your grid data structure
}

// Define store state interface
interface TableStoreState {
  tables: Record<string, TableState>; // Record where keys are tableIds and values are TableState
  setSortedColumn: (
    tableId: string,
    columnName: string,
    sortDirection: "1" | "-1"
  ) => void;
  setCurrentPagination: (
    tableId: string,
    pageIndex: number,
    pageSize: number
  ) => void;
  setTotalPages: (tableId: string, totalPages: number) => void;
  setGridData: (tableId: string, gridJson: GridJsonType) => void; // Adjust the type according to your grid data structure
}

// Create Zustand store
const useTableStore = create<TableStoreState>((set) => ({
  tables: {},
  setSortedColumn: (tableId, columnName, sortDirection) =>
    set((state) => ({
      tables: {
        ...state.tables,
        [tableId]: {
          ...state.tables[tableId],
          sortedColumn: { columnName, sortDirection },
        },
      },
    })),
  setCurrentPagination: (tableId, pageIndex, pageSize) =>
    set((state) => ({
      tables: {
        ...state.tables,
        [tableId]: {
          ...state.tables[tableId],
          currentPageIndex: pageIndex,
          currentPageSize: pageSize,
        },
      },
    })),
  setTotalPages: (tableId, totalPages) =>
    set((state) => ({
      tables: {
        ...state.tables,
        [tableId]: {
          ...state.tables[tableId],
          totalPages: totalPages,
        },
      },
    })),
  setGridData: (tableId, gridData) =>
    set((state) => ({
      tables: {
        ...state.tables,
        [tableId]: {
          ...state.tables[tableId],
          gridJson: gridData,
        },
      },
    })),
}));

export default useTableStore;
