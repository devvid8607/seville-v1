import {
  type CustomCell,
  type CustomRenderer,
  GridCellKind,
  Rectangle,
} from "@glideapps/glide-data-grid";

interface ActionCellProps {
  readonly kind: "action-cell";
  readonly icon: string;
  readonly onclick: (a?: Rectangle) => void;
  // value: boolean;
}

export type ActionCell = CustomCell<ActionCellProps>;

const renderer: CustomRenderer<ActionCell> = {
  kind: GridCellKind.Custom,
  isMatch: (cell: CustomCell): cell is ActionCell =>
    (cell.data as any).kind === "action-cell",
  needsHover: true,
  onSelect: (a) => a.preventDefault(),
  onClick: (a) => {
    const { cell, bounds } = a;
    cell.data.onclick?.(bounds);
    return undefined;
  },
  draw: (args, cell) => {
    const { ctx, theme, rect, hoverAmount } = args;
    const padX = theme.cellHorizontalPadding;
    let drawX = rect.x + padX;
    drawX += 8;
    ctx.beginPath();
    const iconY = rect.y + rect.height / 2;
    const iconX = rect.x + (rect.width / 2 - 8);
    ctx.font = "12px Material Icons";

    // Adjust font color and opacity based on hover amount
    if (hoverAmount > 0) {
      ctx.fillStyle = theme.textMedium; // Change to hover color
      ctx.globalAlpha = 0.6 + 0.4 * hoverAmount; // Adjust opacity
    } else {
      ctx.fillStyle = theme.textDark; // Default color
      ctx.globalAlpha = 1; // Default opacity
    }

    ctx.fillText(cell.data.icon, iconX, iconY);
    drawX += 18;
    ctx.fill();
    ctx.globalAlpha = 1; // Reset global alpha
    return true;
  },

  provideEditor: undefined,
};

export default renderer;
