import { Box, IconButton, List, TextField, Tooltip } from "@mui/material";
import React, { useState, useEffect } from "react";
import { DragDataType } from "../../../../../Constants/transferType";
import { TreeDataType } from "./sevilleTreeTypes/TreeTypes";
import TreeNode from "./TreeNode";
import { AddBox, IndeterminateCheckBox } from "@mui/icons-material";
import useCustomTreeStore from "./customTreeStore/CustomTreeStore";

const TreeView: React.FC<{ data: TreeDataType[] }> = ({ data }) => {
  // console.log("tree view rendering", data);
  // const [treeData, setTreeData] = useState(data);

  // useEffect(() => {
  //   setTreeData(data);
  // }, [data]);

  const findNodeById = (
    data: TreeDataType[],
    nodeId: string
  ): TreeDataType | null => {
    for (let node of data) {
      if (node.id === nodeId) {
        return node;
      }
      if (node.children) {
        const found = findNodeById(node.children, nodeId);
        if (found) return found;
      }
    }
    return null; // Node not found
  };

  const isDescendantOf = (node: TreeDataType, targetId: string) => {
    if (node.id === targetId) {
      return true; // The target node is the dragged node itself
    }
    if (node.children) {
      for (let child of node.children) {
        if (isDescendantOf(child, targetId)) {
          return true; // Found the target node in the descendants
        }
      }
    }
    return false; // The target node is not a descendant of the dragged node
  };

  const findAndRemoveNode = (
    data: any[],
    nodeId: string
  ): { updatedData: any[]; node: any } => {
    let nodeToRemove = null;
    const updatedData = data.filter((node) => {
      if (node.id === nodeId) {
        nodeToRemove = node;
        return false; // remove this node
      }
      if (node.children) {
        const result = findAndRemoveNode(node.children, nodeId);
        node.children = result.updatedData; // update children without the node
        if (result.node) nodeToRemove = result.node;
      }
      return true;
    });
    return { updatedData, node: nodeToRemove };
  };

  const addNodeAsChild = (
    data: any[],
    targetNodeId: string,
    nodeToAdd: any
  ): any[] => {
    return data.map((node) => {
      if (node.id === targetNodeId) {
        node.children = [...node.children, nodeToAdd];
        return node;
      }
      if (node.children) {
        node.children = addNodeAsChild(node.children, targetNodeId, nodeToAdd);
      }
      return node;
    });
  };

  const handleDragStart = (event: React.DragEvent, data: any) => {
    // alert(id);
    const serializedData = JSON.stringify(data);
    event.dataTransfer.setData("text/plain", serializedData);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // Add logic here to filter/search your tree data based on the search term
  };

  const { expandAll, collapseAll } = useCustomTreeStore();

  return (
    <>
      <Box display="flex" flexDirection="row" gap={2}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          sx={{ width: "auto" }} // Adjust width as necessary
        />
        <Box display="flex" flexDirection="row">
          <Tooltip title="Expand All" placement="top">
            <IconButton onClick={expandAll}>
              <AddBox color="primary"></AddBox>
            </IconButton>
          </Tooltip>
          <Tooltip title="Collapse All" placement="top">
            <IconButton onClick={collapseAll}>
              <IndeterminateCheckBox color="primary"></IndeterminateCheckBox>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {data.map((node) => {
          //  console.log("tree node", node.id);
          return (
            <TreeNode
              key={node.id}
              node={node}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
            />
          );
        })}
      </List>
    </>
  );
};

export default TreeView;
