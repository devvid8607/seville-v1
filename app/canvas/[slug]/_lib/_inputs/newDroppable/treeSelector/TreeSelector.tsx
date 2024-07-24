import { Box, Typography } from "@mui/material";
import React from "react";
import { NodeStructureInput } from "@/app/canvas/[slug]/flowComponents/_lib/_types/SevilleSchema";
import { useDroppableStore } from "@/app/canvas/[slug]/flowComponents/_lib/_store/DroppableStore";
import { TreeSelectorTree } from "./TreeSelctorTree";

type treeSelectorProps = {
  input: NodeStructureInput;
  nodeId: string;
  // onDataUpdate: (expanded: string[], selected: string[]) => void;
};

export const TreeSelector: React.FC<treeSelectorProps> = ({
  input,
  nodeId,
  // onDataUpdate,
}) => {
  const { getTreeSelectorNode } = useDroppableStore((state) => ({
    getTreeSelectorNode: state.getTreeSelectorNode,
  }));

  const treeSelectorNodes = getTreeSelectorNode(nodeId);
  if (!treeSelectorNodes) return;

  console.log("treeSelectorNodes", treeSelectorNodes);

  return (
    <Box p={2} mt={2} sx={{ boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.12)" }}>
      <Typography sx={{ marginBottom: 2 }}>Selector</Typography>
      <TreeSelectorTree
        data={treeSelectorNodes}
        input={input}
        nodeId={nodeId}
      />
    </Box>
  );
};
