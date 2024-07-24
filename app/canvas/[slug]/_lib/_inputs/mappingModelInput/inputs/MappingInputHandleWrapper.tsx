import { Box } from "@mui/material";
import React from "react";
import { Handle, Position } from "reactflow";

interface MappingModelFieldProps {
  // field: FieldType;
  nodeId: string;
  modelId: string;
  toggleShowMappingModel: (modelId: string) => void;
}

export const MappingInputHandleWrapper: React.FC<MappingModelFieldProps> = ({
  // field,
  nodeId,
  modelId,
  toggleShowMappingModel,
}) => {
  const handleId = `handle|nd|${nodeId}|model|${modelId}`;
  console.log("handle id", handleId);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    toggleShowMappingModel(modelId);
  };

  const handleStyle = {
    backgroundColor: "#4CAF50",
    border: "2px solid #1976D2",
    borderRadius: "10%", // Circular vs slightly rounded for differentiation
    width: "10px",
    height: "20px",
    right: "-15px",
    zIndex: 200,
    cursor: "pointer",
  };
  return (
    <Box onClick={handleClick}>
      <Handle
        type="source"
        id={handleId}
        position={Position.Right}
        style={handleStyle}
      />
    </Box>
  );
};
