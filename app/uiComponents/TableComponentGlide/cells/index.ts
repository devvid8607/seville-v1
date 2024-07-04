import StarCellRenderer, { type StarCell } from "./customcells/star-cell";
import SparklineCellRenderer, {
  type SparklineCell,
} from "./customcells/sparkline-cell";
import TagsCellRenderer, { type TagsCell } from "./customcells/tags-cell";
import UserProfileCellRenderer, {
  type UserProfileCell,
} from "./customcells/user-profile-cell";
import DropdownCellRenderer, {
  type DropdownCell,
} from "./customcells/dropdown-cell";
// import ArticleCellRenderer from "./customcells/article-cell.js";
// import type { ArticleCell } from "./customcells/article-cell-types.js";
import RangeCellRenderer, { type RangeCell } from "./customcells/range-cell";
import SpinnerCellRenderer, {
  type SpinnerCell,
} from "./customcells/spinner-cell";
import DatePickerRenderer, {
  type DatePickerCell,
} from "./customcells/date-picker-cell";
// import LinksCellRenderer, { type LinksCell } from "./customcells/links-cell.js";
import ButtonCellRenderer, { type ButtonCell } from "./customcells/button-cell";
import TreeViewCellRenderer, {
  type TreeViewCell,
} from "./customcells/tree-view-cell";
import MultiSelectCellRenderer, {
  type MultiSelectCell,
} from "./customcells/multi-select-cell";
import ActionCellRender, { type ActionCell } from "./customcells/action-cell";
import SwitchCellRenderer, { type SwitchCell } from "./customcells/switch-cell";
import TestCellRenderer, { type TestCell } from "./customcells/test";
import ExpandCellRenderer, { type ExpandCell } from "./customcells/expand-cell";
import BadgeCellRenderer, { type BadgeCell } from "./customcells/badge-cell";
import ColorTextCellRenderer, {
  type ColorTextCell,
} from "./customcells/color-text-cell";

const cells = [
  ActionCellRender,
  StarCellRenderer,
  SparklineCellRenderer,
  TagsCellRenderer,
  UserProfileCellRenderer,
  DropdownCellRenderer,
  //   ArticleCellRenderer,
  SpinnerCellRenderer,
  RangeCellRenderer,
  DatePickerRenderer,
  // LinksCellRenderer,
  ButtonCellRenderer,
  TreeViewCellRenderer,
  MultiSelectCellRenderer,
  SwitchCellRenderer,
  TestCellRenderer,
  ExpandCellRenderer,
  BadgeCellRenderer,
  ColorTextCellRenderer,
];

export {
  ActionCellRender as ActionCell,
  StarCellRenderer as StarCell,
  SparklineCellRenderer as SparklineCell,
  TagsCellRenderer as TagsCell,
  UserProfileCellRenderer as UserProfileCell,
  DropdownCellRenderer as DropdownCell,
  //   ArticleCellRenderer as ArticleCell,
  RangeCellRenderer as RangeCell,
  SpinnerCellRenderer as SpinnerCell,
  DatePickerRenderer as DatePickerCell,
  //   LinksCellRenderer as LinksCell,
  ButtonCellRenderer as ButtonCell,
  TreeViewCellRenderer as TreeViewCell,
  MultiSelectCellRenderer as MultiSelectCell,
  SwitchCellRenderer as SwitchCell,
  TestCellRenderer as TestCell,
  ExpandCellRenderer as ExpandCell,
  BadgeCellRenderer as BadgeCell,
  ColorTextCellRenderer as ColorTextCell,
  cells as allCells,
};

export type {
  ActionCell as ActionCellType,
  StarCell as StarCellType,
  SparklineCell as SparklineCellType,
  TagsCell as TagsCellType,
  UserProfileCell as UserProfileCellType,
  DropdownCell as DropdownCellType,
  //   ArticleCell as ArticleCellType,
  RangeCell as RangeCellType,
  SpinnerCell as SpinnerCellType,
  DatePickerCell as DatePickerType,
  //   LinksCell as LinksCellType,
  ButtonCell as ButtonCellType,
  TreeViewCell as TreeViewCellType,
  MultiSelectCell as MultiSelectCellType,
  SwitchCell as SwitchCellType,
  TestCell as TestCellType,
  ExpandCell as ExpandCellType,
  BadgeCell as BadgeCellType,
  ColorTextCell as ColorTextCellType,
};
