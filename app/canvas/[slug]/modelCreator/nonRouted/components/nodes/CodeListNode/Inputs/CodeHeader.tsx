import { DragHandleOutlined, LockOpen } from "@mui/icons-material";
import { Box, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import React from "react";
import * as MuiIcons from "@mui/icons-material";
import { useCodeListStore } from "../Store/CodeListStore";

import { CodeNodeContextMenu } from "./CodeNodeContextMenu";
import { useCodeUIStore } from "../Store/CodeUIStore";
import { useModelNodesStore } from "../../../../store/modelStore/ModelNodesStore";
import { Edge } from "reactflow";

interface CodeHeaderProps {
  nodeId: string;
  modelId: string;
}

export const CodeHeader: React.FC<CodeHeaderProps> = ({ nodeId, modelId }) => {
  console.log(nodeId);

  const { codeLists } = useCodeListStore();
  let code = codeLists.find((code) => code.id === modelId);
  if (!code) return;

  const {
    showNodeContextMenu,
    nodeContextMenuPosition,
    setShowNodeContextMenu,
  } = useCodeUIStore((state) => ({
    showNodeContextMenu: state.showNodeContextMenu,
    nodeContextMenuPosition: state.nodeContextMenuPosition,
    setShowNodeContextMenu: state.setShowNodeContextMenu,
  }));

  const {
    nodes,
    edges,
    removeIncomingEdgesByNodeId,
    removeNodeAndDescendants,
  } = useModelNodesStore((state) => ({
    nodes: state.nodes,
    edges: state.edges,
    removeIncomingEdgesByNodeId: state.removeIncomingEdgesByNodeId,
    removeNodeAndDescendants: state.removeNodeAndDescendants,
  }));

  const handleClose = () => {
    setShowNodeContextMenu(false);
  };

  const handleReplaceNodeContextMenu = (event: React.MouseEvent) => {
    const offsetX = -2; // Move slightly to the left
    const offsetY = 4; // Move slightly down from the click position
    const position = {
      mouseX: event.clientX + offsetX,
      mouseY: event.clientY + offsetY,
    };

    setShowNodeContextMenu(true, position);
  };

  const isRootNode = (nodeId: string, edges: Edge[]): boolean => {
    return !edges.some((edge) => edge.target === nodeId);
  };

  const handleMinimizeNode = (event: React.MouseEvent) => {
    event.stopPropagation();
    const rootNodes = nodes.filter((node) => isRootNode(node.id, edges));

    // Check if the current node is a root node
    const isCurrentNodeRoot = isRootNode(nodeId, edges);
    if (rootNodes.length <= 1 && isCurrentNodeRoot) {
      alert(
        "Minimization not allowed: this is the only root node on the canvas."
      );
    } else {
      removeIncomingEdgesByNodeId(nodeId);
      removeNodeAndDescendants(nodeId);
    }
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
              <MuiIcons.CodeOutlined />
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
              {code.name}
            </Typography>
            {/* {isEditing ? (
              <TextField
                type="text"
                value={tempFriendlyName}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            ) : (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  m: 0,
                  whiteSpace: "nowrap",
                }}
                onDoubleClick={handleDoubleClick}
              >
                {model?.modelFriendlyName}
              </Typography>
            )} */}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="" sx={{ cursor: "pointer", marginRight: 1 }}>
              <LockOpen />
            </Tooltip>
            <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
              <Tooltip title="Replace Node">
                <IconButton
                  aria-label="replace"
                  size="small"
                  onClick={handleReplaceNodeContextMenu}
                >
                  <MuiIcons.MoreVertOutlined sx={{ color: "black" }} />{" "}
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
              <Tooltip title="Go To Code Builder">
                <IconButton
                  aria-label="copy"
                  size="small"
                  //   onClick={handleCopyClick}
                >
                  <MuiIcons.ExitToAppOutlined sx={{ color: "black" }} />{" "}
                  {/* Use the appropriate icon for copying */}
                </IconButton>
              </Tooltip>
            </Box>

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
                  <DragHandleOutlined />
                </Tooltip>
              </span>
            </Box>
          </Box>
        </Box>
        {showNodeContextMenu && (
          <CodeNodeContextMenu
            mouseX={nodeContextMenuPosition?.mouseX ?? null}
            mouseY={nodeContextMenuPosition?.mouseY ?? null}
            handleClose={handleClose}
            nodeId={nodeId}
          />
        )}
      </Box>
    </>
  );
};

export default CodeHeader;
