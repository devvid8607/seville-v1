import React from "react";
import { GridCellKind, GridColumn } from "@glideapps/glide-data-grid";
import {
  ColumnConfigurationType,
  CustomCellKindEnum,
  GridJsonType,
  SortedColumnType,
} from "../types";

export function getFirstWord(str: string) {
  return str.split(" ")[0];
}

function getDefaultValue(kind: GridCellKind | CustomCellKindEnum): any {
  switch (kind) {
    case GridCellKind.Text:
    case GridCellKind.Uri:
    case GridCellKind.Markdown:
    case GridCellKind.RowID:
    case GridCellKind.Protected:
    case CustomCellKindEnum.UserProfileCell:
    case CustomCellKindEnum.DropdownCell:
    case CustomCellKindEnum.ArticleCell:
    case CustomCellKindEnum.DatePickerCell:
    case CustomCellKindEnum.TreeViewCell:
      return "";
    case GridCellKind.Number:
    case CustomCellKindEnum.StarCell:
    case CustomCellKindEnum.RangeCell:
      return 0;
    case GridCellKind.Boolean:
      return false;
    case GridCellKind.Image:
    case GridCellKind.Drilldown:
    case GridCellKind.Bubble:
    case CustomCellKindEnum.LinksCell:
      return [];
    case CustomCellKindEnum.ExpandCell:
      return true;
    case CustomCellKindEnum.SparklineCell:
      return [] as number[];
    case CustomCellKindEnum.TagsCell:
    case CustomCellKindEnum.MultiSelectCell:
      return [] as string[];
    case CustomCellKindEnum.SpinnerCell:
    case CustomCellKindEnum.ButtonCell:
    case CustomCellKindEnum.ActionCell:
      return null;

    default:
      return null; // Handle unexpected kinds
  }
}

export function createDefaultObject(
  array: any[],
  column?: ColumnConfigurationType[]
): { [key: string]: any } {
  const defaultValues: { [key: string]: any } = {
    string: "",
    number: 0,
    bigint: 0n,
    boolean: false,
    symbol: Symbol(),
    undefined: undefined,
    object: {},
    function: () => {},
  };

  if (array.length === 0 && column) {
    const gridCellKindArray = column.map((item) => ({
      id: item.id,
      kind: item.kind as GridCellKind,
      subkind: item.subkind as CustomCellKindEnum,
    }));

    const defaultValues = gridCellKindArray.reduce<Record<string, any>>(
      (acc, item) => {
        const d = item.subkind
          ? getDefaultValue(item.subkind)
          : getDefaultValue(item.kind);
        acc[item.id] = d;
        return acc;
      },
      {}
    );

    return defaultValues;
  }

  const firstObject = array[0];

  let newObj: { [key: string]: any } = {};

  for (let key in firstObject) {
    const type = typeof firstObject[key];

    if (type === "undefined" || type === "symbol" || type === "function") {
      continue;
    }
    if (type === "object") {
      Array.isArray(firstObject[key]) ? (newObj[key] = []) : (newObj[key] = {});
      continue;
    }

    newObj[key] = defaultValues[type];
  }
  return newObj;
}

export const updateColumnConfig = (data: GridJsonType): GridJsonType => {
  const columnConfiguration = data.columnConfiguration.map((item) => ({
    ...item,
    isVisible: item.isVisible !== undefined ? item.isVisible : true,
    isEdittable: item.isEdittable !== undefined ? item.isEdittable : true,
    isResizable: item.isResizable !== undefined ? item.isResizable : true,
  }));

  return {
    gridData: data.gridData,
    columnConfiguration,
    gridConfiguration: data?.gridConfiguration,
    selectedRow: data.selectedRow,
  };
};

export const makeDefaultColumnConfig = (
  data: ColumnConfigurationType[]
): ColumnConfigurationType[] => {
  return data.map((item) => ({
    ...item,
    isVisible: item.isVisible !== undefined ? item.isVisible : true,
    isEdittable: item.isEdittable !== undefined ? item.isEdittable : true,
    isResizable: item.isResizable !== undefined ? item.isResizable : true,
  }));
};

export const MakeDefaultAndVisiblecColumnConfig = (
  data: ColumnConfigurationType[]
): ColumnConfigurationType[] => {
  return data
    .map((item) => ({
      ...item,
      isVisible: item.isVisible !== undefined ? item.isVisible : true,
      isEdittable: item.isEdittable !== undefined ? item.isEdittable : true,
      isResizable: item.isResizable !== undefined ? item.isResizable : true,
    }))
    .filter((item) => item.isVisible);
};

export const visibleDefaultColumnConfig = (
  data: ColumnConfigurationType[]
): ColumnConfigurationType[] => {
  return makeDefaultColumnConfig(data).filter((item) => item.isVisible);
};

function calculateColumnWidth(
  stringLength: number,
  fontSize: number,
  headerIconSize: number,
  padding = 24
) {
  // Calculate text width
  let textWidth = stringLength * fontSize * 0.6;
  // Calculate total column width
  let columnWidth = textWidth + headerIconSize + padding;
  return columnWidth;
}

export const makeDefaultColumn = (
  columnConfig: ColumnConfigurationType[],
  isGroupedColumn: boolean,
  isColumnStretched: boolean,
  isSorting: boolean,
  sortedIndex: SortedColumnType
): GridColumn[] => {
  return columnConfig
    .filter((item) => item.isVisible)
    .map((item, i) => {
      const { title, id, group, width, hasMenu, canGrow, disableIcon } = item;

      const calculatedWidth =
        width || calculateColumnWidth(title.length, 13, 16);
      return {
        title,
        id,
        width: calculatedWidth,
        // ...(group && {
        //   width: 100,
        //   group: isGroupedColumn ? group : undefined,
        // }),
        // ...(width && {
        //   width: width,
        // }),
        // ...(hasMenu && {
        //   hasMenu:
        //     hasMenu !== undefined ? (isSorting ? hasMenu : false) : false,
        // }),
        grow:
          canGrow === false || !isColumnStretched
            ? undefined
            : (columnConfig.length + i) / columnConfig.length,
        icon:
          isSorting && sortedIndex.columnName === id
            ? sortedIndex.sortDirection === "1"
              ? "sortDown"
              : "sortUp"
            : undefined,
      };
    });
};

function rgbaToRgb(rgba: string): [number, number, number] {
  // Extract the RGBA components by matching numeric values
  const [r, g, b, a] = rgba.match(/\d+/g)?.map(Number) ?? [0, 0, 0, 1];
  // If you want to blend this with a background of a different color when alpha is not 1, additional calculations would be needed
  return [r, g, b];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0; // Initialize 'h' to zero or a suitable default value.
  let s: number,
    l = (max + min) / 2;

  if (max === min) {
    s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100]; // Convert fraction to degrees, percentages
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    (r = c), (g = x), (b = 0);
  } else if (h >= 60 && h < 120) {
    (r = x), (g = c), (b = 0);
  } else if (h >= 120 && h < 180) {
    (r = 0), (g = c), (b = x);
  } else if (h >= 180 && h < 240) {
    (r = 0), (g = x), (b = c);
  } else if (h >= 240 && h < 300) {
    (r = x), (g = 0), (b = c);
  } else if (h >= 300 && h < 360) {
    (r = c), (g = 0), (b = x);
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  return [r, g, b];
}

export function getComplementaryColor(rgba: string): string {
  const [r, g, b] = rgbaToRgb(rgba);
  const [h, s, l] = rgbToHsl(r, g, b);
  const complementaryHue = (h + 180) % 360;
  const [newR, newG, newB] = hslToRgb(complementaryHue, s, l);
  return `rgb(${newR}, ${newG}, ${newB})`;
}

function convertNamedColorToRgba(color: string) {
  const namedColors: { [key: string]: string } = {
    red: "rgba(222, 49, 86, 1)",
    green: "rgba(29, 224, 81, 1)",
    blue: "rgba(0, 0, 255, 1)",
    black: "rgba(0, 0, 0, 1)",
    white: "rgba(255, 255, 255, 1)",
    yellow: "rgba(255, 246, 84, 1)",
    // Add more named colors as needed
  };
  return namedColors[color.toLowerCase()] || color;
}

export function darkenRGBA(rgba: string, amount: number): string {
  // Convert named color to RGBA if necessary
  rgba = convertNamedColorToRgba(rgba);

  // Adjust regex to handle optional spaces and make alpha optional
  const regex =
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?\)/;
  const match = rgba.match(regex);

  if (match) {
    // Parse the color components
    let r = parseInt(match[1]);
    let g = parseInt(match[2]);
    let b = parseInt(match[3]);
    const a = match[4] === undefined ? 1 : parseFloat(match[4]);

    // Subtract the amount and clamp the value to ensure it remains within 0-255
    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  // Return the original color if parsing failed
  return rgba;
}

export function isSelectedRowClicked(gridJson: GridJsonType) {
  return (
    gridJson.selectedRow !== undefined && gridJson.selectedRow.length !== 0
  );
}

export const isValidArray = (arr: any[]): boolean => {
  // Check if array is defined and not empty
  if (!Array.isArray(arr) || arr.length === 0) {
    return false;
  }

  // Check if each element in the array is defined
  for (const item of arr) {
    if (item === undefined || item === null) {
      return false;
    }
  }

  return true;
};
