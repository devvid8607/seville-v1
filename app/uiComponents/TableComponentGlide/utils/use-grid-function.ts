import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  DataEditorRef,
  GridColumn,
  GroupHeaderClickedEventArgs,
  Item,
  GridCell,
  isReadWriteCell,
  GridCellKind,
  SpriteMap,
} from "@glideapps/glide-data-grid";
import {
  ColumnConfigurationType,
  GridConfigurationType,
  GridFunctionType,
  GridActionEnum,
  GridJsonType,
  SortedColumnType,
} from "../types";
import { lossyCopyData } from "./utils";
import {
  MakeDefaultAndVisiblecColumnConfig,
  createDefaultObject,
  makeDefaultColumn,
  makeDefaultColumnConfig,
  visibleDefaultColumnConfig,
} from "../common";
import { getCell, useUndoRedo, addActionColumn } from ".";
import useTableStore from "../store/useTableStore";
import isEqual from "lodash/isEqual";

interface UseGridFunctionProps {
  gridJson: GridJsonType;
  sortedIndex: SortedColumnType;
  gridFunction?: GridFunctionType;
  tableId?: string;
}

const useGridFunction = ({
  gridJson,
  sortedIndex,
  gridFunction,
  tableId = "",
}: UseGridFunctionProps) => {
  const { tables } = useTableStore();

  const gridRef = useRef<DataEditorRef>(null);

  const {
    gridData: data,
    gridConfiguration,
    selectedRow,
    columnConfiguration,
  } = gridJson;

  const {
    isFiltering = false,
    isSorting = false,
    isEdittable = false,
    isDraggableColumn = false,
    isRowExpandable = false,
    isResizableColumn = true,
    isFillHandle = false,
    isRowAppended = false,
    isFreezeColumn = null,
    isPagination = false,
    isTooltip = false,
    isDraggableRow = false,
    isVerticalBorder = false,
    isTextWrap = false,
    isRowSelectable = true,
    isSearchable = true,
    isFreezeRow = null,
    isGroupedColumn = false,
    isGroupNameEditable = false,
    canPaste = false,
    isColumnStretched = true,
    canUndoRedo = false,
    isRowHovered = false,
    isCellSelectable = true,
    isContextMenu = false,
    showEditActionColumn = false,
    showMoreActionColumn = false,
    showViewActionColumn = false,
    showMatchButton = false,
    showUnmatchButton = false,
    showDeletableButton = false,
    isHeaderContextMenu = false,
    isFixedGrid = true,
  } = gridConfiguration || {};

  const headerIcons = useMemo<SpriteMap>(() => {
    return {
      sortUp: () =>
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
        <path d="M12 3V15M12 3L7.5 7.5M12 3L16.5 7.5" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      sortDown:
        () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
        <path d="M12 21V9M12 21L7.5 16.5M12 21L16.5 16.5" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
    };
  }, []);

  //#region -------Expand and Collapse Column Section

  const [collapsed, setCollapsed] = useState<readonly string[]>([]);

  const [originalColumnConfig, setOriginalColumnConfig] = useState<
    ColumnConfigurationType[]
  >(
    makeDefaultColumnConfig(
      addActionColumn(
        showMatchButton,
        showUnmatchButton,
        showViewActionColumn,
        showEditActionColumn,
        showDeletableButton,
        showMoreActionColumn,
        isRowExpandable,
        columnConfiguration
      )
    )
  );
  //#endregion

  const [gridData, setGridData] = useState<any[]>(
    data
      .map((item) => {
        return isRowExpandable ? { collapsed: true, ...item } : item;
      })
      .sort((a, b) => a.id - b.id)
  );

  useEffect(() => {
    setGridData(
      data
        .map((item) => {
          return isRowExpandable ? { collapsed: true, ...item } : item;
        })
        .sort((a, b) => a.id - b.id)
    );
  }, [data]);

  useEffect(() => {
    const newColumn = makeDefaultColumnConfig(
      addActionColumn(
        showMatchButton,
        showUnmatchButton,
        showViewActionColumn,
        showEditActionColumn,
        showDeletableButton,
        showMoreActionColumn,
        isRowExpandable,
        columnConfiguration
      )
    );
    setOriginalColumnConfig(newColumn);
    setGridColumn(
      makeDefaultColumn(
        newColumn,
        isGroupedColumn,
        isColumnStretched,
        isSorting,
        sortedIndex
      )
    );
  }, [columnConfiguration]);

  const newGridColumn = useMemo(() => {
    return makeDefaultColumn(
      originalColumnConfig,
      isGroupedColumn,
      isColumnStretched,
      isSorting,
      sortedIndex
    );
  }, [
    originalColumnConfig,
    isGroupedColumn,
    isColumnStretched,
    isSorting,
    sortedIndex,
  ]);

  const [gridColumn, setGridColumn] = useState<GridColumn[]>(newGridColumn);
  useEffect(() => {
    if (!isEqual(gridColumn, newGridColumn)) {
      setGridColumn(newGridColumn);
    }
  }, [newGridColumn, gridColumn]);

  const currentPageSize = tables[tableId]?.currentPageSize || gridData.length;
  const gridDataLength = tables[tableId]?.gridJson.gridData.length;

  const [numRows, setNumRows] = useState(
    gridDataLength < currentPageSize ? gridDataLength : currentPageSize
  );

  useEffect(() => {
    setNumRows(
      gridDataLength < currentPageSize ? gridDataLength : currentPageSize
    );
  }, [currentPageSize, gridDataLength]);

  const onGroupHeaderClicked = useCallback(
    (_colIndex: number, args: GroupHeaderClickedEventArgs) => {
      const group = args.group;

      if (!group) {
        return;
      }

      setGridColumn((prev) => {
        return prev.map((item, i) => {
          if (item.group === group) {
            if (!collapsed.includes(group)) {
              return {
                ...item,
                width: 8,
                grow: undefined,
              };
            }
            return {
              ...item,
              grow: undefined,
              width: 100,
            };
          }
          return item;
        });
      });

      setCollapsed((cv) =>
        cv.includes(group) ? cv.filter((g) => g !== group) : [...cv, group]
      );

      args.preventDefault();
    },
    [gridColumn, collapsed]
  );

  const deleteRow = (row: number): void => {
    if (gridFunction) {
      gridFunction(GridActionEnum.Delete);
    }
    setGridData((prev) => {
      const d = [...prev];
      d.splice(row, 1);
      return d;
    });
  };

  const getCellContent = useCallback(
    ([col, row]: Item): GridCell => {
      if (!gridData[row] || !originalColumnConfig[col]) {
        return { kind: GridCellKind.Loading, allowOverlay: true }; // or return a placeholder cell
      }
      const defaultColumnConfig = makeDefaultColumnConfig(
        originalColumnConfig
      ).filter((item) => item.isVisible);
      const sortedKeys = defaultColumnConfig.map((item) => item.id);

      function onCellChange<T>(newValue: T): void {
        const updatedArray = [...gridData];
        const dataRow = updatedArray[row];
        dataRow[sortedKeys[col]] = newValue;
        setGridData(updatedArray);
      }

      const cellContent = getCell(
        [col, row],
        gridData,
        defaultColumnConfig,
        isEdittable,
        onCellChange,
        gridFunction
      );

      return cellContent;
    },
    [
      gridData,
      isEdittable,
      originalColumnConfig,
      columnConfiguration,
      gridFunction,
      gridColumn,
    ]
  );

  const onRowAppended = useCallback(() => {
    const newDataRow = createDefaultObject(gridData, originalColumnConfig);
    setGridData((prev) => [...prev, newDataRow]);
    setNumRows((cv) => cv + 1);
  }, [gridData]);

  const onCellEdited = useCallback(
    (cell: Item, newVal: GridCell) => {
      const [col, row] = cell;
      const targetCell = getCellContent([col, row]);
      const sortedKeys = makeDefaultColumnConfig(originalColumnConfig)
        .filter((item) => item.isVisible)
        .map((item) => item.id);

      const editedCol =
        MakeDefaultAndVisiblecColumnConfig(originalColumnConfig)[col].id;
      if (isReadWriteCell(newVal)) {
        const editedFieldValue = { [editedCol]: newVal.data, row };
        gridFunction && gridFunction(GridActionEnum.Edit, editedFieldValue);
      }
      if (newVal.kind === "custom") {
        const editedFieldValue = { [editedCol]: newVal.data, row };
        gridFunction && gridFunction(GridActionEnum.Edit, editedFieldValue);
      }
      if (
        !originalColumnConfig[col].isEdittable ||
        newVal.kind === "custom" ||
        newVal.kind !== targetCell.kind
      ) {
        return;
      }
      if (isReadWriteCell(newVal)) {
        const updatedArray = [...gridData];
        updatedArray[row][sortedKeys[col]] = newVal.data;
        setGridData(updatedArray);
      }
    },
    [gridData, getCellContent, originalColumnConfig]
  );

  const onColumnResize = useCallback(
    (column: GridColumn, newSize: number) => {
      setGridColumn((prevColsMap) => {
        const index = prevColsMap.findIndex((ci) => ci.id === column.id);
        const newArray = [...prevColsMap];

        if (
          column.id &&
          visibleDefaultColumnConfig(originalColumnConfig)[index]?.isResizable
        ) {
          newArray.splice(index, 1, {
            ...prevColsMap[index],
            width: newSize,
          });
        }

        return newArray;
      });

      setOriginalColumnConfig((prevColsMap) => {
        const index = prevColsMap.findIndex((ci) => ci.id === column.id);
        const newArray = [...prevColsMap];

        if (
          column.id &&
          visibleDefaultColumnConfig(originalColumnConfig)[index]?.isResizable
        ) {
          newArray.splice(index, 1, {
            ...prevColsMap[index],
            width: newSize,
          });
        }

        return newArray;
      });
    },
    [originalColumnConfig]
  );

  const onColMoved = useCallback(
    (startIndex: number, endIndex: number): void => {
      if (
        !isDraggableColumn ||
        !originalColumnConfig[startIndex].isDraggable ||
        !originalColumnConfig[endIndex].isDraggable
      ) {
        return;
      }

      setOriginalColumnConfig((prev) => {
        const newConfig = prev
          .map((item) => {
            if (item.index === startIndex) {
              return { ...item, index: endIndex };
            } else if (item.index === endIndex) {
              return { ...item, index: startIndex };
            }
            return item;
          })
          .sort((a, b) => a.index - b.index);

        setGridColumn(
          newConfig.map((item, index) => {
            const { title, id, group, width, hasMenu, canGrow } = item;
            return {
              title,
              id,
              ...(group && { group }),
              ...(width && { width }),
              ...(hasMenu && { hasMenu }),
              grow:
                canGrow === false || !isColumnStretched
                  ? undefined
                  : (newConfig.length + index) / newConfig.length,
            };
          })
        );

        return newConfig;
      });
    },
    [isDraggableColumn, originalColumnConfig, isColumnStretched]
  );

  const reorderRows = useCallback((from: number, to: number) => {
    setGridData((prev) => {
      const d = [...prev];
      const removed = d.splice(from, 1);
      d.splice(to, 0, ...removed);
      return d;
    });
  }, []);

  const rowHeight = useCallback<(row: number) => number>(
    (row) => {
      const item = gridData[row];
      if (!isRowExpandable) {
        return 30;
      }
      return item?.collapsed ? 30 : 50;
    },
    [gridData]
  );

  const onGroupNameChange = useCallback(
    (oldName: string, newName: string) => {
      setOriginalColumnConfig((prev) => {
        const newConfig = prev
          .map((item) => {
            if (item.group === oldName) {
              return { ...item, group: newName };
            }
            return item;
          })
          .sort((a, b) => a.index - b.index);

        setGridColumn(
          newConfig.map((item, index) => {
            const { title, id, group, width, hasMenu, canGrow } = item;
            return {
              title,
              id,
              ...(group && { group }),
              ...(width && { width }),
              ...(hasMenu && { hasMenu }),
              grow:
                canGrow === false || !isColumnStretched
                  ? undefined
                  : (newConfig.length + index) / newConfig.length,
            };
          })
        );

        return newConfig;
      });
    },
    [isColumnStretched]
  );

  const [showSearch, setShowSearch] = useState(false);

  const {
    gridSelection,
    onGridSelectionChange,
    onCellEdited: setCellValue,
    undo,
    canRedo,
    canUndo,
    redo,
  } = useUndoRedo(
    gridRef,
    getCellContent,
    onCellEdited,
    gridFunction ? gridFunction : null,
    isEdittable,
    gridData,
    selectedRow
  );

  return {
    gridColumn,
    gridData,
    setGridData,
    getCellContent,
    setCellValue,
    onColumnResize,
    onColMoved,
    reorderRows,
    rowHeight,
    isTooltip,
    isDraggableRow,
    isVerticalBorder,
    isResizableColumn,
    isDraggableColumn,
    isRowSelectable,
    isSorting,
    isSearchable,
    isPagination,
    isFreezeColumn,
    isFreezeRow,
    onGroupNameChange,
    isGroupNameEditable,
    onRowAppended,
    numRows,
    setNumRows,
    isRowAppended,
    isFillHandle,
    onGroupHeaderClicked,
    gridRef,
    showSearch,
    setShowSearch,
    gridSelection,
    onGridSelectionChange,
    undo,
    canRedo,
    canUndo,
    redo,
    canUndoRedo,
    isRowHovered,
    isCellSelectable,
    isContextMenu,
    isHeaderContextMenu,
    headerIcons,
    isFixedGrid,
  };
};

export { useGridFunction };
