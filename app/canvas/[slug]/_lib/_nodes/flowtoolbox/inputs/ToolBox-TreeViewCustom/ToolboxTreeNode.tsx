import React from "react";
import { Box, IconButton, Collapse, CircularProgress } from "@mui/material";
import { ChevronRightOutlined, ExpandMoreOutlined } from "@mui/icons-material";
import useToolBoxCustomTreeStore from "./CustomTreeStore";
import { ToolBoxTreeDataType } from "./ToolboxtreeType";

interface TreeNodeProps {
  node: ToolBoxTreeDataType;
  fetchChildren: (nodeId: string) => Promise<void>;
}

const ToolBoxTreeNode: React.FC<TreeNodeProps> = ({ node, fetchChildren }) => {
  const { id, title, children, haschildren } = node;
  const expandedNodes = useToolBoxCustomTreeStore(
    (state) => state.expandedNodes
  );
  const setNodeLoading = useToolBoxCustomTreeStore(
    (state) => state.setNodeLoading
  );
  const toggleNode = useToolBoxCustomTreeStore((state) => state.toggleNode);
  const loading = useToolBoxCustomTreeStore(
    (state) => state.loadingNodes[id] || false
  );

  const open = expandedNodes[node.id] || false;

  const handleToggle = async (nodeId: string) => {
    if (!open && haschildren && children.length === 0) {
      setNodeLoading(nodeId, true);
      //inducing delay to show loading
      await new Promise((resolve) => setTimeout(resolve, 4000));
      await fetchChildren(nodeId);
      setNodeLoading(nodeId, false);
    }
    toggleNode(nodeId);
  };

  return (
    <Box component="li" sx={{ listStyleType: "none", mt: 2 }}>
      <Box
        component="div"
        draggable
        onDragStart={(event) =>
          event.dataTransfer.setData("text/plain", JSON.stringify(node))
        }
        onDragOver={(event) => event.preventDefault()}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f8f8f8",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          {haschildren && (
            <IconButton
              size="small"
              onClick={() => handleToggle(node.id)}
              sx={{ mr: 1 }}
            >
              {open ? (
                <ExpandMoreOutlined color="primary" />
              ) : (
                <ChevronRightOutlined color="primary" />
              )}
            </IconButton>
          )}
          {title}
        </Box>
        {loading && <CircularProgress size={20} />}
      </Box>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children.length > 0 && (
          <Box component="ul" sx={{ listStyleType: "none", pl: 4 }}>
            {children.map((childNode: ToolBoxTreeDataType) => (
              <ToolBoxTreeNode
                key={childNode.id}
                node={childNode}
                fetchChildren={fetchChildren}
              />
            ))}
          </Box>
        )}
      </Collapse>
    </Box>
  );
};

export default ToolBoxTreeNode;
