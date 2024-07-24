import { Box } from "@mui/material";
import React from "react";
import { Handle, Position } from "reactflow";
import { v4 as uuidv4 } from "uuid";

interface MapperInputHandleWrapperProps {
  edgeType: string;
  nodeId: string;
  modelId: string;
  toggleShowMappingModel: (modelId: string, handleId: string) => void;
}

export const MapperInputHandleWrapper: React.FC<
  MapperInputHandleWrapperProps
> = ({ edgeType, modelId, nodeId, toggleShowMappingModel }) => {
  const handleId = `handle|nd|${nodeId}|model|${modelId}`;
  console.log("handle id", handleId);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    toggleShowMappingModel(modelId, handleId);
  };
  const handleStyle = {
    backgroundColor: edgeType === "modelMapper" ? "red" : "orange", // Example: Green for show/hide, Blue for add
    border: "2px solid orange",
    borderRadius: "10%", // Circular vs slightly rounded for differentiation
    top: "205px",
    width: "10px",
    height: "20px",
    right: "-12px",
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
