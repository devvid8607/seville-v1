import React, { useEffect, useState } from "react";
import { NodeStructureInput } from "../../flowComponents/_lib/_types/SevilleSchema";
import { Box, Button, IconButton, TextField } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { removeFromStore } from "./SevilleDropdownButtonGroup";
import {
  NodeStructure,
  useNodeStructureStore,
} from "../../flowComponents/_lib/_store/FlowNodeStructureStore";
import { SevilleNewDroppableInput } from "./newDroppable/SevilleNewDroppableInput";

interface SevilleIfInputGroupProps {
  nodeId: string;
  input: NodeStructureInput;
}

interface TextFieldObject {
  id: number;
  values: any;
}

const updateNodeStructureInStore = (
  currentNodeStructure: NodeStructure,
  nodeId: string,
  inputId: number,
  newDropdownData: any
) => {
  console.log("in update node struct");

  if (currentNodeStructure) {
    const targetInputIndex = currentNodeStructure.inputs.findIndex(
      (inp) => inp.id === inputId
    );

    if (targetInputIndex >= 0) {
      const newInputs = [...currentNodeStructure.inputs];

      // Ensuring the value is an array to push new dropdown data
      if (!Array.isArray(newInputs[targetInputIndex].values)) {
        newInputs[targetInputIndex].values = [];
      }

      newInputs[targetInputIndex].values.push(newDropdownData);

      const updates = { inputs: newInputs };
      useNodeStructureStore.getState().updateNodeStructure(nodeId, updates);
    }
  }
};

export const SevilleTexfieldButtonGroup: React.FC<SevilleIfInputGroupProps> = ({
  nodeId,
  input,
}) => {
  const [textFields, setTextFields] = useState<TextFieldObject[]>([]);

  console.log("input.values", input.values);

  useEffect(() => {
    // Initialize textFields state with the incoming data

    if (input && input.values) {
      console.log("in this use effect");
      setTextFields(
        input.values.map((field: TextFieldObject) => ({
          id: field.id,
          values: field.values,
        }))
      );
    }
  }, [input, input.values]);

  const inputProps1 = {
    id: 333,
    type: "newDroppable",
    allowedDataTypes: {
      dropType: ["complexValue", "singleValue"],
      edgeType: "modelMapper",
    },
    // allowedDataTypes: ["complexValue", "singleValue"],
    label: "Input 1",
    description: "This is a desc.",
    icon: "AddCircleOutline",
    allowHardCoding: false,
    placeholder: "Complex value droppable input",
    allowMultipleDrop: true,
    visible: false,
    values: null,
    showFlareDrawer: true,
  };

  const addTextField = () => {
    const newFieldId = uuidv4();
    const newTextField = { id: newFieldId };
    setTextFields((prevFields: any) => [...prevFields, newTextField]);
    const newFieldData = {
      id: newFieldId,
      value: [],
    };
    const currentStructures = useNodeStructureStore.getState().nodeStructures;
    const currentNodeStructure = currentStructures.find(
      (ns) => ns.nodeId === nodeId
    );

    // Update the node structure in the store with the new dropdown data
    if (currentNodeStructure)
      updateNodeStructureInStore(
        currentNodeStructure,
        nodeId,
        input.id,
        newFieldData
      );
  };

  const deleteTextField = (id: number) => {
    setTextFields((prevFields) =>
      prevFields.filter((field) => field.id !== id)
    );
    removeFromStore(nodeId, input.id, id);
  };

  return (
    <Box display="flex" flexDirection="column">
      {textFields.map((field, index) => {
        const dynamicInputProps = {
          ...inputProps1,
          values: field.values,
        };
        return (
          <Box key={field.id} display="flex" alignItems="center">
            <SevilleNewDroppableInput
              input={dynamicInputProps as NodeStructureInput}
              nodeId={nodeId}
              isFromTextFieldButtonGroup={true}
              textFieldId={field.id.toString()}
            />
            <IconButton
              onClick={() => deleteTextField(field.id)}
              aria-label="delete"
            >
              <DeleteOutline sx={{ color: "red" }} />
            </IconButton>
          </Box>
        );
      })}
      <Button sx={{ mt: 2 }} onClick={addTextField}>
        {input.label}
      </Button>
    </Box>
  );
};
