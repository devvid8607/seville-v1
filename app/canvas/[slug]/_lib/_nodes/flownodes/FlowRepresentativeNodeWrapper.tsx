import { memo } from "react";

import { Box, Tooltip } from "@mui/material";
import { flowNodeTypes } from "@/app/canvas/[slug]/modelCreator/_lib/_types/DataTransferType";
import { Schema } from "@/app/canvas/[slug]/modelCreator/_lib/_types/FlowSchema";
import { DragDataType } from "../../../flowComponents/_lib/_constants/transferType";

interface SevilleRepresentativeNodeWrapper {
  node: Schema;
}

export const FlowRepresentativeNodeWrapper = memo(
  ({ node }: SevilleRepresentativeNodeWrapper) => {
    const { name } = node;
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      const dataToTransfer = {
        type: node.nodeType as flowNodeTypes,
        schemaId: node.schemaId,
      };

      event.dataTransfer.setData(
        DragDataType.FlowComponent,
        JSON.stringify(dataToTransfer)
      );

      event.dataTransfer.effectAllowed = "move";
    };

    return (
      <Box
        draggable={true}
        onDragStart={handleDragStart}
        sx={{ border: "1px solid black", padding: 1, mt: 1 }}
      >
        <Tooltip title={node.description} placement="top">
          <Box>{name}</Box>
        </Tooltip>
      </Box>
    );
  }
);
