import { Box, Chip, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AllowedDataType } from "../../modelCreator/_lib/_types/DataTransferType";
import {
  isDroppableInput,
  NodeStructureInput,
} from "../../flowComponents/_lib/_types/SevilleSchema";

import { DragDataType } from "../../flowComponents/_lib/_constants/transferType";

import { AttachFileOutlined, MapOutlined } from "@mui/icons-material";
import { useNodeStructureStore } from "../../flowComponents/_lib/_store/FlowNodeStructureStore";
import { isValidUrl } from "../../flowComponents/_lib/_helpers/regexHelper";
import * as MuiIcons from "@mui/icons-material";
import { useFlowNodeStore } from "../../flowComponents/_lib/_store/FlowNodeStore";

import { INPUT_TYPES } from "../../flowComponents/_lib/_constants/inputTypes";
import { validateNode } from "../../flowComponents/_lib/_helpers/CanvasValidation";
import {
  AnyValueModelType,
  ComplexValueType,
  isComplexValueType,
  isSimpleValueType,
} from "../../flowComponents/_lib/_types/ValueTypes";

import { checkTypeCompatibility } from "../../flowComponents/_lib/_helpers/StringCompare";

type SevilleNodeInputsProps = {
  input: NodeStructureInput;
  nodeId: string;
  isFromIterator?: boolean;
  itemToBeUpdated?: string;
  isFromTextFieldButtonGroup?: boolean;
  textFieldId?: string;
};

export const checkTypeOfInputItems = (
  values: AnyValueModelType[]
): { isComplexType: boolean; isSimpleType: boolean } => {
  let isComplexType = false;
  let isSimpleType = false;

  values.forEach((value: AnyValueModelType) => {
    console.log(value);
    isComplexType = isComplexValueType(value);
    isSimpleType = isSimpleValueType(value);
  });

  return { isComplexType, isSimpleType };
};

function isAnyTypeCompatible(itemType: string, targetAllowedTypes: string[]) {
  for (const targetType of targetAllowedTypes) {
    if (checkTypeCompatibility(itemType, targetType)) {
      return true; // Return true immediately when a compatible type is found
    }
  }
  return false; // Return false if no compatible type is found
}
export const SevilleDroppableInput: React.FC<SevilleNodeInputsProps> = ({
  input,
  nodeId,
  isFromIterator,
  itemToBeUpdated,
  isFromTextFieldButtonGroup,
  textFieldId,
}) => {
  if (!isDroppableInput(input)) return;

  console.log("input.values", input.values);

  const [errorMessage, setErrorMessage] = useState("");
  const [isComplexType, setIsComplexType] = useState(false);
  const [value, setValue] = useState("");
  const [droppedItems, setDroppedItems] = useState<ComplexValueType[]>([]);
  const nodeStructures = useNodeStructureStore((state) => state.nodeStructures);
  const currentStructure = nodeStructures.find((ns) => ns.nodeId === nodeId);

  useEffect(() => {
    // this is to update the inputs when the name of the outputs change in other nodes
    // Find the current node structure by nodeId

    const currentStructure = nodeStructures.find((ns) => ns.nodeId === nodeId);
    if (currentStructure) {
      // Find the specific input in this node structure that matches input.id
      const matchingInput = currentStructure.inputs.find(
        (inp) => inp.id === input.id
      );

      if (matchingInput && Array.isArray(matchingInput.values)) {
        // Update droppedItems with the value of the matching input
        console.log("in this use effect", input.values);
        console.log(matchingInput);
        const resultOfTypeCheck = checkTypeOfInputItems(matchingInput.values);
        if (resultOfTypeCheck.isComplexType) {
          setDroppedItems(input.values);
          setValue("");
        }
        if (resultOfTypeCheck.isSimpleType) {
          setValue(input.values[0].textValue);
          setDroppedItems([]);
        }
      }
    }
  }, [currentStructure]);

  useEffect(() => {
    if (Array.isArray(input.values) && input.values.length > 0) {
      const resultOfTypeCheck = checkTypeOfInputItems(input.values);

      if (resultOfTypeCheck.isComplexType) {
        setDroppedItems(input.values);
        setValue("");
      }
      if (resultOfTypeCheck.isSimpleType) {
        setValue(input.values[0].textValue);
        setDroppedItems([]);
      }
    } else {
      setDroppedItems([]);
      setValue("");
    }
  }, [input.values]);

  const { updateNodeStructure } = useNodeStructureStore();
  const { edges } = useFlowNodeStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (input.kind === "file" && !isValidUrl(value)) {
      // setErrorMessage("Invalid URL");
      setValue(newValue);
    } else {
      setValue(newValue);
    }
    if (droppedItems.length === 0) {
      updateNodeInputValue([], newValue);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleChipDelete = (itemIndex: number) => {
    setDroppedItems((prevItems) => {
      const newDroppedItems = prevItems.filter(
        (_, index) => index !== itemIndex
      );
      updateNodeInputValue(newDroppedItems);
      return newDroppedItems;
    });

    setIsComplexType(false);
    setErrorMessage("");
  };

  const updateNodeInputValue = (
    newDroppedItems: ComplexValueType[],
    newValue?: any
  ) => {
    const nodeStructure = nodeStructures.find((ns) => ns.nodeId === nodeId);
    // const nodeStructure = getNodeStructure(nodeId);
    if (nodeStructure) {
      let updatedInputs;
      if (isFromIterator && itemToBeUpdated) {
        console.log("in iterator", itemToBeUpdated);
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
          forInputGroupInput.values[0][itemToBeUpdated] =
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
        const textFieldInput = nodeStructure.inputs.find(
          (input) => input.type === INPUT_TYPES.TEXTFIELDBUTTONGROUP
        );

        if (textFieldInput) {
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
            // Update existing value
            textFieldInput.values[valueIndex] = {
              ...textFieldInput.values[valueIndex],
              values: updatedValue,
            };
          } else {
            // Add new value
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
        updatedInputs = nodeStructure.inputs.map((inp: any) =>
          inp.id === input.id
            ? {
                ...inp,
                values:
                  newValue !== undefined
                    ? [{ textValue: newValue }]
                    : newDroppedItems.map((item: ComplexValueType) => ({
                        // nodeId: nodeId,
                        id: item?.id,
                        name: item?.name,
                        icon: item?.icon,
                        error: item.error,
                        typeError: item.typeError,
                        source: item.source,
                        values: null,
                        fullId: item.fullId,
                      })),
              }
            : inp
        );
      }

      if (updatedInputs) {
        updateNodeStructure(nodeId, { inputs: updatedInputs });
      }
    }
  };

  const handleDrop =
    (targetAllowedTypes: string[]) =>
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const flowData = event.dataTransfer.getData(DragDataType.FlowComponent);
      if (flowData) return;

      const draggableInput = event.dataTransfer.getData(
        DragDataType.FlowDraggableInput
      );
      const draggableOutput = event.dataTransfer.getData(
        DragDataType.FlowDraggableOutput
      );

      const contextDraggedData = event.dataTransfer.getData("text/plain");
      console.log("contextDraggedData", contextDraggedData);

      let item: any = null;
      let itemAllowedTypes: AllowedDataType[] = [];
      let itemParentNodeId = null;
      let source = "";

      if (draggableInput) {
        item = JSON.parse(draggableInput);
        source = "dataSelectorNode";

        if (item) itemAllowedTypes = item.allowedDatatypes;
      } else if (draggableOutput) {
        //this is required for dropping from the node ui output
        item = JSON.parse(draggableOutput);
        source = "nodeOutputs";
        if (item) {
          setErrorMessage("");
          itemAllowedTypes = item.allowedDatatypes;
          itemParentNodeId = item.parentNodeId;
          item.id = item.parentNodeId;
          item.name = `${item.name}.${item.label}`;

          const isParentNodeConnected = edges.some(
            (edge) =>
              edge.source === item.parentNodeId ||
              edge.target === item.parentNodeId
          );

          // Check for edges connected to the current nodeId
          const isCurrentNodeConnected = edges.some(
            (edge) => edge.source === nodeId || edge.target === nodeId
          );

          if (!isParentNodeConnected || !isCurrentNodeConnected) {
            const newItem = {
              id: item.id,
              name: item.name,
              icon: item.icon,
              source: source,
              error: true,
              typeError: false,
              values: null,
              fullId: item.referencedDetailedModelDetail
                ? item.referencedDetailedModelDetail.droppedId
                : "",
            };
            if (input.allowMultipleDrop) {
              setDroppedItems((prevItems) => {
                const newDroppedItems = [...prevItems, newItem];
                return newDroppedItems;
              });
              updateNodeInputValue([...droppedItems, newItem]);
            } else {
              setDroppedItems([newItem]);
              updateNodeInputValue([newItem]);
            }
            setErrorMessage("Node has to be connected to allow drop of output");
            return;
          }
        }
      } else if (contextDraggedData) {
        item = JSON.parse(contextDraggedData);
        source = "nodeOutputs";

        if (item && item?.referencedNodeDetails?.source === "nodeOutputs") {
          setErrorMessage("");
          itemAllowedTypes = item.type;
          itemParentNodeId = item.referencedNodeDetails.referencedNodeId;
          item.id = item.referencedNodeDetails.referencedNodeId;
          item.allowedDatatypes = item.type;
          item.icon = "AddOutlined";
          item.name = item.referencedNodeDetails.droppedName;

          const isParentNodeConnected = edges.some(
            (edge) =>
              edge.source === item.referencedNodeDetails.referencedNodeId ||
              edge.target === item.referencedNodeDetails.referencedNodeId
          );

          // Check for edges connected to the current nodeId
          const isCurrentNodeConnected = edges.some(
            (edge) => edge.source === nodeId || edge.target === nodeId
          );

          if (!isParentNodeConnected || !isCurrentNodeConnected) {
            const newItem = {
              id: item.id,
              name: item.name,
              icon: item.icon,
              source: source,
              error: true,
              typeError: false,
              values: null,
              fullId: item.referencedDetailedModelDetail
                ? item.referencedDetailedModelDetail.droppedId
                : "",
            };
            if (input.allowMultipleDrop) {
              setDroppedItems((prevItems) => {
                const newDroppedItems = [...prevItems, newItem];
                return newDroppedItems;
              });
              updateNodeInputValue([...droppedItems, newItem]);
            } else {
              setDroppedItems([newItem]);
              updateNodeInputValue([newItem]);
            }
            setErrorMessage("Node has to be connected to allow drop of output");
            return;
          }
        } else {
          console.log("contextDraggedData1", contextDraggedData);
          item = JSON.parse(contextDraggedData);
          item.icon = "SchemaOutlined";
          item.name = item.referencedDetailedModelDetail?.droppedName
            ? item.referencedDetailedModelDetail?.droppedName
            : item.name;
          item.itemAllowedTypes = [item.type];
          item.source = item.referencedDetailedModelDetail?.source;
          source = item.referencedDetailedModelDetail?.source;
        }
      }

      console.log("in input item:", item, itemAllowedTypes, targetAllowedTypes);

      const isTypeAllowed = itemAllowedTypes.some((type: string) =>
        targetAllowedTypes.includes(type)
      );
      const isTypeCompatible = isAnyTypeCompatible(
        item.type,
        targetAllowedTypes
      );
      const finalTypePermission = isTypeAllowed || isTypeCompatible;
      // const isTypeCompatible=checkTypeCompatibility(item.type)
      const isSameNode = itemParentNodeId === nodeId;

      if (isSameNode) {
        console.log("in same node");
        const newItem = {
          id: item.id,
          name: item.name,
          icon: item.icon,
          error: true,
          typeError: false,
          source: source,
          values: null,
          fullId: item.referencedDetailedModelDetail
            ? item.referencedDetailedModelDetail.droppedId
            : "",
        };
        if (input.allowMultipleDrop) {
          setDroppedItems((prevItems) => {
            const newDroppedItems = [...prevItems, newItem];
            return newDroppedItems;
          });
          updateNodeInputValue([...droppedItems, newItem]);
        } else {
          setDroppedItems([newItem]);
          updateNodeInputValue([newItem]);
        }
        setErrorMessage("Output from the same node cannot be used as input.");
      } else if (finalTypePermission && !isSameNode && item) {
        console.log("in gggg");
        const isDuplicateItem = droppedItems.some(
          (droppedItem) => droppedItem.id === item.id
        );

        if (isDuplicateItem) {
          return;
        }

        setErrorMessage("");
        setValue("");
        console.log("source", source);
        const newItem = {
          id: item.id,
          name: item.name,
          icon: item.icon,
          error: false,
          typeError: false,
          source: source,
          values: null,
          fullId: item.referencedDetailedModelDetail
            ? item.referencedDetailedModelDetail.droppedId
            : "",
        };
        if (input.allowMultipleDrop) {
          setDroppedItems((prevItems) => {
            const newDroppedItems = [...prevItems, newItem];
            return newDroppedItems;
          });
          updateNodeInputValue([...droppedItems, newItem]);
        } else {
          setDroppedItems([newItem]);
          updateNodeInputValue([newItem]);
        }

        setIsComplexType(item.allowedDatatypes.includes("complexValue"));
      } else {
        const newItem = {
          id: item.id,
          name: item.name,
          icon: item.icon,
          error: true,
          typeError: true,
          source: source,
          values: null,
          fullId: item.referencedDetailedModelDetail
            ? item.referencedDetailedModelDetail.droppedId
            : "",
        };
        if (input.allowMultipleDrop) {
          setDroppedItems((prevItems) => {
            const newDroppedItems = [...prevItems, newItem];
            return newDroppedItems;
          });
          updateNodeInputValue([...droppedItems, newItem]);
          setValue("");
        } else {
          setDroppedItems([newItem]);
          updateNodeInputValue([newItem]);
          setValue("");
        }
        setErrorMessage("Type mismatch: item cannot be dropped here.");
        return;
      }
      const hasNodeTypeSevilleDataSelectorNode =
        "nodeType" in item &&
        item.nodeType === "sevilleDataSelectorNode" &&
        item.referencedDetailedModelDetail?.source === "ModelDetail";
      if (!hasNodeTypeSevilleDataSelectorNode) validateNode(nodeId);
    };

  const getInputTypeAndPlaceholder = () => {
    if (droppedItems.length > 0) {
      return { type: "text", placeholder: "" };
    } else {
      switch (input.kind) {
        case "date":
          return { type: "date", placeholder: input.placeholder };
        case "number":
          return { type: "number", placeholder: input.placeholder };
        case "file":
          return { type: "url", placeholder: input.placeholder };
        case "generic":
          return { type: "text", placeholder: "" };

        default:
          return { type: "text", placeholder: input.placeholder };
      }
    }
  };

  const { type, placeholder } = getInputTypeAndPlaceholder();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        paddingTop: 2,
        paddingBottom: 2,
      }}
    >
      <TextField
        key={input.id}
        label={input.label}
        variant="outlined"
        onDragOver={handleDragOver}
        placeholder={placeholder}
        sx={{
          width: "100%",
        }}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          readOnly: !input.allowHardCoding || droppedItems.length > 0,
          startAdornment: droppedItems.map((droppedItem, index) => {
            const IconComponent =
              MuiIcons[droppedItem.icon as keyof typeof MuiIcons];

            return (
              <InputAdornment position="start" key={index}>
                <Chip
                  sx={{
                    backgroundColor:
                      droppedItem.error || droppedItem.typeError
                        ? "red"
                        : "primary",
                  }}
                  icon={<IconComponent sx={{ color: "red" }} />}
                  label={droppedItem.name}
                  onDelete={() => handleChipDelete(index)}
                  style={{
                    marginRight: "5px",
                  }}
                />
              </InputAdornment>
            );
          }),
          endAdornment:
            input.kind === "file" ? (
              <InputAdornment position="end">
                <AttachFileOutlined sx={{ color: "red" }} />
              </InputAdornment>
            ) : isComplexType ? (
              <InputAdornment position="end">
                <MapOutlined sx={{ color: "red" }} />
              </InputAdornment>
            ) : null,
        }}
        onDrop={(event) => handleDrop(input.allowedDataTypes)(event)}
        error={droppedItems.some((item) => item.error || item.typeError)}
        helperText={
          droppedItems.some((item) => item.error || item.typeError)
            ? "Error in one of the dropped items."
            : ""
        }
        value={value}
        type={type}
        onChange={handleChange}
      />
    </Box>
  );
};
