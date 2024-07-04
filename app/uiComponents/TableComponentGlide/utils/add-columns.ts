import { GridCellKind } from "@glideapps/glide-data-grid";
import {
  ColumnConfigurationType,
  ActionCellKindEnum,
  CustomCellKindEnum,
} from "../types";

const ActionColumns: { [key: string]: ColumnConfigurationType } = {
  "delete-cell": {
    title: "",
    id: ActionCellKindEnum.DeleteCell,
    width: 25,
    kind: GridCellKind.Custom,
    subkind: CustomCellKindEnum.ActionCell,
    index: 9,
    isDraggable: false,
    contentAlign: "center",
    hasMenu: false,
    isResizable: false,
    canGrow: false,
    iconName: "delete_outline_icon",
    isEdittable: false,
    disableIcon: true,
  },
  "more-option-cell": {
    title: "",
    id: ActionCellKindEnum.MoreOptionCell,
    width: 25,
    kind: GridCellKind.Custom,
    subkind: CustomCellKindEnum.ActionCell,
    index: 10,
    isDraggable: false,
    contentAlign: "center",
    hasMenu: false,
    isResizable: false,
    canGrow: false,
    iconName: "more_vert_icon",
    isEdittable: false,
    disableIcon: true,
  },
  "edit-cell": {
    title: "",
    id: ActionCellKindEnum.EditCell,
    width: 25,
    kind: GridCellKind.Custom,
    subkind: CustomCellKindEnum.ActionCell,
    index: 8,
    isDraggable: false,
    contentAlign: "center",
    hasMenu: false,
    isResizable: false,
    canGrow: false,
    iconName: "edit_icon",
    isEdittable: false,
    disableIcon: true,
  },
  "view-cell": {
    title: "",
    id: ActionCellKindEnum.ViewCell,
    width: 25,
    kind: GridCellKind.Custom,
    subkind: CustomCellKindEnum.ActionCell,
    index: 7,
    isDraggable: false,
    contentAlign: "center",
    hasMenu: false,
    isResizable: false,
    canGrow: false,
    iconName: "visibility_outline_icon",
    isEdittable: false,
    disableIcon: true,
  },
  "expand-cell": {
    title: "",
    id: "collapsed",
    width: 30,
    kind: GridCellKind.Custom,
    subkind: CustomCellKindEnum.ExpandCell,
    index: 0,
    isDraggable: false,
    hasMenu: false,
    isResizable: false,
    canGrow: false,
    isEdittable: false,
    disableIcon: true,
  },
  "match-cell": {
    title: "",
    id: "match-cell",
    kind: GridCellKind.Custom,
    subkind: CustomCellKindEnum.ButtonCell,
    buttonTitle: "Match",
    buttonColor: "green",
    index: 11,
    isDraggable: false,
    hasMenu: false,
    isResizable: false,
    canGrow: false,
    isEdittable: false,
    disableIcon: true,
  },
  "unmatch-cell": {
    title: "",
    id: "unmatch-cell",
    kind: GridCellKind.Custom,
    subkind: CustomCellKindEnum.ButtonCell,
    buttonTitle: "Unmatch",
    buttonColor: "red",
    index: 10,
    isDraggable: false,
    hasMenu: false,
    isResizable: false,
    canGrow: false,
    isEdittable: false,
    disableIcon: true,
  },
};

export function addActionColumn(
  matchButton: boolean,
  unmatchButton: boolean,
  viewAction: boolean,
  editAction: boolean,
  deleteAction: boolean,
  moreOptionAction: boolean,
  expandRow: boolean,
  columns: ColumnConfigurationType[]
): ColumnConfigurationType[] {
  const newColumns = [...columns];
  if (matchButton) {
    newColumns.push(ActionColumns["match-cell"]);
  }
  if (unmatchButton) {
    newColumns.push(ActionColumns["unmatch-cell"]);
  }
  if (viewAction) {
    newColumns.push(ActionColumns["view-cell"]);
  }
  if (editAction) {
    newColumns.push(ActionColumns["edit-cell"]);
  }
  if (deleteAction) {
    newColumns.push(ActionColumns["delete-cell"]);
  }
  if (moreOptionAction) {
    newColumns.push(ActionColumns["more-option-cell"]);
  }
  if (expandRow) {
    newColumns.unshift(ActionColumns["expand-cell"]);
  }
  return newColumns;
}
