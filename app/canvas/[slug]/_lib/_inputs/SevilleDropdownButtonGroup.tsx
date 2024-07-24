import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Select, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { NodeStructureInput } from "../../flowComponents/_lib/_types/SevilleSchema";
import { DeleteOutline } from "@mui/icons-material";
import { SevilleDropdownInput } from "./SevilleDropdownInput";
import { v4 as uuidv4 } from "uuid";
import {
  NodeStructure,
  useNodeStructureStore,
} from "../../flowComponents/_lib/_store/FlowNodeStructureStore";

interface SevilleIfInputGroupProps {
  nodeId: string;
  input: NodeStructureInput;
}

interface DropdownObject {
  id: number;
  values: any;
}

export const updateNodeStructureInStore = (
  currentNodeStructure: NodeStructure,
  nodeId: string,
  inputId: number,
  newDropdownData: any
) => {
  console.log("in update node struct drop");

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
      console.log("updates", updates);
      useNodeStructureStore.getState().updateNodeStructure(nodeId, updates);
    }
  }
};

export const removeFromStore = (
  nodeId: string,
  inputId: number,
  dropdownId: number
) => {
  const currentStructures = useNodeStructureStore.getState().nodeStructures;
  const currentNodeStructure = currentStructures.find(
    (ns) => ns.nodeId === nodeId
  );

  if (currentNodeStructure) {
    const targetInputIndex = currentNodeStructure.inputs.findIndex(
      (inp) => inp.id === inputId
    );

    if (targetInputIndex >= 0) {
      let newValues = [...currentNodeStructure.inputs[targetInputIndex].values];
      newValues = newValues.filter((value) => value.id !== dropdownId); // Remove the dropdown data

      const newInputs = [...currentNodeStructure.inputs];
      newInputs[targetInputIndex].values = newValues;

      const updates = { inputs: newInputs };
      useNodeStructureStore.getState().updateNodeStructure(nodeId, updates);
    }
  }
};

export const SevilleDropdownButtonGroup: React.FC<SevilleIfInputGroupProps> = ({
  nodeId,
  input,
}) => {
  const [dropdowns, setDropdowns] = useState<DropdownObject[]>([]);

  const inputProps1 = {
    id: 4345345,
    type: "dropdown",
    label: "Dropdown Test",
    icon: "AddCircleOutline",
    placeholder: "",
    visible: true,
    description: "Test Dropdown",
    fromAPI: false,
    apiValue: "",
    options: [],
    values: [],
    parentNodeId: "",
    config: "",
  };

  useEffect(() => {
    // Initialize textFields state with the incoming data
    if (input && input.values) {
      setDropdowns(
        input.values.map((field: DropdownObject) => ({
          id: field.id,
          values: field.values,
        }))
      );
    }
  }, [input, input.values]);

  const addDropdown = () => {
    console.log("in add drop");
    const newDropdownId = uuidv4(); // Generate a unique ID
    const newDropdown = { id: newDropdownId, values: [{ textValue: "" }] };
    setDropdowns((prevDropdowns: any) => [...prevDropdowns, newDropdown]);

    const newDropdownData = {
      id: newDropdownId,
      // Initialize with any default values or structures you need
      values: [], // Example: initial value for the dropdown
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
        newDropdownData
      );
  };

  const deleteDropdown = (id: number) => {
    setDropdowns((prevDropdowns) =>
      prevDropdowns.filter((dropdown) => dropdown.id !== id)
    );
    removeFromStore(nodeId, input.id, id);
  };

  return (
    <Box display="flex" flexDirection="column">
      {dropdowns.map((dropdown) => {
        console.log("drops", dropdown);
        const dynamicInputProps = {
          ...inputProps1,
          values: dropdown.values,
          options: input.options,
        };

        return (
          <Box key={dropdown.id} display="flex" alignItems="center">
            <SevilleDropdownInput
              input={dynamicInputProps as NodeStructureInput}
              nodeId={nodeId}
              isFromDropDownButtonGroup={true}
              dropDownId={dropdown.id.toString()}
            />
            <IconButton
              onClick={() => deleteDropdown(dropdown.id)}
              aria-label="delete"
            >
              <DeleteOutline sx={{ color: "red", mt: 2 }} />
            </IconButton>
          </Box>
        );
      })}
      <Button sx={{ mt: 2 }} onClick={addDropdown}>
        {input.label}
      </Button>
    </Box>
  );
};
