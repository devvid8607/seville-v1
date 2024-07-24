import * as MuiIcons from "@mui/icons-material";
import { AttachFileOutlined, MapOutlined } from "@mui/icons-material";
import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { useNodeStructureStore } from "../../../flowComponents/_lib/_store/FlowNodeStructureStore";
import {
  NodeStructureInput,
  isNewDroppableInput,
} from "../../../flowComponents/_lib/_types/SevilleSchema";

import { AnyValueModelType } from "../../../flowComponents/_lib/_types/ValueTypes";
import { INPUT_TYPES } from "../../../flowComponents/_lib/_constants/inputTypes";
import { validateNode } from "../../../flowComponents/_lib/_helpers/CanvasValidation";
import { isValidUrl } from "../../../flowComponents/_lib/_helpers/regexHelper";
import {
  createNewItem,
  isAnyTypeCompatible,
  parseDragData,
} from "../newDroppable/droppableHelpers";

import { findMatchingCondition } from "./IfInput";
import { useFlareDrawerStore } from "../../_nodes/flareDrawer/store/FlareDrawerStore";
import FlareDrawer from "../../_nodes/flareDrawer/FlareDrawer";

type SevilleNodeInputsProps = {
  input: NodeStructureInput;
  nodeId: string;
  textFieldId?: string;
  isFromIfNode?: boolean;
  inputIfNode?: NodeStructureInput;
  conditionID?: string | number | undefined;
};
interface DroppedItemType {
  name: string;
  allowedDatatypes?: string[];
  id?: number;
  icon: string;
  error: boolean;
  // source: string;
  values: AnyValueModelType[] | null;
  typeError: boolean;
  droppedId: string;
  parentId: string;
  isFlareItem: boolean;
}

export const IfDroppable: React.FC<SevilleNodeInputsProps> = ({
  input,
  nodeId,
  textFieldId,
  isFromIfNode,
  inputIfNode,
  conditionID,
}) => {
  if (!isNewDroppableInput(input)) return;

  console.log("if drop");
  console.log(input);
  console.log("nodeId:", nodeId);

  const [droppedItems, setDroppedItems] = useState<DroppedItemType[]>([]);
  const [isComplexType, setIsComplexType] = useState(false);
  const [value, setValue] = useState("");

  const { getNodeStructure, updateNodeStructure } = useNodeStructureStore();
  const { nodeStructures } = useNodeStructureStore((state) => ({
    nodeStructures: state.nodeStructures,
  }));
  const {
    setIsFlareDrawerOpen,
    isFlareDrawerOpen,
    setFlareInput,
    setIfConditionId,
    setIfValueId,
    testItem,
    ifConditionId,
    ifValueId,
    setIsFromIfInput,
    setFlareNodeId,
  } = useFlareDrawerStore((state) => ({
    setIsFlareDrawerOpen: state.setIsFlareDrawerOpen,
    isFlareDrawerOpen: state.isFlareDrawerOpen,
    setFlareInput: state.setFlareInput,
    setIfConditionId: state.setIfConditionId,
    setIfValueId: state.setIfValueId,
    ifConditionId: state.ifConditionId,
    ifValueId: state.ifValueId,
    testItem: state.testItem,
    setIsFromIfInput: state.setIsFromIfInput,
    setFlareNodeId: state.setFlareNodeId,
  }));

  console.log("if drop", nodeStructures);

  // useEffect(() => {
  //   if (isFromIfNode && inputIfNode && conditionID && ifConditionId) {
  //     console.log("testItem change");

  //     const matchingConditionObj = findMatchingCondition(
  //       nodeId,
  //       inputIfNode.id,
  //       ifConditionId
  //     );

  //     if (matchingConditionObj) {
  //       console.log("matchhh", matchingConditionObj);
  //       if (matchingConditionObj && ifValueId === "valueOne") {
  //         console.log("in value 1", matchingConditionObj.valueOne);

  //         if (
  //           typeof matchingConditionObj.valueOne === "string" ||
  //           typeof matchingConditionObj.valueOne === "number"
  //         ) {
  //           console.log("in value");
  //           setValue(matchingConditionObj.valueOne.textValue);
  //           setDroppedItems([]);
  //         } else {
  //           if (
  //             typeof matchingConditionObj.valueOne === "object" &&
  //             !Array.isArray(matchingConditionObj.valueOne)
  //           ) {
  //             console.log("in obj");
  //             setDroppedItems([]);
  //             setValue(matchingConditionObj.valueOne.textValue);
  //           } else if (Array.isArray(matchingConditionObj.valueOne)) {
  //             setDroppedItems(matchingConditionObj.valueOne);
  //             setValue("");
  //           }
  //         }
  //       } else if (matchingConditionObj && ifValueId === "valueTwo") {
  //         console.log("in value 2");
  //         if (
  //           typeof matchingConditionObj.valueTwo === "string" ||
  //           typeof matchingConditionObj.valueTwo === "number"
  //         ) {
  //           setValue(matchingConditionObj.valueTwo.textValue);
  //           setDroppedItems([]);
  //         } else {
  //           if (
  //             typeof matchingConditionObj.valueTwo === "object" &&
  //             !Array.isArray(matchingConditionObj.valueTwo)
  //           ) {
  //             setDroppedItems([]);
  //             setValue(matchingConditionObj.valueTwo.textValue);
  //           } else if (Array.isArray(matchingConditionObj.valueTwo)) {
  //             setDroppedItems(matchingConditionObj.valueTwo);
  //             setValue("");
  //           }
  //         }
  //       }
  //     }
  //   }
  // }, [testItem]);

  useEffect(() => {
    if (isFromIfNode && inputIfNode && conditionID) {
      console.log("in use effect of if");
      const matchingConditionObj = findMatchingCondition(
        nodeId,
        inputIfNode.id,
        conditionID
      );

      if (matchingConditionObj) {
        console.log(matchingConditionObj);
        if (matchingConditionObj && textFieldId === "valueOne") {
          if (
            typeof matchingConditionObj.valueOne === "string" ||
            typeof matchingConditionObj.valueOne === "number"
          ) {
            console.log("in value");
            setValue(matchingConditionObj.valueOne.textValue);
            setDroppedItems([]);
          } else {
            if (
              typeof matchingConditionObj.valueOne === "object" &&
              !Array.isArray(matchingConditionObj.valueOne)
            ) {
              console.log("in obj");
              setDroppedItems([]);
              setValue(matchingConditionObj.valueOne.textValue);
            } else if (Array.isArray(matchingConditionObj.valueOne)) {
              setDroppedItems(matchingConditionObj.valueOne);
              setValue("");
            }
          }
        } else if (matchingConditionObj && textFieldId === "valueTwo") {
          if (
            typeof matchingConditionObj.valueTwo === "string" ||
            typeof matchingConditionObj.valueTwo === "number"
          ) {
            setValue(matchingConditionObj.valueTwo.textValue);
            setDroppedItems([]);
          } else {
            if (
              typeof matchingConditionObj.valueTwo === "object" &&
              !Array.isArray(matchingConditionObj.valueTwo)
            ) {
              setDroppedItems([]);
              setValue(matchingConditionObj.valueTwo.textValue);
            } else if (Array.isArray(matchingConditionObj.valueTwo)) {
              setDroppedItems(matchingConditionObj.valueTwo);
              setValue("");
            }
          }
        }
      }
    }
  }, [
    nodeStructures,
    isFromIfNode,
    inputIfNode,
    conditionID,
    textFieldId,
    testItem,
  ]);

  const updateNodeInputValue = (
    newDroppedItems: DroppedItemType[],
    newValue?: any
  ) => {
    const nodeStructure = getNodeStructure(nodeId);
    if (nodeStructure) {
      let updatedInputs;

      if (isFromIfNode) {
        const ifInputGroupInput = nodeStructure.inputs.find(
          (input) => input.type === INPUT_TYPES.IFINPUTGROUP
        );

        if (ifInputGroupInput && conditionID) {
          const matchingConditionObj = ifInputGroupInput.values.find(
            (cond: any) => cond.id === conditionID
          );

          if (
            textFieldId &&
            textFieldId === "valueOne" &&
            matchingConditionObj
          ) {
            matchingConditionObj.valueOne =
              newValue !== undefined ? newValue : newDroppedItems;
          } else
            matchingConditionObj.valueTwo =
              newValue !== undefined ? newValue : newDroppedItems;
        }
      }

      if (updatedInputs) {
        updateNodeStructure(nodeId, { inputs: updatedInputs });
      }
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
    // setErrorMessage("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (input.kind === "file" && !isValidUrl(value)) {
      // setErrorMessage("Invalid URL");
      setValue(newValue);
    } else {
      setValue(newValue);
    }
    if (droppedItems.length === 0) {
      const updateValue = { textValue: newValue };
      updateNodeInputValue([], updateValue);
    }
  };

  // const handleDrop =
  //   (targetAllowedTypes: string[]) =>
  //   (event: React.DragEvent<HTMLDivElement>) => {
  //     event.preventDefault();
  //     setValue("");
  //     const flowData = event.dataTransfer.getData(DragDataType.FlowComponent);
  //     if (flowData) return;

  //     const draggableInput = event.dataTransfer.getData(
  //       DragDataType.FlowDraggableInput
  //     );
  //     const draggableOutput = event.dataTransfer.getData(
  //       DragDataType.FlowDraggableOutput
  //     );
  //     const contextDraggedData = event.dataTransfer.getData("text/plain");

  //     let item: any = null;
  //     let itemAllowedTypes: AllowedDataType[] = [];
  //     let itemParentNodeId = null;
  //     let source = "";

  //     if (draggableInput) {
  //       item = JSON.parse(draggableInput);
  //       source = "dataSelectorNode";

  //       if (item) itemAllowedTypes = item.allowedDatatypes;
  //     } else if (draggableOutput) {
  //       item = JSON.parse(draggableOutput);
  //       source = "nodeOutputs";
  //       if (item) {
  //         //   setErrorMessage("");
  //         itemAllowedTypes = item.allowedDatatypes;
  //         itemParentNodeId = item.parentNodeId;
  //         item.id = item.parentNodeId;
  //         item.name = `${item.name}.${item.label}`;

  //         const isParentNodeConnected = edges.some(
  //           (edge) =>
  //             edge.source === item.parentNodeId ||
  //             edge.target === item.parentNodeId
  //         );

  //         // Check for edges connected to the current nodeId
  //         const isCurrentNodeConnected = edges.some(
  //           (edge) => edge.source === nodeId || edge.target === nodeId
  //         );

  //         if (!isParentNodeConnected || !isCurrentNodeConnected) {
  //           const newItem = {
  //             id: item.id,
  //             name: item.name,
  //             //   allowedDatatypes: item.allowedDatatypes,
  //             icon: item.icon,
  //             error: true,
  //             source: source,
  //             values: null,
  //             typeError: false,
  //           };
  //           if (input.config.allowMultipleDrop) {
  //             setDroppedItems((prevItems) => {
  //               const newDroppedItems = [...prevItems, newItem];
  //               updateNodeInputValue(newDroppedItems);
  //               return newDroppedItems;
  //             });
  //           } else {
  //             setDroppedItems([newItem]);
  //             updateNodeInputValue([newItem]);
  //           }
  //           // setErrorMessage("Node has to be connected to allow drop of output");
  //           return;
  //         }
  //       }
  //     } else if (contextDraggedData) {
  //       item = JSON.parse(contextDraggedData);
  //       source = "nodeOutputs";
  //       if (item && item?.referencedNodeDetails?.source === "nodeOutputs") {
  //         itemAllowedTypes = item.type;
  //         itemParentNodeId = item.referencedNodeDetails.referencedNodeId;
  //         item.id = item.referencedNodeDetails.referencedNodeId;
  //         item.allowedDatatypes = item.type;
  //         item.icon = "AddOutlined";
  //         item.name = item.referencedNodeDetails.droppedName;

  //         const isParentNodeConnected = edges.some(
  //           (edge) =>
  //             edge.source === item.referencedNodeDetails.referencedNodeId ||
  //             edge.target === item.referencedNodeDetails.referencedNodeId
  //         );

  //         // Check for edges connected to the current nodeId
  //         const isCurrentNodeConnected = edges.some(
  //           (edge) => edge.source === nodeId || edge.target === nodeId
  //         );
  //         if (!isParentNodeConnected || !isCurrentNodeConnected) {
  //           const newItem = {
  //             id: item.id,
  //             name: item.name,
  //             icon: item.icon,
  //             source: source,
  //             error: true,
  //             typeError: false,
  //             values: null,
  //           };
  //           if (input.allowMultipleDrop) {
  //             setDroppedItems((prevItems) => {
  //               const newDroppedItems = [...prevItems, newItem];
  //               return newDroppedItems;
  //             });
  //             updateNodeInputValue([...droppedItems, newItem]);
  //           } else {
  //             setDroppedItems([newItem]);
  //             updateNodeInputValue([newItem]);
  //           }
  //           // setErrorMessage("Node has to be connected to allow drop of output");
  //           return;
  //         }
  //       }

  //       // if (item) {
  //       //   itemAllowedTypes = [item.type];
  //       //   item.allowedDatatypes = [item.type];
  //       //   item.icon = "AddOutlined";
  //       //   item.nodeType = "sevilleDataSelectorNode";
  //       // }
  //     }
  //     console.log("in input item:", item);
  //     const isTypeAllowed = itemAllowedTypes.some((type: string) =>
  //       targetAllowedTypes.includes(type)
  //     );
  //     const isSameNode = itemParentNodeId === nodeId;

  //     if (isSameNode) {
  //       console.log("in same node");
  //       const newItem = {
  //         id: item.id,
  //         name: item.name,
  //         // allowedDatatypes: item.allowedDatatypes,
  //         icon: item.icon,
  //         error: true,
  //         source: source,
  //         values: null,
  //         typeError: false,
  //       };
  //       if (input.config.allowMultipleDrop) {
  //         setDroppedItems((prevItems) => {
  //           const newDroppedItems = [...prevItems, newItem];
  //           updateNodeInputValue(newDroppedItems);
  //           return newDroppedItems;
  //         });
  //       } else {
  //         setDroppedItems([newItem]);
  //         updateNodeInputValue([newItem]);
  //       }
  //       // setErrorMessage("Output from the same node cannot be used as input.");
  //     } else if (isTypeAllowed && !isSameNode && item) {
  //       console.log("in else 1");
  //       const isDuplicateItem = droppedItems.some(
  //         (droppedItem) => droppedItem.id === item.id
  //       );

  //       if (isDuplicateItem) {
  //         //    setErrorMessage("This item has already been added.");
  //         return;
  //       }

  //       // setErrorMessage("");
  //       setValue("");

  //       const newItem = {
  //         id: item.id,
  //         name: item.name,
  //         //  allowedDatatypes: item.allowedDatatypes,
  //         icon: item.icon,
  //         error: false,
  //         source: source,
  //         values: null,
  //         typeError: false,
  //       };
  //       if (input.config.allowMultipleDrop) {
  //         setDroppedItems((prevItems) => {
  //           const newDroppedItems = [...prevItems, newItem];
  //           updateNodeInputValue(newDroppedItems);
  //           return newDroppedItems;
  //         });
  //       } else {
  //         setDroppedItems([newItem]);
  //         updateNodeInputValue([newItem]);
  //       }

  //       setIsComplexType(item.allowedDatatypes.includes("complexValue"));
  //     } else {
  //       console.log("in else 2");
  //       const newItem = {
  //         id: item.id,
  //         name: item.name,
  //         typeError: true,
  //         icon: item.icon,
  //         error: true,
  //         source: source,
  //         values: null,
  //       };
  //       if (input.config.allowMultipleDrop) {
  //         setDroppedItems((prevItems) => {
  //           const newDroppedItems = [...prevItems, newItem];
  //           updateNodeInputValue(newDroppedItems);
  //           return newDroppedItems;
  //         });
  //       } else {
  //         setDroppedItems([newItem]);
  //         updateNodeInputValue([newItem]);
  //       }
  //       //setErrorMessage("Type mismatch: item cannot be dropped here.");
  //       return;
  //     }
  //     const hasNodeTypeSevilleDataSelectorNode =
  //       "nodeType" in item && item.nodeType === "sevilleDataSelectorNode";
  //     if (!hasNodeTypeSevilleDataSelectorNode) validateNode(nodeId);
  //   };

  const handleDropLogic = (
    item: any,
    targetAllowedTypes: { dropType: string[]; edgeType: string | null },
    itemParentNodeId: string
  ) => {
    console.log("target allowed types", item);
    let isTypeAllowed = true;
    let isTypeCompatible = true;
    let isSameNode = false;
    if (
      Array.isArray(item.dropDetails.typeCheck) &&
      item.dropDetails.typeCheck.length > 0 &&
      targetAllowedTypes.dropType
    ) {
      isTypeAllowed = item.dropDetails.typeCheck.some((type: string) =>
        targetAllowedTypes.dropType.includes(type)
      );
    } else {
      isTypeCompatible = isAnyTypeCompatible(
        item.dropDetails.typeCheck,
        targetAllowedTypes.dropType
      );

      console.log("in else", isTypeAllowed, isTypeCompatible);
    }

    if (itemParentNodeId) isSameNode = itemParentNodeId === nodeId;
    console.log("Validating", isTypeAllowed, isTypeCompatible, isSameNode);

    if (isSameNode && item.dropDetails.doSelfNodeCheck) {
      handleSameNodeDrop(item);
    } else if ((isTypeAllowed || isTypeCompatible) && !isSameNode) {
      handleNewItemDrop(item, isTypeAllowed, isTypeCompatible);
    }

    if (item.dropDetails.doPreviousOutputCheck) validateNode(nodeId);
    // if (item.dropDetails.doInputModelCheck) validateModelInputNode(nodeId);
  };

  const handleSameNodeDrop = (item: any) => {
    console.log("in same node");
    // setErrorMessage("Output from the same node cannot be used as input.");
    updateDroppedItems(item, true, false);
  };

  const handleNewItemDrop = (
    item: any,
    isTypeAllowed: boolean,
    isTypeCompatible: boolean
  ) => {
    console.log("in new item drop", item);
    const isDuplicateItem = droppedItems.some((droppedItem) => {
      console.log("droppedItem", droppedItem);

      return (
        droppedItem.droppedId === item.id &&
        droppedItem.parentId === item.dropDetails.parentId
      );
    });
    if (isDuplicateItem) return;

    // setErrorMessage("");
    setValue("");
    //  console.log("source", source);
    updateDroppedItems(item, false, isTypeAllowed && isTypeCompatible);
  };

  const updateDroppedItems = (
    item: any,
    isError: boolean,
    isTypeError: boolean
  ) => {
    const newItem = createNewItem(item, isError, isTypeError);
    if (input.allowMultipleDrop) {
      setDroppedItems((prevItems) => [...prevItems, newItem]);
    } else {
      setDroppedItems([newItem]);
    }
    updateNodeInputValue(droppedItems.concat(newItem));
  };

  const handleDrop =
    (targetAllowedTypes: { dropType: string[]; edgeType: string | null }) =>
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const data = parseDragData(event);
      console.log("data here", data);
      if (!data.item) return;

      const { item } = data;

      console.log(
        "in input item:",
        item,

        targetAllowedTypes
      );
      handleDropLogic(
        item,

        targetAllowedTypes,
        item.dropDetails.parentId ? item.dropDetails.parentId : null
      );
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

  const handleFlareDrawer = (input: NodeStructureInput) => {
    console.log("input id", input, conditionID, textFieldId);
    setFlareInput(input);
    setIfConditionId(conditionID);
    if (textFieldId) setIfValueId(textFieldId);
    if (!isFlareDrawerOpen) setIsFlareDrawerOpen(true);
    setIsFromIfInput(true);
    setFlareNodeId(nodeId);
  };

  const handleSetIsFlareDrawerOpenInDroppable = () => {
    setIsFlareDrawerOpen(!isFlareDrawerOpen);
  };

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "end",
          justifyContent: "space-evenly",
          width: "100%",
          gap: 2,
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
            readOnly: !input.config.allowHardCoding || droppedItems.length > 0,
            startAdornment: droppedItems.map((droppedItem, index) => {
              const IconComponent =
                MuiIcons[droppedItem.icon as keyof typeof MuiIcons];

              return (
                <InputAdornment position="start" key={index}>
                  <Chip
                    sx={{
                      backgroundColor:
                        droppedItem.error || droppedItem.typeError
                          ? "#FA8072"
                          : droppedItem.isFlareItem
                          ? "#7DF9FF"
                          : "primary",
                    }}
                    icon={<MuiIcons.AddAPhotoOutlined sx={{ color: "red" }} />}
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
          onDrop={(event) => handleDrop(input.config.allowedDataTypes)(event)}
          error={droppedItems.some((item) => item.error || item.typeError)}
          helperText={
            droppedItems.some((item) => item.typeError) &&
            droppedItems.some((item) => item.error)
              ? "Error in Dropped items"
              : droppedItems.some((item) => item.typeError)
              ? "Type error: Incompatible item type."
              : droppedItems.some((item) => item.error)
              ? "Validation Error."
              : ""
          }
          value={value}
          type={type}
          onChange={handleChange}
        />
        <Tooltip title="Open Flare Drawer">
          <IconButton onClick={() => handleFlareDrawer(input)}>
            <MuiIcons.CodeOutlined color="primary" sx={{ mb: 1 }} />
          </IconButton>
        </Tooltip>
      </Box>
      {isFlareDrawerOpen && (
        <FlareDrawer
          isFlareDrawerOpen={isFlareDrawerOpen}
          setIsFlareDrawerOpenInDroppable={
            handleSetIsFlareDrawerOpenInDroppable
          }
          nodeId={nodeId}
          isFromIfNode={true}
          textFieldId={textFieldId}
          conditionID={conditionID}
        />
      )}
    </Box>
  );
};
