import React from "react";
import { useHelpStore } from "./Store/HelpDrawerStore";
import { Box, Drawer } from "@mui/material";
import { HelpHeader } from "./Inputs/HelpHeader";
import { HelpContent } from "./Inputs/HelpContent";

export const HelpDrawer = () => {
  const { isHelpDrawerOpen, setIsHelpDrawerOpen } = useHelpStore((state) => ({
    isHelpDrawerOpen: state.isHelpDrawerOpen,
    setIsHelpDrawerOpen: state.setIsHelpDrawerOpen,
  }));
  return (
    <Drawer
      anchor="bottom"
      open={isHelpDrawerOpen}
      onClose={() => setIsHelpDrawerOpen(false)}
      sx={{
        "& .MuiDrawer-paper": {
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          maxHeight: "90vh",
        },
      }}
    >
      <HelpHeader />

      <Box p={2}>
        <HelpContent />
      </Box>
    </Drawer>
  );
};
