import { Box } from "@mui/material";
import React from "react";
import FlowToolBoxHeader from "./inputs/FlowToolBoxHeader";
import FlowToolBoxBody from "./inputs/FlowToolBoxBody";

const FlowtoolBox = () => {
  return (
    <Box
      sx={{
        boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
        p: 2,
        backgroundColor: "#ffffff",
      }}
    >
      <FlowToolBoxHeader />
      <FlowToolBoxBody />
    </Box>
  );
};

export default FlowtoolBox;
