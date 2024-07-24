import { Box } from "@mui/material";
import { memo, useEffect } from "react";
import { useNodeStructureStore } from "@/app/canvas/[slug]/flowComponents/_lib/_store/FlowNodeStructureStore";
import { useNodeConstructor } from "../../../_hooks/useNodeConstructor";
import { FlowNodeBody } from "./FlowNodeBody";
import { FlowNodeHeader } from "./FlowNodeHeader";
import { INPUT_TYPES } from "@/app/canvas/[slug]/flowComponents/_lib/_constants/inputTypes";

export interface SevilleNodeProps {
  data: any;
}

export const FlowNode = memo(({ data }: SevilleNodeProps) => {
  // console.log("data from node");
  // console.log(data);
  return <FlowNodeInner data={data} />;
});

export const FlowNodeInner = ({ data }: SevilleNodeProps) => {
  const nodeStructure = useNodeConstructor(
    data.schemaId,
    data.nodeId,
    data.position,
    data.inputData,
    data.outputData,
    data.userProvidedName,
    data.parentNode
  );

  console.log("nodeStructureee", nodeStructure);

  const { addNodeStructure, getNodeStructure, nodeStructures } =
    useNodeStructureStore((state) => ({
      addNodeStructure: state.addNodeStructure,
      getNodeStructure: state.getNodeStructure,
      nodeStructures: state.nodeStructures,
    }));

  useEffect(() => {
    if (nodeStructure) {
      const existingNodeStructure = getNodeStructure(data.nodeId);
      if (!existingNodeStructure) {
        console.log("added node struct");
        console.log(existingNodeStructure);
        console.log(nodeStructure);
        addNodeStructure(nodeStructure);

        if (nodeStructure.parentIteratorNode) {
          const parentNodeStructure = getNodeStructure(
            nodeStructure.parentIteratorNode
          );
          const forInputGroupInput = parentNodeStructure?.inputs.find(
            (input) => input.type === INPUT_TYPES.FORINPUTGROUP
          );

          if (forInputGroupInput) {
            if (!Array.isArray(forInputGroupInput.values.childNodes)) {
              forInputGroupInput.values.childNodes = [];
            }

            forInputGroupInput.values.childNodes.push(nodeStructure.nodeId);
          }
        }
      } else {
        console.log(`Node with nodeId ${data.nodeId} already exists.`);
      }
    }
  }, [nodeStructure, data.nodeId, addNodeStructure, getNodeStructure]);

  if (!nodeStructure) {
    return <div>Error: Node structure could not be constructed.</div>;
  }

  return (
    <Box
      sx={{
        width: "100%",
        boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
      }}
    >
      <FlowNodeHeader nodeId={data.nodeId} />
      <FlowNodeBody nodeId={data.nodeId} />
    </Box>
  );
};
