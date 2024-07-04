import React from "react";
import {
  type EditableGridCell,
  type GridCell,
  GridCellKind,
  type GridColumn,
  GridColumnIcon,
  isEditableGridCell,
  isTextEditableGridCell,
  type Item,
} from "@glideapps/glide-data-grid";

function isTruthy(x: any): boolean {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  return x ? true : false;
}

/**
 * Attempts to copy data between grid cells of any kind.
 */
export function lossyCopyData<T extends EditableGridCell>(
  source: EditableGridCell,
  target: T
): EditableGridCell {
  const sourceData = source.data;

  if (source.kind === target.kind) {
    return {
      ...target,
      data: sourceData as any,
    };
  } else
    switch (target.kind) {
      case GridCellKind.Uri: {
        if (Array.isArray(sourceData)) {
          return {
            ...target,
            data: sourceData[0],
          };
        }
        return {
          ...target,
          data: sourceData?.toString() ?? "",
        };
      }
      case GridCellKind.Boolean: {
        if (Array.isArray(sourceData)) {
          return {
            ...target,
            data: sourceData[0] !== undefined,
          };
        } else if (source.kind === GridCellKind.Boolean) {
          return {
            ...target,
            data: source.data,
          };
        }
        return {
          ...target,
          data: isTruthy(sourceData) ? true : false,
        };
      }
      case GridCellKind.Image: {
        if (Array.isArray(sourceData)) {
          return {
            ...target,
            data: [sourceData[0]],
          };
        }
        return {
          ...target,
          data: [sourceData?.toString() ?? ""],
        };
      }
      case GridCellKind.Number: {
        return {
          ...target,
          data: 0,
          displayData: "0",
        };
      }
      case GridCellKind.Text:
      case GridCellKind.Markdown: {
        if (Array.isArray(sourceData)) {
          return {
            ...target,
            data: sourceData[0].toString() ?? "",
          };
        }

        return {
          ...target,
          data: source.data?.toString() ?? "",
        };
      }
      case GridCellKind.Custom: {
        return target;
      }
      // No default
    }
}

export type GridColumnWithMockingInfo = GridColumn & {
  getContent(): GridCell;
};

export function getGridColumn(
  columnWithMock: GridColumnWithMockingInfo
): GridColumn {
  const { getContent, ...rest } = columnWithMock;

  return rest;
}

function createTextColumnInfo(
  index: number,
  group: boolean
): GridColumnWithMockingInfo {
  return {
    title: `Column ${index}`,
    id: `Column ${index}`,
    group: group ? `Group ${Math.round(index / 3)}` : undefined,
    icon: GridColumnIcon.HeaderString,
    hasMenu: false,
    getContent: () => {
      return {
        kind: GridCellKind.Text,
        data: "",
        displayData: "",
        allowOverlay: true,
        readonly: true,
      };
    },
  };
}

function getResizableColumns(
  defaultColumns: GridColumnWithMockingInfo[],
  amount: number,
  group: boolean
): GridColumnWithMockingInfo[] {
  if (amount < defaultColumns.length) {
    return defaultColumns.slice(0, amount);
  }

  const extraColumnsAmount = amount - defaultColumns.length;

  // eslint-disable-next-line unicorn/no-new-array
  const extraColumns = [...new Array(extraColumnsAmount)].map((_, index) =>
    createTextColumnInfo(index + defaultColumns.length, group)
  );

  return [...defaultColumns, ...extraColumns];
}

export class ContentCache {
  // column -> row -> value
  private cachedContent: Map<number, GridCell[]> = new Map();

  get(col: number, row: number) {
    const colCache = this.cachedContent.get(col);

    if (colCache === undefined) {
      return undefined;
    }

    return colCache[row];
  }

  set(col: number, row: number, value: GridCell) {
    let rowCache = this.cachedContent.get(col);
    if (rowCache === undefined) {
      this.cachedContent.set(col, (rowCache = []));
    }
    rowCache[row] = value;
  }
}

export function useMockDataGenerator(
  defaultColumns: GridColumnWithMockingInfo[],
  numCols: number,
  readonly: boolean = true,
  group: boolean = false
) {
  const cache = React.useRef<ContentCache>(new ContentCache());

  const [colsMap, setColsMap] = React.useState(() =>
    getResizableColumns(defaultColumns, numCols, group)
  );

  React.useEffect(() => {
    setColsMap(getResizableColumns(defaultColumns, numCols, group));
  }, [group, numCols]);

  const onColumnResize = React.useCallback(
    (column: GridColumn, newSize: number) => {
      setColsMap((prevColsMap) => {
        const index = prevColsMap.findIndex((ci) => ci.title === column.title);
        const newArray = [...prevColsMap];
        newArray.splice(index, 1, {
          ...prevColsMap[index],
          width: newSize,
        });
        return newArray;
      });
    },
    []
  );

  const cols = React.useMemo(() => {
    return colsMap.map(getGridColumn);
  }, [colsMap]);

  const colsMapRef = React.useRef(colsMap);
  colsMapRef.current = colsMap;
  const getCellContent = React.useCallback(
    ([col, row]: Item): GridCell => {
      let val = cache.current.get(col, row);
      if (val === undefined) {
        val = colsMapRef.current[col].getContent();
        if (!readonly && isTextEditableGridCell(val)) {
          val = { ...val, readonly };
        }
        cache.current.set(col, row, val);
      }
      return val;
    },
    [readonly]
  );

  const setCellValueRaw = React.useCallback(
    ([col, row]: Item, val: GridCell): void => {
      cache.current.set(col, row, val);
    },
    []
  );

  const setCellValue = React.useCallback(
    ([col, row]: Item, val: GridCell): void => {
      let current = cache.current.get(col, row);
      if (current === undefined) {
        current = colsMap[col].getContent();
      }
      if (isEditableGridCell(val) && isEditableGridCell(current)) {
        const copied = lossyCopyData(val, current);
        cache.current.set(col, row, {
          ...copied,
          displayData:
            typeof copied.data === "string"
              ? copied.data
              : (copied as any).displayData,
          lastUpdated: performance.now(),
        } as any);
      }
    },
    [colsMap]
  );

  return {
    cols,
    getCellContent,
    onColumnResize,
    setCellValue,
    setCellValueRaw,
  };
}

export function clearCell(cell: GridCell): GridCell {
  switch (cell.kind) {
    case GridCellKind.Boolean: {
      return {
        ...cell,
        data: false,
      };
    }
    case GridCellKind.Image: {
      return {
        ...cell,
        data: [],
        displayData: [],
      };
    }
    case GridCellKind.Drilldown:
    case GridCellKind.Bubble: {
      return {
        ...cell,
        data: [],
      };
    }
    case GridCellKind.Uri:
    case GridCellKind.Markdown: {
      return {
        ...cell,
        data: "",
      };
    }
    case GridCellKind.Text: {
      return {
        ...cell,
        data: "",
        displayData: "",
      };
    }
    case GridCellKind.Number: {
      return {
        ...cell,
        data: 0,
        displayData: "",
      };
    }
  }
  return cell;
}
