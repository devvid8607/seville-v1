import {
  type CustomCell,
  type CustomRenderer,
  GridCellKind,
} from "@glideapps/glide-data-grid";

type ActionObject = {
  icon: string;
  onClick: () => void;
};

interface TestCellProps {
  readonly kind: "test-cell";
  buttonArray: ActionObject[];
}

export type TestCell = CustomCell<TestCellProps>;

const renderer: CustomRenderer<TestCell> = {
  kind: GridCellKind.Custom,
  isMatch: (cell: CustomCell): cell is TestCell =>
    (cell.data as any).kind === "test-cell",
  needsHover: true,

  onClick: (a) => {
    const { cell, posX, posY, bounds } = a;
    const iconWidth = 24; // Assuming each icon takes up 24 pixels horizontally
    const iconHeight = 24; // Assuming the clickable area height for each icon

    if (posY < 6 || posY > 6 + 24) return undefined;
    if (posX < 4 || posX > 4 + cell.data.buttonArray.length * 24) {
      return undefined;
    }
    cell.data.buttonArray[Math.floor((posX - 4) / 24)].onClick();
    return undefined;
  },
  onSelect: (a) => a.preventDefault(),
  draw: (args, cell) => {
    const { ctx, theme, rect, hoverAmount, hoverX } = args;
    const iconWidth = 20;
    const iconHeight = 20;
    const gap = 8; // Gap between icons

    // console.log(hoverAmount, hoverX);
    cell.data.buttonArray.forEach((action, index) => {
      const iconY = rect.y + rect.height / 2;
      const iconX = 8 + rect.x + index * (iconWidth + gap); // Calculate iconX with gap

      // console.log({ iconX });
      // Draw icon
      ctx.font = `${iconHeight}px Material Icons`;
      ctx.fillStyle = theme.textDark;
      ctx.fillText(action.icon, iconX, iconY);
    });

    return true;
  },

  provideEditor: undefined,
};

export default renderer;
