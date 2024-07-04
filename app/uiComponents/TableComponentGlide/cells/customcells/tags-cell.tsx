import {
  type CustomCell,
  type Rectangle,
  measureTextCached,
  type CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
} from "@glideapps/glide-data-grid";
import { roundedRect } from "../draw-fns";
import { Box, styled } from "@mui/material";

interface TagsCellProps {
  readonly kind: "tags-cell";
  readonly tags: readonly string[];
  readonly possibleTags: readonly {
    tag: string;
    color: string;
  }[];
  onTagChange: (tags: string[]) => void;
}

export type TagsCell = CustomCell<TagsCellProps>;

const tagHeight = 20;
const innerPad = 6;

const EditorWrap = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  paddingTop: "6px",
  color: theme.palette.text.primary,

  boxSizing: "border-box",

  "& *": {
    boxSizing: "border-box",
  },

  "& label": {
    display: "flex",
    cursor: "pointer",

    "& input": {
      cursor: "pointer",
      width: "auto",
    },

    "& .gdg-pill": {
      marginLeft: "8px",
      marginRight: "6px",
      marginBottom: "6px",
      borderRadius: `var(--gdg-rounding-radius, 10px)`,
      minHeight: `20px`,
      padding: `2px 4px`,
      display: "flex",
      alignItems: "center",
      fontSize: "12px",
      fontFamily: theme.typography.fontFamily,
      backgroundColor: theme.palette.background.paper,
      transition: "box-shadow 150ms",

      "&.gdg-unselected": {
        opacity: 0.8,
      },
    },
  },

  "& label:hover .gdg-pill": {
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.15)",
  },

  "&.gdg-readonly label": {
    cursor: "default",

    "& .gdg-pill": {
      boxShadow: "none !important",
    },
  },
}));

const renderer: CustomRenderer<TagsCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is TagsCell => (c.data as any).kind === "tags-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { possibleTags, tags } = cell.data;

    const drawArea: Rectangle = {
      x: rect.x + theme.cellHorizontalPadding,
      y: rect.y + theme.cellVerticalPadding,
      width: rect.width - 2 * theme.cellHorizontalPadding,
      height: rect.height - 2 * theme.cellVerticalPadding,
    };
    const rows = Math.max(
      1,
      Math.floor(drawArea.height / (tagHeight + innerPad))
    );

    let x = drawArea.x;
    let row = 1;
    let y =
      drawArea.y +
      (drawArea.height - rows * tagHeight - (rows - 1) * innerPad) / 2;
    for (const tag of tags) {
      const color =
        possibleTags.find((t) => t.tag === tag)?.color ?? theme.bgBubble;

      ctx.font = `12px ${theme.fontFamily}`;
      const metrics = measureTextCached(tag, ctx);
      const width = metrics.width + innerPad * 2;
      const textY = tagHeight / 2;

      if (
        x !== drawArea.x &&
        x + width > drawArea.x + drawArea.width &&
        row < rows
      ) {
        row++;
        y += tagHeight + innerPad;
        x = drawArea.x;
      }

      ctx.fillStyle = color;
      ctx.beginPath();
      roundedRect(
        ctx,
        x,
        y,
        width,
        tagHeight,
        theme.roundingRadius ?? tagHeight / 2
      );
      ctx.fill();

      ctx.fillStyle = theme.textDark;
      ctx.fillText(
        tag,
        x + innerPad,
        y + textY + getMiddleCenterBias(ctx, `12px ${theme.fontFamily}`)
      );

      x += width + 8;
      if (x > drawArea.x + drawArea.width && row >= rows) break;
    }

    return true;
  },
  provideEditor: () => {
    // eslint-disable-next-line react/display-name
    return (p) => {
      const { onChange, value } = p;
      const { readonly = false } = value;
      const { possibleTags, tags, onTagChange } = value.data;
      return (
        <EditorWrap>
          {possibleTags.map((t) => {
            const selected = tags.indexOf(t.tag) !== -1;
            return (
              <label key={t.tag}>
                {!readonly && (
                  <>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => {
                        const newTags = selected
                          ? tags.filter((x) => x !== t.tag)
                          : [...tags, t.tag];
                        onChange({
                          ...p.value,
                          data: {
                            ...value.data,
                            tags: newTags,
                          },
                        });
                        onTagChange(newTags);
                      }}
                    />
                  </>
                )}
                <div
                  className={
                    "gdg-pill " + (selected ? "gdg-selected" : "gdg-unselected")
                  }
                  style={{ backgroundColor: selected ? t.color : undefined }}
                >
                  {t.tag}
                </div>
              </label>
            );
          })}
        </EditorWrap>
      );
    };
  },
  onPaste: (v, d) => ({
    ...d,
    tags: d.possibleTags
      .map((x) => x.tag)
      .filter((x) =>
        v
          .split(",")
          .map((s) => s.trim())
          .includes(x)
      ),
  }),
};

export default renderer;
