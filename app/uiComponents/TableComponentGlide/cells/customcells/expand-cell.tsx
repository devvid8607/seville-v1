import {
  type CustomCell,
  type CustomRenderer,
  GridCellKind,
  type Theme,
} from "@glideapps/glide-data-grid";

interface ExpandCellProps {
  readonly kind: "expand-cell";
  readonly collapsed: boolean;
  readonly onClickOpener?: (isOpen: boolean) => void;
}

export type ExpandCell = CustomCell<ExpandCellProps> & { readonly: true };

function isOverIcon(posX: number, posY: number, theme: Theme, h: number) {
  return (
    posX >= theme.cellHorizontalPadding - 4 &&
    posX <= theme.cellHorizontalPadding + 18 &&
    posY >= h / 2 - 9 &&
    posY <= h / 2 + 9
  );
}

const renderer: CustomRenderer<ExpandCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is ExpandCell => (c.data as any).kind === "expand-cell",
  needsHover: true,
  needsHoverPosition: true,
  onClick: (args) => {
    const { theme, bounds, posX, posY, cell } = args;
    const { height: h } = bounds;
    const { onClickOpener } = cell.data;

    if (onClickOpener === undefined) return;

    const overIcon = isOverIcon(posX, posY, theme, h);
    if (overIcon) {
      const changeValue = cell.data.collapsed ? false : true;
      onClickOpener(changeValue);
    }
    return undefined;
  },
  //   draw: (args, cell) => {
  //     const { ctx, theme, rect, hoverX = 0, hoverY = 0 } = args;
  //     const { x, y, height: h } = rect;
  //     const { isOpen } = cell.data;

  //     const midLine = y + h / 2;

  //     const overIcon = isOverIcon(hoverX, hoverY, theme, h);

  //     ctx.beginPath();
  //     if (isOpen) {
  //       ctx.moveTo(x + theme.cellHorizontalPadding + 2.5, midLine - 5);
  //       ctx.lineTo(x + theme.cellHorizontalPadding + 7.5, midLine);
  //       ctx.lineTo(x + theme.cellHorizontalPadding + 2.5, midLine + 5);
  //     } else {
  //       ctx.moveTo(x + theme.cellHorizontalPadding, midLine - 2.5);
  //       ctx.lineTo(x + theme.cellHorizontalPadding + 5, midLine + 2.5);
  //       ctx.lineTo(x + theme.cellHorizontalPadding + 10, midLine - 2.5);
  //     }
  //     ctx.closePath();

  //     ctx.strokeStyle = overIcon ? theme.textLight : theme.textMedium;
  //     ctx.lineWidth = 2;
  //     ctx.stroke();

  //     if (overIcon) args.overrideCursor?.("pointer");

  //     ctx.fillStyle = theme.textDark;
  //     // ctx.fillText(
  //     //   cell.data.kind,
  //     //   16 + x + theme.cellHorizontalPadding + 0.5,
  //     //   y + h / 2 + bias
  //     // );

  //     return true;
  //   },
  draw: (args, cell) => {
    const { ctx, theme, rect, hoverAmount } = args;
    const padX = theme.cellHorizontalPadding;
    let drawX = rect.x + padX;
    drawX += 8;
    ctx.beginPath();
    const iconY = rect.y + rect.height / 2.25; // Adjusted for vertical centering
    const iconX = 4 + rect.x;

    ctx.font = "20px Material Icons";

    // Adjust font color and opacity based on hover amount
    if (hoverAmount > 0) {
      ctx.fillStyle = theme.textMedium; // Change to hover color
      ctx.globalAlpha = 0.6 + 0.4 * hoverAmount; // Adjust opacity
    } else {
      ctx.fillStyle = theme.textDark; // Default color
      ctx.globalAlpha = 1; // Default opacity
    }

    const icon = cell.data.collapsed
      ? "keyboard_arrow_right_icon"
      : "keyboard_arrow_down_icon";

    ctx.fillText(icon, iconX, iconY);
    drawX += 18;
    ctx.fill();
    ctx.globalAlpha = 1; // Reset global alpha

    ctx.fillStyle = theme.textDark;
    // ctx.fillText(cell.data.icon, drawX, rect.y + rect.height / 2 + 7); // Draw the row's icon

    return true;
  },
  provideEditor: undefined,
};

export default renderer;
