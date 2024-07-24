import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNodeStructureStore } from "../../../flowComponents/_lib/_store/FlowNodeStructureStore";
import { NodeStructureInput } from "../../../flowComponents/_lib/_types/SevilleSchema";
import { ConditionalValueType } from "../../../flowComponents/_lib/_types/ValueTypes";

import { Box, Button } from "@mui/material";
import { IfInput } from "./IfInput";

interface SevilleIfInputGroupProps {
  nodeId: string;
  input: NodeStructureInput;
}

const updateNodeStructureInStore = (
  nodeId: string,
  inputId: number,
  newValueArray: any
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
      const newInputs = [...currentNodeStructure.inputs];
      if (!Array.isArray(newInputs[targetInputIndex].values)) {
        newInputs[targetInputIndex].values = [];
      }
      //newInputs[targetInputIndex].value.push(newValueArray);
      newInputs[targetInputIndex].values = [
        ...newInputs[targetInputIndex].values,
        newValueArray,
      ];
      const updates = { inputs: newInputs };
      useNodeStructureStore.getState().updateNodeStructure(nodeId, updates);
    }
  }
};

export const IfInputGroup: React.FC<SevilleIfInputGroupProps> = ({
  nodeId,
  input,
}) => {
  console.log(nodeId);
  console.log(input);
  const [ifGroups, setIfGroups] = useState<any[]>([]);
  const { getNodeStructure } = useNodeStructureStore();

  const addNewGroup = () => {
    const newConditionId = uuidv4();
    const newIfGroup = {
      id: newConditionId,
      valueOne: [],
      condition: "",
      valueTwo: [],
      logic: "",
    };
    setIfGroups((prevGroups) => [...prevGroups, newIfGroup]);

    updateNodeStructureInStore(nodeId, input.id, newIfGroup);
  };

  const deleteGroup = (conditionIdToDelete: string | number | undefined) => {
    setIfGroups((prevGroups: any) =>
      prevGroups.filter(
        (group: any) => group.conditionId !== conditionIdToDelete
      )
    );

    // Get the current state of the node structures
    const currentStructures = useNodeStructureStore.getState().nodeStructures;
    const currentNodeStructure = currentStructures.find(
      (ns) => ns.nodeId === nodeId
    );

    if (currentNodeStructure) {
      // Find the input that needs to be updated
      const targetInputIndex = currentNodeStructure.inputs.findIndex(
        (inp) => inp.id === input.id
      );

      if (targetInputIndex >= 0) {
        // Clone the inputs array to avoid direct mutation
        const newInputs = [...currentNodeStructure.inputs];

        // Filter out the condition to delete from the value array of the target input
        const updatedValue = newInputs[targetInputIndex].values.filter(
          (condition: any) => condition.id !== conditionIdToDelete
        );
        newInputs[targetInputIndex].values = updatedValue;

        // Construct the partial NodeStructure for the update
        const updates = { inputs: newInputs };

        // Call updateNodeStructure to update the store
        useNodeStructureStore.getState().updateNodeStructure(nodeId, updates);
      }
    }
  };

  useEffect(() => {
    const nodeStructure = getNodeStructure(nodeId);
    if (nodeStructure) {
      const matchingInput = nodeStructure.inputs.find(
        (inp) => inp.id === input.id
      );
      if (matchingInput) {
        //matching input found
        console.log("matching input found");
        console.log(matchingInput);
        if (
          Array.isArray(matchingInput.values) &&
          matchingInput.values.length > 0
        ) {
          console.log(matchingInput.values);
          setIfGroups(matchingInput.values);
        } else addNewGroup();
      }
    }
  }, []);

  return (
    <Box>
      {ifGroups.map((group: ConditionalValueType, index: any) => (
        <IfInput
          key={group.id}
          nodeId={nodeId}
          index={index}
          input={input}
          ifGroup={group}
          canDelete={index !== 0}
          onDelete={() => deleteGroup(group.id)}
        />
      ))}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
        }}
      >
        <Button onClick={addNewGroup}>Add Condition</Button>
      </Box>
    </Box>
  );
};
