import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import {
  isNewDroppableInput,
  NodeStructureInput,
  NodeStructureOutput,
} from "../../../flowComponents/_lib/_types/SevilleSchema";

import * as MuiIcons from "@mui/icons-material";
import { AttachFileOutlined, MapOutlined } from "@mui/icons-material";
import {
  useFlowNodeStore,
  NODE_TYPES,
} from "../../../flowComponents/_lib/_store/FlowNodeStore";

import { useNodeStructureStore } from "../../../flowComponents/_lib/_store/FlowNodeStructureStore";
import { isValidUrl } from "../../../flowComponents/_lib/_helpers/regexHelper";

import {
  AnyValueModelType,
  ComplexValueType,
  isComplexValueType,
  isSimpleValueType,
} from "../../../flowComponents/_lib/_types/ValueTypes";

import { INPUT_TYPES } from "../../../flowComponents/_lib/_constants/inputTypes";
import { validateNode } from "../../../flowComponents/_lib/_helpers/CanvasValidation";
import {
  createNewItem,
  isAnyTypeCompatible,
  parseDragData,
} from "./droppableHelpers";
import { MapperInputHandleWrapper } from "./MapperHandleWrapper";
import useModelStore, {
  MapDetail,
} from "@/app/canvas/[slug]/modelCreator/_lib/_store/modelStore/ModelDetailsFromBackendStore";
import {
  buildAttributeTree,
  transformOutputsToTreeDataTypes,
} from "@/app/canvas/[slug]/_lib/_components/sidebarTabComponents/dataTab/customTreeView/TransformToTreeData";

import { useDroppableStore } from "../../../flowComponents/_lib/_store/DroppableStore";
import { DropTypes } from "@/app/canvas/[slug]/_lib/_components/sidebarTabComponents/dataTab/customTreeView/sevilleTreeTypes/TreeTypes";
import { TreeSelector } from "./treeSelector/TreeSelector";
import GridSelector from "./gridSelector/GridSelector";
import { useTabStore } from "@/app/canvas/[slug]/_lib/_store/TabStateManagmentStore";
import { useFlareDrawerStore } from "@/app/canvas/[slug]/_lib/_nodes/flareDrawer/store/FlareDrawerStore";
import FlareDrawer from "@/app/canvas/[slug]/_lib/_nodes/flareDrawer/FlareDrawer";
import { v4 as uuidv4 } from "uuid";

import { useMapStore } from "../../../flowComponents/_lib/mapping/NewMappingModelStore";
import { useMappingStore } from "../../../flowComponents/_lib/mapping/MappingStore";
import { useMatchData } from "../../../flowComponents/_lib/_helpers/MatchingFunctions";
import { createMappingModelNode } from "../../../flowComponents/_lib/_helpers/createModelNode";

import { useMappingTabStore } from "../../../flowComponents/_lib/mapping/MappingCanvasSideBarTabStore";

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
): { isComplexType: boolean; isSimpleType: boolean; isFlareObj: boolean } => {
  let isComplexType = false;
  let isSimpleType = false;
  let isFlareObj = false;

  values.forEach((value: AnyValueModelType) => {
    console.log(value);
    isComplexType = isComplexValueType(value);
    isSimpleType = isSimpleValueType(value);
    isFlareObj = isComplexValueType(value) && value.isFlareItem;
  });

  return { isComplexType, isSimpleType, isFlareObj };
};

export const SevilleNewDroppableInput: React.FC<SevilleNodeInputsProps> = ({
  input,
  nodeId,
  isFromIterator,
  itemToBeUpdated,
  isFromTextFieldButtonGroup,
  textFieldId,
}) => {
  if (!isNewDroppableInput(input)) return;

  console.log("input.values", input);

  const [errorMessage, setErrorMessage] = useState("");
  const [isComplexType, setIsComplexType] = useState(false);
  const [value, setValue] = useState("");
  const [droppedItems, setDroppedItems] = useState<ComplexValueType[]>([]);
  const nodeStructures = useNodeStructureStore((state) => state.nodeStructures);
  const currentStructure = nodeStructures.find((ns) => ns.nodeId === nodeId);
  const [mapId, setMapId] = useState<string | null>(null);

  const {
    setIsFlareDrawerOpen,
    isFlareDrawerOpen,
    setFlareInput,
    setIsFromIfInput,
    setIfConditionId,
    setIfValueId,
    setTextFieldId,
    setFlareNodeId,
    setIteratorItemToBeUpdated,
  } = useFlareDrawerStore((state) => ({
    setIsFlareDrawerOpen: state.setIsFlareDrawerOpen,
    isFlareDrawerOpen: state.isFlareDrawerOpen,
    setFlareInput: state.setFlareInput,
    setIsFromIfInput: state.setIsFromIfInput,
    setIfConditionId: state.setIfConditionId,
    setIfValueId: state.setIfValueId,
    setTextFieldId: state.setTextFieldId,
    setFlareNodeId: state.setFlareNodeId,
    setIteratorItemToBeUpdated: state.setIteratorItemToBeUpdated,
  }));

  const {
    setTreeSelectorNodes,
    removeTreeSelectorNode,
    setGridSelectorNode,
    removeGridSelectorNode,
    gridSelectorNodes,
    treeSelectorNodes,
  } = useDroppableStore((state) => ({
    setTreeSelectorNodes: state.setTreeSelectorNode,
    removeTreeSelectorNode: state.removeTreeSelectorNode,
    setGridSelectorNode: state.setGridSelectorNode,
    removeGridSelectorNode: state.removeGridSelectorNode,
    gridSelectorNodes: state.gridSelectorNodes,
    treeSelectorNodes: state.treeSelectorNodes,
  }));

  const { models } = useModelStore((state) => ({
    models: state.models,
  }));
  const { createMapForModelInput } = useModelStore((state) => ({
    createMapForModelInput: state.createMapForModelInput,
  }));

  console.log(
    "gridSelectorNodes",
    gridSelectorNodes,
    "treeSelectorNodes",
    treeSelectorNodes
  );

  const { getMapByModelId, maps, updateRootMapById, addOrUpdateMap } =
    useMapStore((state) => ({
      getMapByModelId: state.getMapByModelId,
      addOrUpdateMap: state.addOrUpdateMap,
      updateRootMapById: state.updateRootMapById,
      maps: state.maps,
    }));

  const { setMappingModelId, setMappingNodeId } = useMappingStore((state) => ({
    setMappingModelId: state.setMappingModelId,
    setMappingNodeId: state.setMappingNodeId,
  }));

  const {
    setIsComplexItem,
    setEditedMapId,
    setRootMapId,
    setIsMappingProp,
    setIsTranformProp,
    setIsEditingParentProp,
    setRootNodeId,
  } = useMappingTabStore((state) => ({
    setIsComplexItem: state.setIsComplexItem,
    setEditedMapId: state.setEditedMapId,
    setRootMapId: state.setRootMapId,
    setIsTranformProp: state.setIsTranformProp,
    setIsMappingProp: state.setIsMappingProp,
    setIsEditingParentProp: state.setIsEditingParentProp,
    setRootNodeId: state.setRootNodeId,
  }));

  const { setActiveTabIndex, setSliderOpen } = useTabStore((state) => ({
    setActiveTabIndex: state.setActiveTabIndex,
    setSliderOpen: state.setSliderOpen,
  }));

  const {
    addNode,
    addEdges,
    getNodeById,
    getConnectedTargetNodeAndEdgeIdByHandle,
    removeNodeAndDescendants,
    removeEdge,
  } = useFlowNodeStore((state) => ({
    addNode: state.addNode,
    addEdges: state.addEdges,
    getNodeById: state.getNodeById,
    getConnectedTargetNodeAndEdgeIdByHandle:
      state.getConnectedTargetNodeAndEdgeIdByHandle,
    removeNodeAndDescendants: state.removeNodeAndDescendants,
    removeEdge: state.removeEdge,
  }));

  const { getModelById } = useModelStore((state) => ({
    getModelById: state.getModelById,
  }));
  const setCurrentNodeType = useFlowNodeStore(
    (state) => state.setCurrentNodeType
  );

  const { matchRootMap } = useMatchData();

  console.log("all maps", maps);

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
        console.log("in this use effect", matchingInput.values);
        console.log(matchingInput);
        const resultOfTypeCheck = checkTypeOfInputItems(matchingInput.values);
        if (resultOfTypeCheck.isComplexType) {
          console.log("in complex type");
          setDroppedItems(input.values);
          setValue("");
        } else if (resultOfTypeCheck.isSimpleType) {
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

  useEffect(() => {
    if (
      input.values &&
      input.values.length === 1 &&
      input.selector &&
      input.values[0].selector &&
      input.values[0].dropType === DropTypes.Model
    ) {
      // alert("sdfsd 1");
      const treeSelector = buildAttributeTree(
        models,
        input.values[0].droppedId
      );
      if (treeSelector) {
        setTreeSelectorNodes(nodeId, treeSelector);
        setGridSelectorNode(nodeId, null);
      }
    } else if (
      input.values &&
      input.values.length === 1 &&
      input.selector &&
      input.values[0].selector &&
      input.values[0].dropType === DropTypes.List &&
      input.values[0].childDataType === "model"
    ) {
      // alert("sdfsd 2");
      const treeSelector = buildAttributeTree(
        models,
        input.values[0].droppedId
      );
      if (treeSelector) setTreeSelectorNodes(nodeId, treeSelector);
    } else if (
      input.values &&
      input.values.length === 1 &&
      input.selector &&
      input.values[0].selector &&
      input.values[0].dropType === DropTypes.List &&
      input.values[0].childDataType === "codeList"
    ) {
      // alert("sdfsd 2");
      console.log("code list show");
    } else if (
      input.values &&
      input.values.length === 1 &&
      input.selector &&
      input.values[0].selector &&
      input.values[0].dropType === DropTypes.List &&
      input.values[0].selector.gridData &&
      input.values[0].selector.gridData.length > 0
    ) {
      //  alert("sdfsd 3");
      setGridSelectorNode(nodeId, input.values[0].selector.gridData);
      setTreeSelectorNodes(nodeId, null);
    } else if (
      input.values &&
      input.values.length === 1 &&
      input.selector &&
      input.values[0].selector &&
      input.values[0].dropType === DropTypes.Output
    ) {
      //   alert("sdfsd 4");
      const nodeOutputStructure = nodeStructures.find(
        (node) => node.nodeId === nodeId
      );
      console.log("dropped o/p 1", input.values[0].droppedId);
      if (nodeOutputStructure) {
        const nodeOp = nodeOutputStructure.outputs.find(
          (op) => op.id === input.values[0].droppedId
        );
        const testArr: NodeStructureOutput[] = [];

        if (nodeOp) {
          testArr.push(nodeOp);

          const test = transformOutputsToTreeDataTypes(
            testArr,
            nodeId,
            nodeOutputStructure.name,
            nodeOutputStructure.userProvidedName,
            nodeOutputStructure.userProvidedName,
            nodeOutputStructure.nodeId
          );
          console.log("dropped o/p", test);
          if (test) setTreeSelectorNodes(nodeId, test[0]);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (input.isMappedNode && input.modelId) {
      const mapData = createMapForModelInput(input.modelId, nodeId);
      addOrUpdateMap(input.modelId, nodeId, mapData);
      console.log("setting model and node ");
      setMappingModelId(input.modelId);
      setMappingNodeId(nodeId);
      setMapId(mapData.id);
    }
  }, []);

  const { updateNodeStructure } = useNodeStructureStore();

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
    removeTreeSelectorNode(nodeId);
    removeGridSelectorNode(nodeId);
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
        updateNodeStructure(nodeId, { inputs: updatedInputs });
      }
    }
  };

  const handleDropLogic = (
    item: any,
    targetAllowedTypes: { dropType: string[]; edgeType: string | null },
    itemParentNodeId: string | null
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

      console.log("in else ff", isTypeAllowed, isTypeCompatible);
    }

    if (itemParentNodeId) isSameNode = itemParentNodeId === nodeId;
    console.log("Validating", isTypeAllowed, isTypeCompatible, isSameNode);

    if (isSameNode && item.dropDetails.doSelfNodeCheck) {
      handleSameNodeDrop(item);
    } else if ((isTypeAllowed || isTypeCompatible) && !isSameNode) {
      handleNewItemDrop(item, isTypeAllowed, isTypeCompatible);
    }

    if (input.isMappedNode && input.modelId)
      handleMappingUpdates(item, input.modelId);

    if (item.dropDetails.doPreviousOutputCheck) validateNode(nodeId);
  };

  const handleMappingUpdates = (item: any, modelId: string) => {
    const map = getMapByModelId(modelId, nodeId);

    console.log("item in here", item);
    if (map) {
      const updatedMapDetail: MapDetail = {
        ...map,
        source: item.dropDetails.droppedId,
        sourceName: item.dropDetails.droppedName,
        sourceDataType: item.dropDetails.typeCheck,
        error: false,
        sourceParentId: item.dropDetails.parentId,
        sourceParentName: item.parentName,
      };
      updateRootMapById(map.id, nodeId, updatedMapDetail);
      console.log("in drops mapping", map.id, nodeId);
      matchRootMap(modelId, nodeId);
    }
  };

  const handleSameNodeDrop = (item: any) => {
    console.log("in same node");
    setErrorMessage("Output from the same node cannot be used as input.");
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

    setErrorMessage("");
    setValue("");

    updateDroppedItems(item, false, isTypeAllowed && isTypeCompatible);
  };

  const updateDroppedItems = (
    item: any,
    isError: boolean,
    isTypeError: boolean
  ) => {
    const newItem = createNewItem(item, isError, isTypeError);
    console.log("new item", newItem, isError, isTypeError);

    //for the tree selector in the droppable
    if (
      !newItem.typeError &&
      newItem.dropType === DropTypes.Model &&
      input.selector
    ) {
      const treeSelector = buildAttributeTree(models, newItem.droppedId);
      console.log("tree selector", treeSelector);
      if (treeSelector) setTreeSelectorNodes(nodeId, treeSelector);
    } else if (
      !newItem.typeError &&
      newItem.dropType === DropTypes.Output &&
      input.selector
    ) {
      const nodeOutputStructure = nodeStructures.find(
        (node) => node.nodeId === nodeId
      );
      console.log("dropped o/p 1", newItem.droppedId);
      if (nodeOutputStructure) {
        const nodeOp = nodeOutputStructure.outputs.find(
          (op) => op.id === newItem.droppedId
        );
        const testArr: NodeStructureOutput[] = [];

        if (nodeOp) {
          testArr.push(nodeOp);

          const test = transformOutputsToTreeDataTypes(
            testArr,
            nodeId,
            nodeOutputStructure.name,
            nodeOutputStructure.userProvidedName,
            nodeOutputStructure.userProvidedName,
            nodeOutputStructure.nodeId
          );
          console.log("dropped o/p", test);
          if (test) setTreeSelectorNodes(nodeId, test[0]);
        }
      }
    } else if (
      !newItem.typeError &&
      newItem.dropType === DropTypes.List &&
      input.selector
    ) {
      if (newItem.childDataType === "model") {
        removeGridSelectorNode(nodeId);
        const treeSelector = buildAttributeTree(models, newItem.droppedId);

        if (treeSelector) setTreeSelectorNodes(nodeId, treeSelector);
      } else if (newItem.childDataType === "codeList") {
        console.log("code list show", newItem);
        removeTreeSelectorNode(nodeId);
        removeGridSelectorNode(nodeId);
      } else {
        removeTreeSelectorNode(nodeId);
        setGridSelectorNode(nodeId, []);
        console.log("show grid");
      }
    } else if (
      !newItem.typeError &&
      newItem.dropType === DropTypes.GlobalVar &&
      input.selector &&
      Array.isArray(newItem.typeCheck) &&
      newItem.typeCheck.includes("complexValue")
    ) {
      // alert("complex val");
      // transformVariablesToTreeData
      removeGridSelectorNode(nodeId);
      setTreeSelectorNodes(nodeId, item);
    } else if (
      !newItem.typeError &&
      newItem.dropType === DropTypes.GlobalVar &&
      input.selector &&
      Array.isArray(newItem.typeCheck) &&
      newItem.typeCheck.includes("listValue")
    ) {
      // alert("complex val");
      // transformVariablesToTreeData
      removeTreeSelectorNode(nodeId);
      setGridSelectorNode(nodeId, item);
    } else {
      removeTreeSelectorNode(nodeId);
      removeGridSelectorNode(nodeId);
    }

    if (input.allowMultipleDrop) {
      console.log("allowing multi drop");
      setDroppedItems((prevItems) => [...prevItems, newItem]);
      updateNodeInputValue(droppedItems.concat(newItem));
    } else {
      console.log("not allowing multi drop");
      setDroppedItems([newItem]);
      updateNodeInputValue([newItem]);
    }
  };

  const handleDrop =
    (targetAllowedTypes: { dropType: string[]; edgeType: string | null }) =>
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const data = parseDragData(event);
      console.log("data here", data);
      if (!data.item) return;

      const { item } = data;

      console.log("in input item:", item, targetAllowedTypes);
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
    console.log("input id", input);
    setFlareInput(input);
    if (!isFlareDrawerOpen) setIsFlareDrawerOpen(true);
    setIsFromIfInput(false);
    setIfConditionId(null);

    setIfValueId("");
    if (textFieldId) setTextFieldId(textFieldId);
    else setTextFieldId(null);
    setFlareNodeId(nodeId);
    if (itemToBeUpdated) setIteratorItemToBeUpdated(itemToBeUpdated);
  };

  const handleSetIsFlareDrawerOpenInDroppable = () => {
    setIsFlareDrawerOpen(!isFlareDrawerOpen);
  };

  const toggleShowMappingModel = (modelId: string, handleId: string) => {
    const { edgeId } = getConnectedTargetNodeAndEdgeIdByHandle(
      nodeId,
      handleId
    );
    if (!edgeId) {
      const modelToBeMapped = getModelById(modelId);
      const currentNode = getNodeById(nodeId);
      if (modelToBeMapped && mapId) {
        const newNodeId = uuidv4();
        const newNode = createMappingModelNode(
          newNodeId,
          modelToBeMapped.modelId,
          nodeId,
          modelToBeMapped.modelId,
          modelToBeMapped.modelName,
          mapId,
          modelToBeMapped.modelId,
          "mappingModelNode",
          currentNode
          // { x: 1300, y: 300 }
        );
        addNode(newNode);
        const newEdge = {
          id: uuidv4(),
          source: nodeId,
          target: newNodeId,
          sourceHandle: handleId,
          type: "smoothstep",
        };
        console.log(`newEdge:`, newEdge);
        addEdges([newEdge]);
      }
    } else {
      if (nodeId) {
        const { targetNode, edgeId } = getConnectedTargetNodeAndEdgeIdByHandle(
          nodeId,
          handleId
        );
        if (targetNode) removeNodeAndDescendants(targetNode.id);
        if (edgeId) removeEdge(edgeId);
      }
    }
  };

  const handleOnPropertiesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mapId) {
      setEditedMapId(mapId);
      setRootMapId(mapId);
      setRootNodeId(nodeId);
      setIsTranformProp(false);
      setIsMappingProp(true);
      setIsComplexItem(true);
      setActiveTabIndex(1);
      setSliderOpen(true);
      setCurrentNodeType(NODE_TYPES.FLOWNODE);
      setIsEditingParentProp(true);
    }
  };

  const handleOnTransformClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mapId) {
      setEditedMapId(mapId);
      setRootMapId(mapId);
      setRootNodeId(nodeId);
      setIsTranformProp(true);
      setIsMappingProp(false);
      setIsComplexItem(true);
      setActiveTabIndex(1);
      setCurrentNodeType(NODE_TYPES.FLOWNODE);
      setSliderOpen(true);
      setIsEditingParentProp(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
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
          alignItems: "center",
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
          onDrop={(event) => handleDrop(input.allowedDataTypes)(event)}
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
        {input.showFlareDrawer && (
          <Tooltip title="Open Flare Drawer">
            <IconButton onClick={() => handleFlareDrawer(input)}>
              <MuiIcons.CodeOutlined color="primary" sx={{ mb: 1 }} />
            </IconButton>
          </Tooltip>
        )}

        {input.showMapProps && (
          <Tooltip title="Properties">
            <IconButton
              onClick={handleOnPropertiesClick}
              sx={{ paddingLeft: 2, margin: 0 }}
            >
              <MuiIcons.BuildCircleOutlined sx={{ color: "red" }} />
            </IconButton>
          </Tooltip>
        )}

        {input.showTransformProps && (
          <Tooltip title="Transformation">
            <IconButton
              onClick={handleOnTransformClick}
              sx={{ paddingLeft: 2, margin: 0 }}
            >
              <MuiIcons.TransformOutlined sx={{ color: "red" }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {input.allowedDataTypes.edgeType &&
        input.allowedDataTypes.edgeType === "modelMapper" &&
        input.isMappedNode &&
        input.modelId && (
          <MapperInputHandleWrapper
            edgeType={input.allowedDataTypes.edgeType}
            modelId={input.modelId}
            nodeId={nodeId}
            toggleShowMappingModel={toggleShowMappingModel}
          />
        )}

      {input.selector && (
        <Box width="100%">
          <TreeSelector input={input} nodeId={nodeId} />
        </Box>
      )}

      {input.selector && (
        <Box width="100%">
          <GridSelector nodeId={nodeId} input={input} />
        </Box>
      )}

      {input.showFlareDrawer && isFlareDrawerOpen && (
        <FlareDrawer
          isFlareDrawerOpen={isFlareDrawerOpen}
          setIsFlareDrawerOpenInDroppable={
            handleSetIsFlareDrawerOpenInDroppable
          }
          // nodeId={nodeId}
          isFromIterator={isFromIterator}
          itemToBeUpdated={itemToBeUpdated}
          isFromTextFieldButtonGroup={isFromTextFieldButtonGroup}
          textFieldId={textFieldId}
        />
      )}
    </Box>
  );
};
