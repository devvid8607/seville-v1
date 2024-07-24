import { GridCellKind } from "@glideapps/glide-data-grid";
import { GridJsonType } from "@/app/uiComponents/TableComponentGlide/types";

export const gridJsonBlankTemplate: GridJsonType = {
  gridData: [
    // {
    //   Value: "Enter here",
    // },
  ],
  selectedRow: [],

  columnConfiguration: [
    {
      title: "Value",
      id: "Value",
      kind: GridCellKind.Text,
      index: 0,
      isDraggable: false,
      contentAlign: "left",
      isResizable: false,
      canGrow: false,
      isEdittable: true,
    },
  ],
  gridConfiguration: {
    // isFiltering: false,
    // isSorting: true,
    isEdittable: true,
    //isDraggableColumn: true,
    // isRowExpandable: false,
    isResizableColumn: true,
    // isFillHandle: true,
    isRowAppended: true,
    // isFreezeColumn: null,
    // isDeletable: false,
    // isPagination: false,
    // isTooltip: true,
    // isDraggableRow: false,
    // isVerticalBorder: false,
    // isTextWrap: false,
    isRowSelectable: true,
    // isSearchable: false,
    // isFreezeRow: null,
    // isGroupedColumn: true,
    // isGroupNameEditable: false,
    // isHeaderlessGrid: false,
    // isColumnStretched: true,
    // canUndoRedo: true,
    isRowHovered: true,
    isCellSelectable: true,
    // isContextMenu: true,
  },
};
