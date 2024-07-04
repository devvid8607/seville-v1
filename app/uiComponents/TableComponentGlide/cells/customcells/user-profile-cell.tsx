import * as React from "react";
import {
  type CustomCell,
  measureTextCached,
  TextCellEntry,
  type CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
} from "@glideapps/glide-data-grid";

interface UserProfileCellProps {
  readonly kind: "user-profile-cell";
  readonly image: string;
  readonly initial: string;
  readonly tint: string;
  readonly name?: string;
  onProfileChange: (name: string) => void;
}

export type UserProfileCell = CustomCell<UserProfileCellProps>;

const renderer: CustomRenderer<UserProfileCell> = {
  kind: GridCellKind.Custom,
  isMatch: (cell: CustomCell): cell is UserProfileCell =>
    (cell.data as any).kind === "user-profile-cell",
  draw: (args, cell) => {
    const { ctx, rect, theme, imageLoader, col, row } = args;
    const { image, name, initial, tint } = cell.data;

    const xPad = theme.cellHorizontalPadding;

    const radius = Math.min(12, rect.height / 2 - theme.cellVerticalPadding);

    const drawX = rect.x + xPad;

    const imageResult = imageLoader.loadOrGetImage(image, col, row);

    ctx.save();
    ctx.beginPath();
    ctx.arc(drawX + radius, rect.y + rect.height / 2, radius, 0, Math.PI * 2);
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = tint;
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.font = `600 16px ${theme.fontFamily}`;

    // Check if the initial string is empty
    if (initial === "") {
      // Draw a circle only
      ctx.beginPath();
      ctx.arc(drawX + radius, rect.y + rect.height / 2, radius, 0, 2 * Math.PI);
      ctx.stroke(); // You might want to fill or customize the circle appearance
    } else {
      // If not empty, proceed with drawing text in the circle
      const metrics = measureTextCached(initial[0], ctx);
      ctx.fillText(
        initial[0],
        drawX + radius - metrics.width / 2,
        rect.y +
          rect.height / 2 +
          getMiddleCenterBias(ctx, `600 16px ${theme.fontFamily}`)
      );

      // Optionally, draw the circle around the text
      ctx.beginPath();
      ctx.arc(drawX + radius, rect.y + rect.height / 2, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    if (imageResult !== undefined) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(drawX + radius, rect.y + rect.height / 2, radius, 0, Math.PI * 2);
      ctx.clip();

      ctx.drawImage(
        imageResult,
        drawX,
        rect.y + rect.height / 2 - radius,
        radius * 2,
        radius * 2
      );

      ctx.restore();
    }

    if (name !== undefined) {
      ctx.font = theme.baseFontFull;
      ctx.fillStyle = theme.textDark;
      ctx.fillText(
        name,
        drawX + radius * 2 + xPad,
        rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme)
      );
    }

    ctx.restore();

    return true;
  },
  provideEditor: (cell) => (p) => {
    const { isHighlighted, onChange, value } = p;

    return (
      <TextCellEntry
        highlight={isHighlighted}
        autoFocus={true}
        value={value.data.name ?? ""}
        disabled={value.readonly ?? false}
        onChange={(e) => {
          onChange({
            ...value,
            data: {
              ...value.data,
              name: e.target.value,
            },
          });
          cell.data.onProfileChange(e.target.value);
        }}
      />
    );
  },
  onPaste: (v, d) => ({
    ...d,
    name: v,
  }),
};

export default renderer;
