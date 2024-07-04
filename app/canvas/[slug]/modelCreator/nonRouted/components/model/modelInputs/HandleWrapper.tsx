import { Box } from "@mui/material";
import React from "react";
import { Handle, Position } from "reactflow";

interface HandleWrapperProps {
  attributeId: string;
  dataType: string;
  dataSourceId: string | null | undefined;
  toggleShowModel: (handleId: string) => void;
  nodeId: string;
}

export const HandleWrapper: React.FC<HandleWrapperProps> = ({
  attributeId,
  dataType,
  dataSourceId,
  toggleShowModel,
  nodeId,
}) => {
  // const updateNodeInternals = useUpdateNodeInternals();
  // const [handleId, setHandleId] = useState<string>("");

  // useEffect(() => {
  //   console.log("setting handle");
  //   console.log(`handle|nd|${nodeId}|attr|${attributeId}|dt|${dataType}`);
  //   setHandleId(`handle|nd|${nodeId}|attr|${attributeId}|dt|${dataType}`);
  // }, [nodeId, attributeId, dataType]);
  const handleId = `handle|nd|${nodeId}|attr|${attributeId}|dt|${dataType}`;
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleShowModel(handleId);
  };

  // useEffect(() => {
  //   updateNodeInternals(nodeId);
  // }, [nodeId, dataType]);

  const handleStyle = {
    backgroundColor: dataSourceId ? "#4CAF50" : "#2196F3", // Example: Green for show/hide, Blue for add
    border: dataSourceId ? "2px solid #388E3C" : "2px solid #1976D2",
    borderRadius: dataSourceId ? "10%" : "10%", // Circular vs slightly rounded for differentiation
    width: "10px",
    height: "20px",
    right: "-42px",
    zIndex: 200,
    cursor: dataSourceId ? "pointer" : "crosshair",
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
