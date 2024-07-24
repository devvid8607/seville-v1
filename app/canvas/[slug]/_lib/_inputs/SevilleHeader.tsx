import React from "react";
import {
  NodeStructureInput,
  Output,
} from "../../flowComponents/_lib/_types/SevilleSchema";
import { Box, Tooltip, Typography } from "@mui/material";
import { HelpOutline } from "@mui/icons-material";

type SevilleHeaderInputsProps = {
  input?: NodeStructureInput;
  output?: Output;
};

export const SevilleHeader: React.FC<SevilleHeaderInputsProps> = ({
  input,
  output,
}) => {
  const displayData = input ?? output;

  // Render nothing if neither input nor output is provided
  if (!displayData) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        mb: 4,
        mt: 2,
        pt: 2,
      }}
    >
      <Typography variant="body1">{displayData.label}</Typography>
      <Tooltip title={displayData.description} placement="top">
        <HelpOutline />
      </Tooltip>
    </Box>
  );
};
