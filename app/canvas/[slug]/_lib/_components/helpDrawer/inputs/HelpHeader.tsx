import {
  CloseOutlined,
  HelpOutlineOutlined,
  MapOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";

import { useHelpStore } from "../store/HelpDrawerStore";

export const HelpHeader = () => {
  const { setIsHelpDrawerOpen } = useHelpStore((state) => ({
    setIsHelpDrawerOpen: state.setIsHelpDrawerOpen,
  }));
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
          <HelpOutlineOutlined />
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            m: 0,
            whiteSpace: "nowrap",
          }}
        >
          Help
        </Typography>
      </Box>
      <IconButton onClick={() => setIsHelpDrawerOpen(false)}>
        <CloseOutlined sx={{ color: "red" }} />
      </IconButton>
    </Box>
  );
};
