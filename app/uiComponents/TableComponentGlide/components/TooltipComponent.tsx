import { Paper, Popper, Typography } from "@mui/material";

type TooltipObjectContentType = {
  title: string;
  description: string;
};

type TooltipComponentProps = {
  content: string | TooltipObjectContentType;
  anchorEl: HTMLElement | null;
};

const TooltipComponent = ({ content, anchorEl }: TooltipComponentProps) => {
  return (
    <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="top">
      <Paper
        style={{
          padding: "8px 12px",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          maxWidth: "200px",
          maxHeight: "100px",
          overflow: "hidden",
        }}
      >
        {typeof content === "string" ? (
          <Typography
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {content}
          </Typography>
        ) : (
          <>
            <Typography
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {content.title}
            </Typography>
            <Typography
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {content.description}
            </Typography>
          </>
        )}
      </Paper>
    </Popper>
  );
};

export default TooltipComponent;
