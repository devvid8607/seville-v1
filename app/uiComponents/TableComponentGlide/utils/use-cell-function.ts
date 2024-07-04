import { GridCell, GridCellKind, Item } from "@glideapps/glide-data-grid";
import {
  ColumnConfigurationType,
  CustomCellKindEnum,
  ActionCellKindEnum,
  GridFunctionType,
  GridActionEnum,
} from "../types";
import { getFirstWord } from "../common";

export function getCell(
  [col, row]: Item,
  gridData: any[],
  columnConfiguration: ColumnConfigurationType[],
  isEdittable: boolean,
  onCellChange: <T>(newValue: T) => void,
  gridFunction?: GridFunctionType
): GridCell {
  const sortedKeys = columnConfiguration.map((item) => item.id);
  const dataRow = gridData[row];
  let d = dataRow[sortedKeys[col]];
  if (d === null || undefined) d = "null";
  const contentAlign = columnConfiguration[col].contentAlign ?? "left"; // Default alignment

  switch (columnConfiguration[col].kind) {
    case GridCellKind.Text:
      return {
        kind: GridCellKind.Text,
        data: d,
        displayData: d,
        readonly: !isEdittable,
        allowOverlay: true,
        contentAlign,
        allowWrapping: true,
      };
    case GridCellKind.Number:
      return {
        kind: GridCellKind.Number,
        data: d,
        displayData: `${d}`,
        readonly: !isEdittable,
        allowOverlay: true,
        contentAlign,
      };
    case GridCellKind.Boolean:
      return {
        kind: GridCellKind.Boolean,
        data: d,
        allowOverlay: false,
        readonly: !isEdittable,
        contentAlign: "center",
      };
    case GridCellKind.Uri:
      return {
        kind: GridCellKind.Uri,
        data: d,
        allowOverlay: true,
        hoverEffect: true,
        readonly: !isEdittable,
        onClickUri: () => {
          window.open(d, "_blank");
        },
        contentAlign,
      };
    case GridCellKind.RowID:
      return {
        kind: GridCellKind.RowID,
        data: d,
        allowOverlay: true,
        contentAlign,
      };
    // case GridCellKind.Protected:
    //   return {
    //     kind: GridCellKind.Protected,
    //     data: d,
    //     allowOverlay: false,
    // contentAlign
    // };
    case GridCellKind.Loading:
      return {
        kind: GridCellKind.Loading,
        allowOverlay: false,
        skeletonWidth: 70,
        skeletonWidthVariability: 25,
        contentAlign,
      };
    case GridCellKind.Image:
      return {
        kind: GridCellKind.Image,
        data: d,
        allowOverlay: true,
        readonly: true,
        contentAlign,
      };
    case GridCellKind.Markdown:
      return {
        kind: GridCellKind.Markdown,
        data: d,
        allowOverlay: true,
        readonly: !isEdittable,
        contentAlign,
      };
    case GridCellKind.Drilldown:
      return {
        kind: GridCellKind.Drilldown,
        data: d,
        allowOverlay: true,
        contentAlign,
      };
    case GridCellKind.Custom:
      switch (
        columnConfiguration[col].subkind &&
        columnConfiguration[col].subkind
      ) {
        case CustomCellKindEnum.ButtonCell:
          return {
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: d,
            readonly: true,
            contentAlign: "center",
            data: {
              kind: CustomCellKindEnum.ButtonCell,
              title: columnConfiguration[col].buttonTitle,
              color: columnConfiguration[col].buttonColor,
              onclick: () => {
                if (gridFunction !== undefined) {
                  switch (columnConfiguration[col].id) {
                    case ActionCellKindEnum.DeleteCell:
                      return gridFunction(GridActionEnum.Delete);
                    case ActionCellKindEnum.EditCell:
                      console.log(col);
                      return gridFunction(GridActionEnum.Edit, row);
                    case ActionCellKindEnum.MoreOptionCell:
                      return gridFunction(GridActionEnum.MoreOption, row);
                    case ActionCellKindEnum.ViewCell:
                      return gridFunction(GridActionEnum.View, row);
                    case ActionCellKindEnum.MatchCell:
                      return gridFunction(GridActionEnum.Match, row);
                    case ActionCellKindEnum.UnmatchCell:
                      return gridFunction(GridActionEnum.Unmatch, row);
                  }
                }
              },
            },
          };
        case CustomCellKindEnum.TreeViewCell:
          return {
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: d,
            readonly: true,
            contentAlign: "center",
            data: {
              kind: CustomCellKindEnum.TreeViewCell,
              canOpen: true,
              isOpen: !d.collapsed,
              depth: 0,
              text: "",
              onClickOpener: onCellChange<boolean>,
            },
          };

        case CustomCellKindEnum.StarCell:
          return {
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: d,
            readonly: !isEdittable,
            contentAlign,
            data: {
              kind: CustomCellKindEnum.StarCell,
              rating: typeof d === "number" ? d.toString() : d,
              onStarChange: onCellChange<number>,
            },
          };
        case CustomCellKindEnum.SparklineCell:
          return {
            kind: GridCellKind.Custom,
            allowOverlay: false,
            copyData: d.join(","),
            contentAlign,
            data: {
              kind: "sparkline-cell",
              values: d,
              displayValues: d.map((x: any) => Math.round(x).toString()),
              color: "#77c4c4",
              yAxis: [-50, 50],
            },
          };
        case CustomCellKindEnum.TagsCell:
          return {
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: d.join(","),
            readonly: !isEdittable,
            contentAlign,
            data: {
              kind: CustomCellKindEnum.TagsCell,
              possibleTags: columnConfiguration[col].options,
              tags: d,
              onTagChange: onCellChange<string[]>,
            },
          };
        case CustomCellKindEnum.UserProfileCell:
          return {
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: d,
            readonly: !isEdittable,
            contentAlign,
            data: {
              kind: CustomCellKindEnum.UserProfileCell,
              image: "https://i.redd.it/aqc1hwhalsz71.jpg",
              initial: getFirstWord(d),
              tint: "#F1D86E",
              name: d,
              onProfileChange: onCellChange<string>,
            },
          };
        case CustomCellKindEnum.DatePickerCell:
          const date = d instanceof Date ? d : new Date(d);
          const isValidDate = !isNaN(date.getTime());
          return {
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: isValidDate ? date.toISOString() : "Invalid Date",
            readonly: !isEdittable,
            contentAlign,
            data: {
              kind: CustomCellKindEnum.DatePickerCell,
              date: isValidDate ? date : new Date(),
              displayDate: isValidDate ? date.toISOString() : "Invalid Date",
              format: "date",
              onDateTimeChange: onCellChange<Date>,
            },
          };
        case CustomCellKindEnum.RangeCell:
          return {
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: `${d}`,
            readonly: !isEdittable,
            contentAlign,
            data: {
              kind: CustomCellKindEnum.RangeCell,
              min: 0,
              max: 100,
              value: d,
              step: 1,
              label: `${d}%`,
              measureLabel: "100%",
              onRangeChange: onCellChange<number>,
            },
          };
        case CustomCellKindEnum.SpinnerCell:
          return {
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: "",
            readonly: true,
            contentAlign,
            data: {
              kind: CustomCellKindEnum.SpinnerCell,
            },
          };
        case CustomCellKindEnum.DropdownCell:
          return {
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: d,
            readonly: !isEdittable,
            data: {
              kind: CustomCellKindEnum.DropdownCell,
              allowedValues: columnConfiguration[col].options,
              value: d,
              onDropdownChange: onCellChange<string>,
            },
          };
        case CustomCellKindEnum.MultiSelectCell:
          return {
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: d.join(","),
            readonly: !isEdittable,
            contentAlign,
            data: {
              kind: CustomCellKindEnum.MultiSelectCell,
              options: columnConfiguration[col].options,
              values: d,
              onMultiSelectChange: onCellChange<string[] | []>,
            },
          };
        case CustomCellKindEnum.BadgeCell:
          return {
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: d,
            readonly: !isEdittable,
            data: {
              kind: CustomCellKindEnum.BadgeCell,
              allowedValues: columnConfiguration[col].options,
              value: d,
              onDropdownChange: onCellChange<string>,
            },
          };
        case CustomCellKindEnum.SwitchCell:
          return {
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: d,
            readonly: !isEdittable,
            contentAlign,
            data: {
              kind: CustomCellKindEnum.SwitchCell,
              checked: d,
              onclick: onCellChange<boolean>,
            },
          };
        case CustomCellKindEnum.ActionCell:
          return {
            kind: GridCellKind.Custom,
            allowOverlay: false,
            copyData: "",
            readonly: true,
            cursor: "pointer",
            contentAlign,
            data: {
              kind: CustomCellKindEnum.ActionCell,
              onclick: () => {
                if (gridFunction !== undefined) {
                  switch (columnConfiguration[col].id) {
                    case ActionCellKindEnum.DeleteCell:
                      return gridFunction(GridActionEnum.Delete);
                    case ActionCellKindEnum.EditCell:
                      return gridFunction(GridActionEnum.Edit, row);
                    // case ActionCellKindEnum.MoreOptionCell:
                    //   return gridFunction(GridActionEnum.MoreOption, [
                    //     col,
                    //     row,
                    //   ]);
                    case ActionCellKindEnum.ViewCell:
                      return gridFunction(GridActionEnum.View, row);
                  }
                }
              },
              icon: columnConfiguration[col].iconName,
              // value: d,
            },
          };
        case CustomCellKindEnum.TestCell:
          return {
            kind: GridCellKind.Custom,
            allowOverlay: false,
            copyData: "",
            readonly: true,
            cursor: "pointer",
            contentAlign,
            data: {
              kind: CustomCellKindEnum.TestCell,
              buttonArray: !columnConfiguration[col].canDelete
                ? columnConfiguration[col].buttonArray?.filter(
                    (item) => item.icon !== "delete_icon"
                  )
                : columnConfiguration[col].buttonArray,
              data: d,
              //  [
              //   { icon: "delete_icon", onClick: () => alert("Deleted!") },
              //   { icon: "edit_icon", onClick: () => alert("Deleted!") },
              //   {
              //     icon: "error_outline_icon",
              //     onClick: () => alert("Deleted!"),
              //   },
              // ],
            },
          };
        case CustomCellKindEnum.ExpandCell:
          return {
            kind: GridCellKind.Custom,
            allowOverlay: false,
            copyData: "",
            readonly: true,
            cursor: "pointer",
            contentAlign: "center",
            data: {
              kind: CustomCellKindEnum.ExpandCell,
              collapsed: d,
              onClickOpener: onCellChange<boolean>,
            },
          };
        case CustomCellKindEnum.ColorTextCell:
          return {
            kind: GridCellKind.Custom,
            allowOverlay: false,
            copyData: "",
            readonly: true,
            contentAlign: contentAlign,
            data: {
              kind: CustomCellKindEnum.ColorTextCell,
              value: d,
              color: "red",
              onCellChange: onCellChange<string>,
            },
          };
        default:
          return {
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: typeof d === "string" ? parseInt(d, 10) : d,
            readonly: !isEdittable,
            data: {
              kind: "star-cell",
              rating: typeof d === "string" ? parseInt(d, 10) : d,
              onStarChange: onCellChange<number>,
            },
          };
      }
    default:
      return {
        kind: GridCellKind.Text,
        data: d,
        displayData: d,
        readonly: !isEdittable,
        allowOverlay: true,
      };
  }
}
