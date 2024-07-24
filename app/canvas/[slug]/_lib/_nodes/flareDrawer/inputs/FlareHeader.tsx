import { CloseOutlined, CodeOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";

export interface FlareDrawerHeaderProps {
  setIsFlareDrawerOpenInDroppable: () => void;
}

export const FlareHeader: React.FC<FlareDrawerHeaderProps> = ({
  setIsFlareDrawerOpenInDroppable,
}) => {
  return (
    <Box
      sx={{
        borderBottom: "1px solid #aaa",

        pt: 1,
        pb: 1,

        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
          paddingLeft: 2,
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 4,
            height: 4,
            mr: 2,
            ml: 1,
          }}
        >
          <CodeOutlined />
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            m: 0,
            whiteSpace: "nowrap",
          }}
        >
          Flare Drawer
        </Typography>
      </Box>
      <IconButton onClick={() => setIsFlareDrawerOpenInDroppable()}>
        <CloseOutlined sx={{ color: "red" }} />
      </IconButton>
    </Box>
  );
};
