import { ChevronRightOutlined, ExpandMoreOutlined } from "@mui/icons-material";
import { Box, Collapse, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { TreeDataType } from "./sevilleTreeTypes/TreeTypes";
import * as MuiIcons from "@mui/icons-material";
import { iconLookup } from "../../../../../../_lib/_constants/IconConstants";
import useCustomTreeStore from "./customTreeStore/CustomTreeStore";

interface TreeNodeProps {
  node: any;
  onDragStart: (event: React.DragEvent, id: string) => void;
  onDragOver: (event: React.DragEvent) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  onDragStart,
  onDragOver,
}) => {
  const { id, title, children, isOpen, dataType, type, parentName } = node;
  //console.log("node in node", node.id);

  const expandedNodes = useCustomTreeStore((state) => state.expandedNodes);
  const toggleNode = useCustomTreeStore((state) => state.toggleNode);
  const allNodeIds = useCustomTreeStore((state) => state.allNodeIds);

  const open = expandedNodes[node.id] || false;

  // console.log("expanded nodes", expandedNodes, allNodeIds);

  const handleToggle = (nodeId: string) => {
    //console.log("handling toggle of", nodeId);
    toggleNode(nodeId);
  };

  type IconLookupKey = keyof typeof iconLookup;
  const iconName = iconLookup[dataType as IconLookupKey];
  // Dynamically load the icon component
  const Icon = iconName ? (MuiIcons as any)[iconName] : null;

  const typeIconName = iconLookup[type as IconLookupKey];
  const TypeIcon = typeIconName ? (MuiIcons as any)[typeIconName] : null;

  // console.log(typeIconName);
  // console.log(TypeIcon);

  return (
    <Box component="li" sx={{ listStyleType: "none", mt: 2 }}>
      <Box
        component="div"
        draggable
        onDragStart={(event) => onDragStart(event, node)}
        onDragOver={onDragOver}
        //onDrop={(event) => onDrop(event, id)}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f8f8f8",
          // fontSize: "0.875rem",
          // padding: "4px 8px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          {children.length > 0 && (
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
          {/* {parentName}-{title} */}
          {/* {parentName !== null ? `${parentName}-${title}` : title} */}
          {/* {type && <Box> - {type}</Box>} */}
          {title}
        </Box>
        {TypeIcon && (
          <TypeIcon sx={{ ml: 1, fontSize: "1rem" }} color="primary" />
        )}

        {Icon && (
          <Icon sx={{ ml: 1, fontSize: "1rem" }} color="primary" /> // Adjusted icon placement to the right
        )}
      </Box>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children.length > 0 && (
          <Box component="ul" sx={{ listStyleType: "none", pl: 4 }}>
            {children.map((childNode: TreeDataType) => (
              <TreeNode
                key={childNode.id}
                node={childNode}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
              />
            ))}
          </Box>
        )}
      </Collapse>
    </Box>
  );
};

export default TreeNode;
