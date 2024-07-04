import * as React from "react";

import { styled, Box } from "@mui/material";
import Select, { type MenuProps, components } from "react-select";

import {
  type CustomCell,
  type ProvideEditorCallback,
  type CustomRenderer,
  getMiddleCenterBias,
  useTheme,
  GridCellKind,
  TextCellEntry,
} from "@glideapps/glide-data-grid";

interface CustomMenuProps extends MenuProps<any> {}

const CustomMenu: React.FC<CustomMenuProps> = (p) => {
  const { Menu } = components;
  const { children, ...rest } = p;
  return <Menu {...rest}>{children}</Menu>;
};

type DropdownOption = string | { value: string; label: string };

interface DropdownCellProps {
  readonly kind: "dropdown-cell";
  readonly value: string;
  readonly allowedValues: readonly DropdownOption[];
  onDropdownChange: (value: string) => void;
}

export type DropdownCell = CustomCell<DropdownCellProps>;

const Wrap = styled(Box)(({}) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",

  ".glide-select": {
    fontFamily: "var(--gdg-font-family)",
    fontSize: "var(--gdg-editor-font-size)",
  },
}));

const PortalWrap = styled(Box)(({ theme }) => ({
  fontFamily: "var(--gdg-font-family)",
  fontSize: "var(--gdg-editor-font-size)",
  color: "var(--gdg-text-dark)",

  "& > div": {
    borderRadius: "4px",
    border: "1px solid var(--gdg-border-color)",
  },
}));

// This is required since the padding is disabled for this cell type
// The settings are based on the "pad" settings in the data-grid-overlay-editor-style.tsx
const ReadOnlyWrap = styled(Box)(({ theme }) => ({
  display: "flex",
  margin: "auto 8.5px",
  paddingBottom: "3px",
}));

const Editor: ReturnType<ProvideEditorCallback<DropdownCell>> = (p) => {
  const { value: cell, onFinishedEditing, initialValue } = p;
  const { allowedValues, value: valueIn, onDropdownChange } = cell.data;

  const [value, setValue] = React.useState(valueIn);
  const [inputValue, setInputValue] = React.useState(initialValue ?? "");

  const theme = useTheme();

  const values = React.useMemo(() => {
    return allowedValues.map((option) => {
      if (
        typeof option === "string" ||
        option === null ||
        option === undefined
      ) {
        return { value: option, label: option?.toString() ?? "" };
      }
      return option;
    });
  }, [allowedValues]);

  if (cell.readonly) {
    return (
      <ReadOnlyWrap>
        <TextCellEntry
          highlight={true}
          autoFocus={false}
          disabled={true}
          value={value ?? ""}
          onChange={() => undefined}
        />
      </ReadOnlyWrap>
    );
  }

  return (
    <Wrap>
      <Select
        className="glide-select"
        inputValue={inputValue}
        onInputChange={setInputValue}
        menuPlacement={"auto"}
        value={values.find((x) => x.value === value)}
        styles={{
          control: (base) => ({
            ...base,
            border: 0,
            boxShadow: "none",
          }),
          option: (base, { isFocused }) => ({
            ...base,
            fontSize: theme.editorFontSize,
            fontFamily: theme.fontFamily,
            cursor: isFocused ? "pointer" : undefined,
            paddingLeft: theme.cellHorizontalPadding,
            paddingRight: theme.cellHorizontalPadding,
            ":active": {
              ...base[":active"],
              color: theme.accentFg,
            },
            // Add some content in case the option is empty
            // so that the option height can be calculated correctly
            ":empty::after": {
              content: '"&nbsp;"',
              visibility: "hidden",
            },
          }),
        }}
        theme={(t) => {
          return {
            ...t,
            colors: {
              ...t.colors,
              neutral0: theme.bgCell, // this is both the background color AND the fg color of
              // the selected item because of course it is.
              neutral5: theme.bgCell,
              neutral10: theme.bgCell,
              neutral20: theme.bgCellMedium,
              neutral30: theme.bgCellMedium,
              neutral40: theme.bgCellMedium,
              neutral50: theme.textLight,
              neutral60: theme.textMedium,
              neutral70: theme.textMedium,
              neutral80: theme.textDark,
              neutral90: theme.textDark,
              neutral100: theme.textDark,
              primary: theme.accentColor,
              primary75: theme.accentColor,
              primary50: theme.accentColor,
              primary25: theme.accentLight, // prelight color
            },
          };
        }}
        menuPortalTarget={document.getElementById("portal")}
        autoFocus={true}
        openMenuOnFocus={true}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
          Menu: (props) => (
            <PortalWrap>
              <CustomMenu className={"click-outside-ignore"} {...props} />
            </PortalWrap>
          ),
        }}
        options={values}
        onChange={async (e) => {
          if (e === null) return;
          setValue(e.value);
          onDropdownChange(e.value);

          await new Promise((r) => window.requestAnimationFrame(r));
          onFinishedEditing({
            ...cell,
            data: {
              ...cell.data,
              value: e.value,
            },
          });
        }}
      />
    </Wrap>
  );
};

const renderer: CustomRenderer<DropdownCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is DropdownCell => (c.data as any).kind === "dropdown-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { value } = cell.data;
    const foundOption = cell.data.allowedValues.find((opt) => {
      if (typeof opt === "string" || opt === null || opt === undefined) {
        return opt === value;
      }
      return opt.value === value;
    });

    const displayText =
      typeof foundOption === "string" ? foundOption : foundOption?.label ?? "";
    if (displayText) {
      ctx.fillStyle = theme.textDark;
      ctx.fillText(
        displayText,
        rect.x + theme.cellHorizontalPadding,
        rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme)
      );
    }
    return true;
  },
  measure: (ctx, cell, theme) => {
    const { value } = cell.data;
    return (
      (value ? ctx.measureText(value).width : 0) +
      theme.cellHorizontalPadding * 2
    );
  },
  provideEditor: () => ({
    editor: Editor,
    disablePadding: true,
    deletedValue: (v) => ({
      ...v,
      copyData: "",
      data: {
        ...v.data,
        value: "",
      },
    }),
  }),
  onPaste: (v, d) => ({
    ...d,
    value: d.allowedValues.includes(v) ? v : d.value,
  }),
};

export default renderer;

// import * as React from "react";

// // import Select, { type MenuProps, components } from "react-select";
// import { Select, SelectChangeEvent, MenuItem, Box, Paper } from "@mui/material";
// import {
//   type CustomCell,
//   type ProvideEditorCallback,
//   type CustomRenderer,
//   getMiddleCenterBias,
//   GridCellKind,
//   TextCellEntry,
// } from "@glideapps/glide-data-grid";
// // import { DummyItem } from "../../test";

// type LabelType = {
//   value: string;
//   label: string;
// };

// type DropdownOption = string | LabelType;

// type DropdownOptionArray = Array<DropdownOption>;

// interface DropdownCellProps {
//   readonly kind: "dropdown-cell";
//   readonly value: string;
//   readonly options: DropdownOptionArray;
//   readonly onDropdownChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
// }

// export type DropdownCell = CustomCell<DropdownCellProps>;

// const Editor: ReturnType<ProvideEditorCallback<DropdownCell>> = (p) => {
//   const { value: cell, onChange } = p;
//   const { options, value: valueIn, onDropdownChange } = cell.data;
//   const [value, setValue] = React.useState<string>(valueIn);

//   if (cell.readonly) {
//     return (
//       <Box>
//         <TextCellEntry
//           highlight={true}
//           autoFocus={false}
//           disabled={true}
//           value={value}
//           onChange={() => undefined}
//         />
//       </Box>
//     );
//   }

//   return (
//     // <Select
//     //   value={value}
//     //   onChange={(e: SelectChangeEvent) => {
//     //     setValue(e.target.value);
//     //     console.log(e);
//     //     // onFinishedEditing({
//     //     //   ...cell,
//     //     //   data: {
//     //     //     ...cell.data,
//     //     //     value: e.target.value,
//     //     //   },
//     //     // });
//     //     onChange({
//     //       ...cell,
//     //       data: {
//     //         ...cell.data,
//     //         value: e.target.value,
//     //       },
//     //     });
//     //     onDropdownChange(e);
//     //   }}
//     //   sx={{
//     //     color: theme.palette.primary.main,
//     //   }}
//     // >
//     //   <MenuItem>Hello</MenuItem>
//     //   {options.map((option, index) => (
//     //     <MenuItem
//     //       key={index}
//     //       value={typeof option === "string" ? option : option.value}
//     //     >
//     //       {typeof option === "string" ? option : option.label}
//     //     </MenuItem>
//     //   ))}
//     // </Select>

//     <select
//       value={value}
//       onChange={(e) => {
//         setValue(e.target.value);
//         console.log(e);
//         onChange({
//           ...cell,
//           data: {
//             ...cell.data,
//             value: e.target.value,
//           },
//         });
//         onDropdownChange(e);
//       }}
//     >
//       {options.map((option, index) => (
//         <option
//           key={index}
//           value={typeof option === "string" ? option : option.value}
//         >
//           {typeof option === "string" ? option : option.label}
//         </option>
//       ))}
//     </select>
//   );
// };

// const renderer: CustomRenderer<DropdownCell> = {
//   kind: GridCellKind.Custom,
//   isMatch: (c): c is DropdownCell => (c.data as any).kind === "dropdown-cell",
//   draw: (args, cell) => {
//     const { ctx, theme, rect } = args;
//     const { value } = cell.data;
//     const foundOption = cell.data.options.find((opt) => {
//       return typeof opt === "string" ? opt === value : opt.value === value;
//     });

//     const displayText =
//       typeof foundOption === "string" ? foundOption : foundOption?.label;

//     if (displayText) {
//       ctx.fillStyle = theme.textDark;
//       ctx.fillText(
//         displayText,
//         rect.x + theme.cellHorizontalPadding,
//         rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme)
//       );
//     }
//     return true;
//   },
//   measure: (ctx, cell, theme) => {
//     const { value } = cell.data;
//     return (
//       (value ? ctx.measureText(value).width : 0) +
//       theme.cellHorizontalPadding * 2
//     );
//   },
//   provideEditor: () => ({
//     editor: Editor,
//     disablePadding: true,
//     // deletedValue: (v) => ({
//     //   ...v,
//     //   copyData: "",
//     //   data: {
//     //     ...v.data,
//     //     value: "",
//     //   },
//     // }),
//   }),
//   // onPaste: (v, d) => ({
//   //   ...d,
//   //   value: d.options.includes(v) ? v : d.value,
//   // }),
// };

// export default renderer;
