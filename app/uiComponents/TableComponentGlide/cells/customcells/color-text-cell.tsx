import {
  type CustomCell,
  type CustomRenderer,
  GridCellKind,
  type Rectangle,
  type Theme,
} from "@glideapps/glide-data-grid";

interface ColorTextCellProps {
  readonly kind: "color-text-cell";
  readonly value: string | number;
  readonly color: string;
  onCellChange: (value: string | number) => void;
}

export type ColorTextCell = CustomCell<ColorTextCellProps> & { readonly: true };

const renderer: CustomRenderer<ColorTextCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is ColorTextCell =>
    (c.data as any).kind === "color-text-cell",
  needsHoverPosition: false,
  needsHover: false,
  onSelect: (a) => a.preventDefault(),
  onClick: () => {
    return undefined;
  },
  drawPrep: (args) => {
    const { ctx } = args;
    ctx.textAlign = "start";

    return {
      deprep: (a) => {
        a.ctx.textAlign = "start";
      },
    };
  },
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { contentAlign } = cell;
    const { value, color } = cell.data;

    const x = Math.floor(rect.x + theme.cellHorizontalPadding + 1);
    const y = Math.floor(rect.y + theme.cellVerticalPadding + 1);
    const width = Math.ceil(rect.width - theme.cellHorizontalPadding * 2 - 1);
    const height = Math.ceil(rect.height - theme.cellVerticalPadding * 2 - 1);

    if (width <= 0 || height <= 0) return true;

    const stringValue = typeof value === "number" ? value.toString() : value;
    // Set text alignment based on contentAlign
    switch (contentAlign) {
      case "center":
        ctx.textAlign = "center";
        break;
      case "right":
        ctx.textAlign = "right";
        break;
      default:
        ctx.textAlign = "left";
        break;
    }

    ctx.textBaseline = "middle";

    // Calculate the x position based on text alignment
    let textX;
    if (contentAlign === "center") {
      textX = x + width / 2;
    } else if (contentAlign === "right") {
      textX = x + width;
    } else {
      textX = x;
    }
    ctx.fillStyle = color || "black";
    ctx.fillText(stringValue, textX, y + height / 2);
    return true;
  },
  provideEditor: (cell) => ({
    disablePadding: true,
    editor: (p) => {
      const { value: cell } = p;
      const { value, onCellChange } = cell.data;
      return (
        <textarea
          style={{ padding: "3px 8.5px" }}
          disabled={cell.readonly === true}
          value={value}
          onChange={(e) => onCellChange(e.target.value)}
        />
      );
    },
  }),
};

export default renderer;
