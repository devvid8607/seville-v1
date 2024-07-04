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
  Rectangle,
  roundedRect,
} from "@glideapps/glide-data-grid";
import { getComplementaryColor, darkenRGBA } from "../../common";

interface CustomMenuProps extends MenuProps<any> {}

const CustomMenu: React.FC<CustomMenuProps> = (p) => {
  const { Menu } = components;
  const { children, ...rest } = p;
  return <Menu {...rest}>{children}</Menu>;
};

type BadgeCellOption = { value: string; label: string; color: string };

interface BadgeCellProps {
  readonly kind: "badge-cell";
  readonly value: string;
  readonly allowedValues: readonly BadgeCellOption[];
  onDropdownChange: (value: string) => void;
}

export type BadgeCell = CustomCell<BadgeCellProps>;

const Wrap = styled(Box)(({}) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",

  ".glide-select": {
    fontFamily: "var(--gdg-font-family)",
    fontSize: "var(--gdg-editor-font-size)",
  },
}));

const PortalWrap = styled(Box)(() => ({
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
const ReadOnlyWrap = styled(Box)(() => ({
  display: "flex",
  margin: "auto 8.5px",
  paddingBottom: "3px",
}));

const Editor: ReturnType<ProvideEditorCallback<BadgeCell>> = (p) => {
  const { value: cell, onFinishedEditing, initialValue } = p;
  const { allowedValues, value: valueIn, onDropdownChange } = cell.data;

  const [value, setValue] = React.useState(valueIn);
  const [inputValue, setInputValue] = React.useState(initialValue ?? "");

  const theme = useTheme();

  //   const values = React.useMemo(() => {
  //     return allowedValues.map((option) => {
  //       return option;
  //     });
  //   }, [allowedValues]);

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
        value={allowedValues.find((x) => x.value === value)}
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
        options={allowedValues}
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

const renderer: CustomRenderer<BadgeCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is BadgeCell => (c.data as any).kind === "badge-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { value } = cell.data;
    const foundOption = cell.data.allowedValues.find(
      (opt) => opt.value === value
    );
    const displayText = foundOption ? foundOption.label : "";
    const displayColor = foundOption ? foundOption.color : "red";

    const drawArea = {
      x: rect.x + theme.cellHorizontalPadding,
      y: rect.y + theme.cellVerticalPadding,
      width: rect.width - 2 * theme.cellHorizontalPadding,
      height: rect.height - 2 * theme.cellVerticalPadding,
    };

    const badgePadding = 8; // Padding inside the badge
    const badgeHeight = 20; // Height of the badge
    // const badgeWidth = ctx.measureText(displayText).width + badgePadding * 2; // Width of the badge based on text width
    const badgeWidth = 75;

    const badgeX = drawArea.x + (drawArea.width - badgeWidth) / 2; // Center the badge horizontally
    const badgeY = drawArea.y + (drawArea.height - badgeHeight) / 2; // Center the badge vertically

    // Draw the badge background
    ctx.fillStyle = displayColor;
    ctx.beginPath();
    roundedRect(
      ctx,
      badgeX,
      badgeY,
      badgeWidth,
      badgeHeight,
      theme.roundingRadius ?? badgeHeight / 2
    );
    ctx.fill();

    ctx.fillStyle = darkenRGBA(displayColor, 150);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      displayText,
      badgeX + badgeWidth / 2,
      badgeY + badgeHeight / 2
    );

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
    value: d.value,
  }),
};

export default renderer;
