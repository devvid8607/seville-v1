import { Box } from "@mui/material";
import { ContextDataNodeHeader } from "./Inputs/ContextDataNodeHeader";
import { ContextDataNodeBody } from "./Inputs/ContextDataNodeBody";

export const ContextDataNode = () => {
  return (
    <Box
      sx={{
        boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
        p: 2,
        backgroundColor: "#ffffff",
      }}
    >
      <ContextDataNodeHeader />
      <ContextDataNodeBody />
    </Box>
  );
};
