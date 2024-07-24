import { Box, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import useModelBackendStore from "../../modelCreator/_lib/_store/modelStore/ModelBackEndStore";
import { canvasHeader } from "../../flowComponents/_lib/_types/SevilleSchema";
// import useFlowBackendStore from "../newValueChangesFlow/FlowStore/FlowBackEndStore";
// import { useLocation } from "react-router-dom";

type EditableContentProps = {
  onShowProperties: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  header: canvasHeader;
  onUpdateHeader: (newHeader: { canvasName: string }) => void;
};

export const EditableContent: React.FC<EditableContentProps> = ({
  onShowProperties,
  header,
  onUpdateHeader,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(header.canvasName || "Edit Me");

  const updateHeader = useModelBackendStore((state) => state.updateHeader);

  // const flowUpdateHeader = useFlowBackendStore((state) => state.updateHeader);

  // const location = useLocation();

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdateHeader({ canvasName: text });
    //console.log("pathname", location.pathname);
    // if (location.pathname === "/test/Index/ModelCreator")
    // updateHeader({ canvasName: text });
    // else flowUpdateHeader({ canvasName: text });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  useEffect(() => {
    setText(header.canvasName || "Edit Me");
  }, [header.canvasName]);

  return (
    <Box onClick={onShowProperties}>
      {isEditing ? (
        <TextField
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
          fullWidth
        />
      ) : (
        <Typography variant="h5" onDoubleClick={handleDoubleClick}>
          {text}
        </Typography>
      )}
    </Box>
  );
};
