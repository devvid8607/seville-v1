import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { isNewDroppableInput } from "@/app/canvas/[slug]/flowComponents/_lib/_types/SevilleSchema";
import { createFlareItem } from "../../../_inputs/newDroppable/droppableHelpers";
import { ComplexValueType } from "@/app/canvas/[slug]/flowComponents/_lib/_types/ValueTypes";
import { useNodeStructureStore } from "@/app/canvas/[slug]/flowComponents/_lib/_store/FlowNodeStructureStore";
import { INPUT_TYPES } from "@/app/canvas/[slug]/flowComponents/_lib/_constants/inputTypes";
import { useFlareDrawerStore } from "../store/FlareDrawerStore";
import { useDroppableStore } from "@/app/canvas/[slug]/flowComponents/_lib/_store/DroppableStore";

export interface FlareDrawerContentProps {
  setIsFlareDrawerOpenInDroppable: () => void;

  // nodeId: string;
  isFromIterator?: boolean;
  itemToBeUpdated?: string;
  isFromTextFieldButtonGroup?: boolean;
  textFieldId?: string;

  conditionID?: string | number | undefined;
  addFlareItem?: (item: any) => void;
}

export const FlareContent: React.FC<FlareDrawerContentProps> = ({
  setIsFlareDrawerOpenInDroppable,
  // nodeId,
  isFromIterator,
  // itemToBeUpdated,
  isFromTextFieldButtonGroup,

  conditionID,
  addFlareItem,
}) => {
  const [text, setText] = useState("");

  const {
    flareInput,
    setTestItem,
    testItem,
    ifConditionId,
    ifValueId,
    isFromIfInput,
    flareNodeId,
    textFieldId,
    iteratorItemToBeUpdated,
  } = useFlareDrawerStore((state) => ({
    flareInput: state.flareInput,
    setTestItem: state.setTestItem,
    testItem: state.testItem,
    ifConditionId: state.ifConditionId,
    ifValueId: state.ifValueId,
    isFromIfInput: state.isFromIfInput,
    flareNodeId: state.flareNodeId,
    textFieldId: state.textFieldId,
    iteratorItemToBeUpdated: state.iteratorItemToBeUpdated,
  }));

  if (!flareInput || !flareNodeId) return;

  const { updateNodeStructure, getNodeStructure } = useNodeStructureStore();

  const { setTreeSelectorNode } = useDroppableStore((state) => ({
    setTreeSelectorNode: state.setTreeSelectorNode,
  }));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };
  const handleSave = () => {
    console.log("Saving data:", text);
    const flareItem = createFlareItem(text);
    console.log("flare item", flareItem);
    // alert(isFromIfInput);
    if (isFromIfInput) {
      setIsFlareDrawerOpenInDroppable();
      //  addFlareItem(flareItem);
      updateNodeInputValue([flareItem]);
    } else {
      setIsFlareDrawerOpenInDroppable();
      if (
        flareInput &&
        isNewDroppableInput(flareInput) &&
        flareInput.allowMultipleDrop
      ) {
        console.log("flare input", flareInput);
        if (flareInput.values)
          updateNodeInputValue(flareInput.values.concat(flareItem));
        else updateNodeInputValue([flareItem]);
      } else if (
        flareInput &&
        isNewDroppableInput(flareInput) &&
        !flareInput.allowMultipleDrop
      )
        updateNodeInputValue([flareItem]);
    }
  };

  const handleClose = () => {
    console.log("Closing form");
    setIsFlareDrawerOpenInDroppable();
  };
  const nodeStructures = useNodeStructureStore((state) => state.nodeStructures);

  const updateNodeInputValue = (
    newDroppedItems: ComplexValueType[],
    newValue?: any
  ) => {
    if (!isFromIfInput) {
      const nodeStructure = nodeStructures.find(
        (ns) => ns.nodeId === flareNodeId
      );
      // const nodeStructure = getNodeStructure(nodeId);
      if (nodeStructure) {
        let updatedInputs;
        if (isFromIterator && iteratorItemToBeUpdated) {
          console.log("in iterator", iteratorItemToBeUpdated);
          const forInputGroupInput = nodeStructure.inputs.find(
            (input) => input.type === INPUT_TYPES.FORINPUTGROUP
          );
          console.log(forInputGroupInput);

          if (forInputGroupInput) {
            console.log("in iterator 2");
            // Ensure the childNodes array exists
            if (!forInputGroupInput.values) {
              forInputGroupInput.values = [];
            }
            // Update baseInputs with the value of itemToBeUpdated
            forInputGroupInput.values[0][iteratorItemToBeUpdated] =
              newValue !== undefined
                ? [{ textValue: newValue }]
                : newDroppedItems;
            console.log("forInputGroupInput", forInputGroupInput);
            // Update the inputs array
            updatedInputs = nodeStructure.inputs.map((inp) =>
              inp.id === forInputGroupInput.id ? forInputGroupInput : inp
            );
            console.log("updatedInputs", updatedInputs);
          }
        } else if (textFieldId && isFromTextFieldButtonGroup) {
          console.log("isFromTextFieldButtonGroup", isFromTextFieldButtonGroup);
          const textFieldInput = nodeStructure.inputs.find(
            (input) => input.type === INPUT_TYPES.TEXTFIELDBUTTONGROUP
          );

          if (textFieldInput) {
            console.log("textFieldInput", textFieldId);
            // If the input for text field group doesn't exist, create it
            if (!textFieldInput.values) {
              textFieldInput.values = [];
            }

            // Add or update the value for the specific field
            const updatedValue =
              newValue !== undefined
                ? [{ textValue: newValue }]
                : newDroppedItems;
            const valueIndex = textFieldInput.values.findIndex(
              (val: any) => val.id === textFieldId
            );
            if (valueIndex >= 0) {
              console.log("Update existing value");
              textFieldInput.values[valueIndex] = {
                ...textFieldInput.values[valueIndex],
                values: updatedValue,
              };
            } else {
              // Add new value
              console.log("Add new value");
              textFieldInput.values.push({
                id: textFieldId,
                values: updatedValue,
              });
            }

            updatedInputs = nodeStructure.inputs.map((inp) =>
              inp.id === textFieldInput.id ? textFieldInput : inp
            );
          }
        } else {
          setTreeSelectorNode(flareNodeId, null);
          updatedInputs = nodeStructure.inputs.map((inp: any) =>
            inp.id === flareInput.id
              ? {
                  ...inp,
                  values:
                    newValue !== undefined
                      ? [{ textValue: newValue }]
                      : newDroppedItems.map((item: ComplexValueType) => ({
                          id: item?.id,
                          name: item?.name,
                          icon: item?.icon,
                          error: item.error,
                          typeError: item.typeError,
                          values: null,
                          parentId: item.parentId,
                          droppedId: item.droppedId,
                          doSelfNodeCheck: item.doSelfNodeCheck,
                          doPreviousOutputCheck: item.doPreviousOutputCheck,
                          doInputModelCheck: item.doInputModelCheck,
                          dropType: item.dropType,
                          selector: item.selector,
                          childDataType: item.childDataType,
                          isFlareItem: item.isFlareItem,
                        })),
                }
              : inp
          );
        }

        if (updatedInputs) {
          updateNodeStructure(flareNodeId, { inputs: updatedInputs });
        }
      }
    } else {
      //from if node
      console.log("in else", ifConditionId, ifValueId);
      if (flareNodeId) {
        const nodeStructure = getNodeStructure(flareNodeId);
        if (nodeStructure) {
          let updatedInputs;

          const ifInputGroupInput = nodeStructure.inputs.find(
            (input) => input.type === INPUT_TYPES.IFINPUTGROUP
          );

          if (ifInputGroupInput && ifConditionId) {
            const matchingConditionObj = ifInputGroupInput.values.find(
              (cond: any) => cond.id === ifConditionId
            );
            console.log("conditionId", ifConditionId, "valueid", ifValueId);
            if (ifValueId && ifValueId === "valueOne" && matchingConditionObj) {
              console.log("conditionId", ifConditionId, "valueid", ifValueId);
              matchingConditionObj.valueOne = newDroppedItems;
            } else if (
              ifValueId &&
              ifValueId === "valueTwo" &&
              matchingConditionObj
            )
              matchingConditionObj.valueTwo = newDroppedItems;
          }

          if (updatedInputs) {
            updateNodeStructure(flareNodeId, { inputs: updatedInputs });
          }
          setTestItem(!testItem);
        }
      }
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 500,
        margin: "auto",
        mt: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography>Enter Flare Expression</Typography>
      <TextField
        label="Flare Expression"
        multiline
        rows={4}
        placeholder="Enter your text here..."
        variant="outlined"
        fullWidth
        value={text}
        onChange={handleChange}
        sx={{ mb: 2 }} // Margin bottom for spacing
      />
      <Box
        sx={{ display: "flex", justifyContent: "end", width: "100%", gap: 2 }}
      >
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outlined" color="primary" onClick={handleClose}>
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default FlareContent;
