import { ArrowCircleRightOutlined } from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";

import { NodeStructureOutput } from "@/app/canvas/[slug]/flowComponents/_lib/_types/SevilleSchema";
import { DragDataType } from "@/app/canvas/[slug]/flowComponents/_lib/_constants/transferType";
import { SevilleHeader } from "../../../_inputs/SevilleHeader";
import { DropTypes } from "../../../_components/sidebarTabComponents/dataTab/customTreeView/sevilleTreeTypes/TreeTypes";

type SevilleNodeOutputsProps = {
  outputs: NodeStructureOutput[];
  userProvidedName: string;
};

export const FlowNodeOutputs: React.FC<SevilleNodeOutputsProps> = ({
  outputs,
  userProvidedName,
}) => {
  const handleDragStart = (
    event: React.DragEvent,
    output: NodeStructureOutput
  ) => {
    // const modifiedName =userProvidedName;
    console.log("dragging");

    const modifiedOutput = {
      ...output,
      name: userProvidedName,
      type: output.allowedDatatypes,
      dropDetails: {
        droppedName: `${userProvidedName}.${output.label}`,
        droppedId: output.id,
        parentId: output.parentNodeId,

        doSelfNodeCheck: true,
        doPreviousOutputCheck: true,
        doInputModelCheck: false,
        typeCheck: output.allowedDatatypes,
      },
      dropType: DropTypes.Output,
    };
    event.dataTransfer.setData(
      DragDataType.FlowDraggableOutput,
      JSON.stringify(modifiedOutput)
    );
  };

  const renderOutput = (output: NodeStructureOutput) => {
    switch (output.kind) {
      case "header":
        return (
          <Box key={output.id}>
            <SevilleHeader output={output} />
          </Box>
        );
      case "generic":
        return (
          <Tooltip key={output.id} title={output.description || ""}>
            <Box
              draggable={true}
              onDragStart={(e) => handleDragStart(e, output)}
              key={output.id}
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid gray",
                padding: 1,
                margin: 1,
                cursor: "grab",
              }}
            >
              <Box />
              <ArrowCircleRightOutlined
                sx={{ color: "red", fontSize: 15, mr: 1 }}
              />
              <Typography variant="body2">{output.label}</Typography>
            </Box>
          </Tooltip>
        );
      default:
        return null;
    }
  };

  return (
    <Box paddingBottom={1} m={5}>
      {outputs.map((output) => renderOutput(output))}
    </Box>
  );
};
