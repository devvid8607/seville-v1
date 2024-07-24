import React, { ReactNode, useState } from "react";
import {
  ButtonEvents,
  NodeStructureInput,
  isButtonInput,
} from "../../flowComponents/_lib/_types/SevilleSchema";

import { Box, Button, IconButton } from "@mui/material";
import { showUI } from "../_helpers/ButtonEventFunctions";
import { useNodeStructureStore } from "../../flowComponents/_lib/_store/FlowNodeStructureStore";
import { CloseOutlined } from "@mui/icons-material";

type SevilleButtonInputsProps = {
  input: NodeStructureInput;
  nodeId: string;
};

interface UiElement {
  id: number;
  element: React.ReactNode;
}

export const SevilleButtonInput: React.FC<SevilleButtonInputsProps> = ({
  input,
  nodeId,
}) => {
  if (!isButtonInput(input)) return;

  const [uiElements, setUiElements] = useState<UiElement[]>([]);
  const [clickCount, setClickCount] = useState(0);

  const { getNodeStructure } = useNodeStructureStore();
  const nodeStructure = getNodeStructure(nodeId);

  if (!nodeStructure) {
    return <div>No node structure found for this nodeId</div>;
  }
  const { inputs } = nodeStructure;

  const handleEvent = (eventData: ButtonEvents) => {
    if (eventData.fnCall === "showUI") {
      const newUiElement = showUI(nodeId, inputs, eventData.fnArguments[0]);
      const uiElementWithId = { id: Date.now(), element: newUiElement }; // Assign a unique ID
      setUiElements((prevElements) => [...prevElements, uiElementWithId]);
      // setClickCount((prevCount) => prevCount + 1);
    }
  };

  const removeUiElement = (id: number) => {
    setUiElements((prevElements) =>
      prevElements.filter((element) => element.id !== id)
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        mt: 4,
        mb: 4,
        boxShadow: 1,
        padding: 2,
      }}
    >
      {uiElements.map((uiElement) => (
        <Box
          key={uiElement.id}
          sx={{ position: "relative" }}
          display="flex"
          flexDirection="column"
          width="100%"
        >
          <IconButton
            onClick={() => removeUiElement(uiElement.id)}
            sx={{
              position: "absolute",
              top: -20,
              right: -20,
              color: "red",
            }}
          >
            <CloseOutlined />
          </IconButton>
          {uiElement.element}
        </Box>
      ))}
      <Button
        disabled={input.disabled}
        onClick={() =>
          input.events.forEach((event) => {
            if (event.event === "click") {
              handleEvent(event);
            }
          })
        }
      >
        {input.label}
      </Button>
    </Box>
  );
};
