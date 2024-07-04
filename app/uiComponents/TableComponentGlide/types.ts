export enum GridActionEnum {
  Edit = "edit",
  Delete = "delete",
  Create = "create",
  Filter = "filter",
  Sorting = "sorting",
  Pagination = "pagination",
  View = "view",
  RowSelect = "rowSelect",
  MoreOption = "moreOption",
  Match = "match",
  Unmatch = "unmatch",
}

export enum CustomCellKindEnum {
  StarCell = "star-cell",
  SparklineCell = "sparkline-cell",
  TagsCell = "tags-cell",
  UserProfileCell = "user-profile-cell",
  RangeCell = "range-cell",
  ArticleCell = "article-cell",
  SpinnerCell = "spinner-cell",
  DatePickerCell = "date-picker-cell",
  LinksCell = "links-cell",
  ButtonCell = "button-cell",
  TreeViewCell = "tree-view-cell",
  DropdownCell = "dropdown-cell",
  MultiSelectCell = "multi-select-cell",
  ActionCell = "action-cell",
  TestCell = "test-cell",
  ExpandCell = "expand-cell",
  SwitchCell = "switch-cell",
  BadgeCell = "badge-cell",
  ColorTextCell = "color-text-cell",
}

export enum ActionCellKindEnum {
  DeleteCell = "delete-cell",
  ViewCell = "view-cell",
  EditCell = "edit-cell",
  MoreOptionCell = "more-option-cell",
  MatchCell = "match-cell",
  UnmatchCell = "unmatch-cell",
  ButtonCell = "button-cell",
}

export type GridFunctionType = (action: GridActionEnum, data?: any) => void;

/**
 * Options available for configuring a grid column.
 */
type ColumnConfigurationOption = {
  contentAlign?: "left" | "right" | "center";
  subkind?: CustomCellKindEnum; // Describes a more specific type of the column if applicable
  group?: string; // Group to which the column belongs
  groupNameEditable?: boolean; // Whether the group name can be edited
  isDraggable?: boolean; // Indicates if the column can be dragged to reorder
  hasMenu?: boolean; // Indicates if the column has an associated menu
  width?: number; // Width of the column
  isGroupCollapsable?: boolean;
  isResizable?: boolean;
  canGrow?: boolean;
  isEdittable?: boolean;
  iconName?: string;
  options?: any[];
  cursor?: boolean;
  buttonArray?: { icon: string; onClick: () => void }[];
  canDelete?: boolean;
  isVisible?: boolean;
  buttonColor?: string;
  buttonTitle?: string;
  disableIcon?: boolean;
  description?: string;
  fontColor?: string;
};

/**
 * Represents the core attributes required for a grid column.
 */
type ColumnConfigurationCore = {
  title: string; // Display title of the column
  id: string; // Unique identifier for the column
  kind: string; // The general type or 'kind' of the column
  index: number;
};

/**
 * Full type for a grid column that combines basic options with core attributes.
 */
export type ColumnConfigurationType = ColumnConfigurationOption &
  ColumnConfigurationCore;

export type GridConfigurationType = {
  isFiltering?: boolean;
  isSorting?: boolean;
  isEdittable?: boolean;
  isDraggableColumn?: boolean;
  isRowExpandable?: boolean;
  isResizableColumn?: boolean;
  isFillHandle?: boolean;
  isRowAppended?: boolean;
  isFreezeColumn?: number | null;

  isPagination?: boolean;
  isTooltip?: boolean;
  isDraggableRow?: boolean;
  isVerticalBorder?: boolean;
  isTextWrap?: boolean;
  isRowSelectable?: boolean;
  isSearchable?: boolean;
  isFreezeRow?: number | null;
  isGroupedColumn?: boolean;
  isGroupNameEditable?: boolean;
  canPaste?: boolean;
  isColumnStretched?: boolean;
  canUndoRedo?: boolean;
  isRowHovered?: boolean;
  isCellSelectable?: boolean;
  isContextMenu?: boolean;
  showEditActionColumn?: boolean;
  showViewActionColumn?: boolean;
  showMoreActionColumn?: boolean;
  showMatchButton?: boolean;
  showUnmatchButton?: boolean;
  showDeletableButton?: boolean;
  isHeaderContextMenu?: boolean;
  isFixedGrid?: boolean;
};

export type GridJsonType = {
  gridData: any[];
  selectedRow?: { [p: string]: any }[];
  columnConfiguration: ColumnConfigurationType[];
  gridConfiguration?: GridConfigurationType;
};

/**
 * Sort Direction Type
 *
 */

export type SortedColumnType = {
  columnName: string;
  sortDirection: "1" | "-1";
};
