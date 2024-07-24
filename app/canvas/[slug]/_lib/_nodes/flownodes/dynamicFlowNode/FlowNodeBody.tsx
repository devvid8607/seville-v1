import { Box, Divider } from "@mui/material";
import { memo } from "react";
import { Handle, Position } from "reactflow";
import { useNodeStructureStore } from "@/app/canvas/[slug]/flowComponents/_lib/_store/FlowNodeStructureStore";
import { FlowNodeOutputs } from "./FlowNodeOutputs";
import { FlowNodeInputs } from "./FlowNodeInputs";

export const FlowNodeBody = memo(({ nodeId }: { nodeId: string }) => {
  const nodeStructure = useNodeStructureStore((state) =>
    state.getNodeStructure(nodeId)
  );
  if (!nodeStructure) return;

  console.log("nodeStructure");
  console.log(nodeStructure);

  const { inputs, outputs, userProvidedName } = nodeStructure;
  return (
    <>
      <Box
        sx={{
          backgroundColor: "white",
          marginLeft: "10px",
          marginTop: "10px",
          marginBottom: 2,
        }}
        width="90%"
      >
        <Handle
          type="target"
          position={Position.Left}
          id="a"
          style={{
            background: "transparent",
            border: "2px solid #9c9c9c",
            borderRadius: "50%",
            width: "10px",
            height: "10px",
            left: "-15px",
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="b"
          style={{
            background: "transparent",
            border: "2px solid #9c9c9c",
            borderRadius: "50%",
            width: "10px",
            height: "10px",
            right: "-15px",
            bottom: "100px",
            top: "auto",
          }}
        />
        <FlowNodeInputs inputs={inputs} nodeId={nodeId} />
      </Box>
      <Divider sx={{ paddingTop: 2 }}></Divider>
      {outputs.length > 0 && <Box py={1} />}
      <Box sx={{ backgroundColor: "white" }} width="100%">
        <FlowNodeOutputs
          outputs={outputs}
          userProvidedName={userProvidedName}
        />
      </Box>
    </>
  );
});
