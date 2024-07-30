import React, { useState, useEffect } from "react";
import { Box, IconButton, List, TextField, Tooltip } from "@mui/material";

import { ToolBoxTreeDataType } from "./ToolboxtreeType";
import ToolBoxTreeNode from "./ToolboxTreeNode";
import { AddBox, IndeterminateCheckBox } from "@mui/icons-material";
import useToolBoxCustomTreeStore from "./CustomTreeStore";

interface TreeViewProps {
  data: ToolBoxTreeDataType[];
  fetchChildren: (nodeId: string) => Promise<void>;
}

const ToolboxTreeView: React.FC<TreeViewProps> = ({ data, fetchChildren }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { expandAll, collapseAll, clearAllExpandedNodes } =
    useToolBoxCustomTreeStore();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    clearAllExpandedNodes();
  }, []);

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
          disabled
        />
        <Box display="flex" flexDirection="row">
          <Tooltip title="Expand All" placement="top">
            <IconButton onClick={expandAll} disabled>
              <AddBox color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Collapse All" placement="top">
            <IconButton onClick={collapseAll} disabled>
              <IndeterminateCheckBox color="primary" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {data.map((node) => (
          <ToolBoxTreeNode
            key={node.id}
            node={node}
            fetchChildren={fetchChildren}
          />
        ))}
      </List>
    </>
  );
};

export default ToolboxTreeView;
