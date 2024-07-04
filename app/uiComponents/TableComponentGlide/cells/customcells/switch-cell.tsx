import React from "react";
import { styled, Box } from "@mui/material";
import {
  BaseGridCell,
  Theme,
  CustomRenderer,
  CustomCell,
  GridCellKind,
  ProvideEditorCallback,
  useTheme,
} from "@glideapps/glide-data-grid";

export function drawToggleSwitch(
  ctx: CanvasRenderingContext2D,
  theme: Theme,
  on: boolean,
  x: number,
  y: number,
  width: number,
  height: number,
  highlighted: boolean,
  hoverX: number = -20,
  hoverY: number = -20,
  maxSize: number = 32,
  alignment: BaseGridCell["contentAlign"] = "center"
) {
  const centerY = Math.floor(y + height / 2);
  const switchWidth = Math.min(width, maxSize);
  const switchHeight = Math.min(height, maxSize / 2);
  const posX = getSquareXPosFromAlign(
    alignment,
    x,
    width,
    theme.cellHorizontalPadding,
    switchWidth
  );
  const posY = centerY - switchHeight / 2;

  // Determine if the user is hovering over the switch
  const hovered =
    hoverX >= posX &&
    hoverX <= posX + switchWidth &&
    hoverY >= posY &&
    hoverY <= posY + switchHeight;

  // Draw the switch background
  ctx.beginPath();
  roundedRect(
    ctx,
    posX,
    posY,
    switchWidth,
    switchHeight,
    theme.roundingRadius ?? switchHeight / 2 // Ensures fully rounded ends
  );
  ctx.fillStyle = hovered
    ? "rgba(130, 161, 252, 0.1)"
    : "rgba(130, 161, 252, 0.1)";
  ctx.fill();

  // Calculate the toggle position
  const togglePosX = on ? posX + switchWidth - switchHeight : posX;

  // Draw the toggle
  ctx.beginPath();
  ctx.arc(
    togglePosX + switchHeight / 2,
    centerY,
    switchHeight / 2,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = "rgba(66, 107, 252, 1)";
  ctx.fill();

  // Optionally add a stroke around the toggle
  ctx.strokeStyle = "rgba(66, 107, 252, 1)";
  ctx.stroke();
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function getSquareXPosFromAlign(
  alignment: string,
  x: number,
  width: number,
  padding: number,
  elementWidth: number
) {
  switch (alignment) {
    case "left":
      return x + padding;
    case "right":
      return x + width - elementWidth - padding;
    case "center":
    default:
      return x + (width - elementWidth) / 2;
  }
}

interface SwitchCellProps {
  readonly kind: "switch-cell";
  readonly checked: boolean;
  readonly onclick: () => void;
}

export type SwitchCell = CustomCell<SwitchCellProps>;

const renderer: CustomRenderer<SwitchCell> = {
  kind: GridCellKind.Custom,
  isMatch: (cell: CustomCell): cell is SwitchCell =>
    (cell.data as any).kind === "switch-cell",
  needsHover: true,
  onClick: (a) => {
    const { cell } = a;
    !cell.readonly && cell.data.onclick?.();
    return undefined;
  },

  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { x, y, width, height } = rect;
    const highlighted = cell.data.checked;
    drawToggleSwitch(
      ctx,
      theme,
      cell.data.checked,
      x,
      y,
      width,
      height,
      highlighted
    );
  },

  provideEditor: undefined,
  // provideEditor: () => ({
  //   editor: Editor,
  //   disablePadding: true,
  // }),
};
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
const Editor: ReturnType<ProvideEditorCallback<SwitchCell>> = (p) => {
  const { value: cell, onFinishedEditing, initialValue } = p;
  const { checked: valueIn, onclick } = cell.data;

  const [value, setValue] = React.useState(valueIn);
  const [inputValue, setInputValue] = React.useState(initialValue ?? "");

  const theme = useTheme();
  return (
    <ReadOnlyWrap>
      <input disabled={cell.readonly} value={valueIn ? "true" : "false"} />
    </ReadOnlyWrap>
  );
};

//   // return (
//   //     <Select
//   //       className="glide-select"
//   //       inputValue={inputValue}
//   //       onInputChange={setInputValue}
//   //       menuPlacement={"auto"}
//   //       value={values.find((x) => x.value === value)}
//   //       styles={{
//   //         control: (base) => ({
//   //           ...base,
//   //           border: 0,
//   //           boxShadow: "none",
//   //         }),
//   //         option: (base, { isFocused }) => ({
//   //           ...base,
//   //           fontSize: theme.editorFontSize,
//   //           fontFamily: theme.fontFamily,
//   //           cursor: isFocused ? "pointer" : undefined,
//   //           paddingLeft: theme.cellHorizontalPadding,
//   //           paddingRight: theme.cellHorizontalPadding,
//   //           ":active": {
//   //             ...base[":active"],
//   //             color: theme.accentFg,
//   //           },
//   //           // Add some content in case the option is empty
//   //           // so that the option height can be calculated correctly
//   //           ":empty::after": {
//   //             content: '"&nbsp;"',
//   //             visibility: "hidden",
//   //           },
//   //         }),
//   //       }}
//   //       theme={(t) => {
//   //         return {
//   //           ...t,
//   //           colors: {
//   //             ...t.colors,
//   //             neutral0: theme.bgCell, // this is both the background color AND the fg color of
//   //             // the selected item because of course it is.
//   //             neutral5: theme.bgCell,
//   //             neutral10: theme.bgCell,
//   //             neutral20: theme.bgCellMedium,
//   //             neutral30: theme.bgCellMedium,
//   //             neutral40: theme.bgCellMedium,
//   //             neutral50: theme.textLight,
//   //             neutral60: theme.textMedium,
//   //             neutral70: theme.textMedium,
//   //             neutral80: theme.textDark,
//   //             neutral90: theme.textDark,
//   //             neutral100: theme.textDark,
//   //             primary: theme.accentColor,
//   //             primary75: theme.accentColor,
//   //             primary50: theme.accentColor,
//   //             primary25: theme.accentLight, // prelight color
//   //           },
//   //         };
//   //       }}
//   //       menuPortalTarget={document.getElementById("portal")}
//   //       autoFocus={true}
//   //       openMenuOnFocus={true}
//   //       components={{
//   //         DropdownIndicator: () => null,
//   //         IndicatorSeparator: () => null,
//   //         Menu: (props) => (
//   //           <PortalWrap>
//   //             <CustomMenu className={"click-outside-ignore"} {...props} />
//   //           </PortalWrap>
//   //         ),
//   //       }}
//   //       options={values}
//   //       onChange={async (e) => {
//   //         if (e === null) return;
//   //         setValue(e.value);
//   //         onDropdownChange(e.value);

//   //         await new Promise((r) => window.requestAnimationFrame(r));
//   //         onFinishedEditing({
//   //           ...cell,
//   //           data: {
//   //             ...cell.data,
//   //             value: e.value,
//   //           },
//   //         });
//   //       }}
//   //     />

//   // );
// };

export default renderer;
