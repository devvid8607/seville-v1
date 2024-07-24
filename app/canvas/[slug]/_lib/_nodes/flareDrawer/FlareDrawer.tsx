import { Box, Drawer } from "@mui/material";
import React from "react";

import { FlareHeader } from "./inputs/FlareHeader";
import FlareContent from "./inputs/FlareContent";

export interface FlareDrawerProps {
  isFlareDrawerOpen: boolean;
  setIsFlareDrawerOpenInDroppable: () => void;

  // nodeId: string;
  isFromIterator?: boolean;
  itemToBeUpdated?: string;
  isFromTextFieldButtonGroup?: boolean;
  textFieldId?: string;
  isFromIfNode?: boolean;
  conditionID?: string | number | undefined;
  addFlareItem?: (item: any) => void;
}

export const FlareDrawer: React.FC<FlareDrawerProps> = ({
  isFlareDrawerOpen,
  setIsFlareDrawerOpenInDroppable,

  // nodeId,
  isFromIterator,
  itemToBeUpdated,
  isFromTextFieldButtonGroup,
  textFieldId,

  conditionID,
  addFlareItem,
}) => {
  return (
    <Drawer
      anchor="bottom"
      open={isFlareDrawerOpen}
      onClose={() => setIsFlareDrawerOpenInDroppable()}
      sx={{
        "& .MuiDrawer-paper": {
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          maxHeight: "90vh",
          minHeight: "70vh",
        },
      }}
    >
      <FlareHeader
        setIsFlareDrawerOpenInDroppable={setIsFlareDrawerOpenInDroppable}
      />
      <FlareContent
        setIsFlareDrawerOpenInDroppable={setIsFlareDrawerOpenInDroppable}
        // nodeId={nodeId}
        isFromIterator={isFromIterator}
        itemToBeUpdated={itemToBeUpdated}
        isFromTextFieldButtonGroup={isFromTextFieldButtonGroup}
        textFieldId={textFieldId}
        conditionID={conditionID}
        addFlareItem={addFlareItem}
      />

      <Box p={2}></Box>
    </Drawer>
  );
};

export default FlareDrawer;
