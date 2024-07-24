import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { Handle, Position } from "reactflow";
import { useNodeConstructor } from "../../_hooks/useNodeConstructor";
import { useNodeStructureStore } from "../../../flowComponents/_lib/_store/FlowNodeStructureStore";

export interface SevilleNodeProps {
  data: any;
}

export const FlowValid = ({ data }: SevilleNodeProps) => {
  const nodeStructure = useNodeConstructor(
    data.schemaId,
    data.nodeId,
    data.position,
    data.inputData,
    data.outputData,
    data.userProvidedName,
    data.parentNode
  );

  const { addNodeStructure, getNodeStructure } = useNodeStructureStore(
    (state) => ({
      addNodeStructure: state.addNodeStructure,
      getNodeStructure: state.getNodeStructure,
    })
  );

  useEffect(() => {
    if (nodeStructure) {
      const existingNodeStructure = getNodeStructure(data.nodeId);
      if (!existingNodeStructure) {
        console.log("added node struct");
        console.log(existingNodeStructure);
        console.log(nodeStructure);
        addNodeStructure(nodeStructure);
      } else {
        console.log(`Node with nodeId ${data.nodeId} already exists.`);
      }
    }
  }, [nodeStructure, data.nodeId, addNodeStructure, getNodeStructure]);

  return (
    <>
      <Box
        sx={{
          width: 70,
          height: 30,
          backgroundColor: "secondary",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "2px",
          border: "0.5px solid #139F4E",
          background: "#DDFBEA",
        }}
      >
        Valid
      </Box>
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        style={{ background: "#555" }}
      />
    </>
  );
};
