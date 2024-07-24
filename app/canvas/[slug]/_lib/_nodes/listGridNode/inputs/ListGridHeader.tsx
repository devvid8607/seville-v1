import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import * as MuiIcons from "@mui/icons-material";
import { useFlowNodeStore } from "@/app/canvas/[slug]/flowComponents/_lib/_store/FlowNodeStore";

interface ListGridHeaderProps {
  nodeId: string;
}

export const ListGridHeader: React.FC<ListGridHeaderProps> = ({ nodeId }) => {
  console.log(nodeId);

  const { removeIncomingEdgesByNodeId, removeNodeAndDescendants } =
    useFlowNodeStore((state) => ({
      removeIncomingEdgesByNodeId: state.removeIncomingEdgesByNodeId,
      removeNodeAndDescendants: state.removeNodeAndDescendants,
    }));

  const handleMinimizeNode = (event: React.MouseEvent) => {
    event.stopPropagation();

    removeIncomingEdgesByNodeId(nodeId);
    removeNodeAndDescendants(nodeId);
  };
  return (
    <>
      <Box>
        <Box
          sx={{
            backgroundColor: "#F0F3FF",
            borderBottom: "1px solid #aaa",
            height: "auto",
            pt: 2,
            pb: 2,
            gap: 2,
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
              <MuiIcons.DataArrayOutlined />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                m: 0,
                whiteSpace: "nowrap",
              }}
              // onDoubleClick={handleDoubleClick}
            >
              Name
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="" sx={{ cursor: "pointer", marginRight: 1 }}>
              <MuiIcons.LockOpen />
            </Tooltip>

            <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
              <Tooltip title="Minimize Node">
                <IconButton
                  aria-label="minimize"
                  size="small"
                  onClick={handleMinimizeNode}
                  sx={{ pb: 2 }}
                >
                  <MuiIcons.MinimizeOutlined sx={{ color: "black" }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
              <span className="custom-drag-handle">
                <Tooltip title="Drag Node">
                  <MuiIcons.DragHandleOutlined />
                </Tooltip>
              </span>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
