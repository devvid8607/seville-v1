import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  ListItem,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import * as MuiIcons from "@mui/icons-material";
import { useMappingTabStore } from "@/app/canvas/[slug]/flowComponents/_lib/mapping/MappingCanvasSideBarTabStore";
import { checkTypeCompatibility } from "@/app/canvas/[slug]/flowComponents/_lib/_helpers/StringCompare";
import useModelStore, {
  MapDetail,
} from "@/app/canvas/[slug]/modelCreator/_lib/_store/modelStore/ModelDetailsFromBackendStore";

import { useMapStore } from "@/app/canvas/[slug]/flowComponents/_lib/mapping/NewMappingModelStore";
import { useMatchData } from "@/app/canvas/[slug]/flowComponents/_lib/_helpers/MatchingFunctions";

import { MappingInputHandleWrapper } from "./MappingInputHandleWrapper";

import { createMappingModelNode } from "@/app/canvas/[slug]/flowComponents/_lib/_helpers/createModelNode";
import { v4 as uuidv4 } from "uuid";
import { useFlowNodeStore } from "@/app/canvas/[slug]/flowComponents/_lib/_store/FlowNodeStore";
import { useTabStore } from "../../../_store/TabStateManagmentStore";
import { parseDragData } from "../../newDroppable/droppableHelpers";

import { NodeStructureInput } from "@/app/canvas/[slug]/flowComponents/_lib/_types/SevilleSchema";
import { useNodeStructureStore } from "@/app/canvas/[slug]/flowComponents/_lib/_store/FlowNodeStructureStore";

export interface MappedItemDetails {
  targetId: string;
  targetFieldName: string;
  type: string;
  isError: boolean;
  typeError: boolean;
  icon: keyof typeof MuiIcons;
  parentId: string | null;
  parentName: string | null;
}

interface MappingInputDroppableTextFieldProps {
  modelId: string;
  nodeId: string;
  input: NodeStructureInput;
}

export const MappingInputDroppableTextField: React.FC<
  MappingInputDroppableTextFieldProps
> = ({ modelId, nodeId, input }) => {
  const { getMapByModelId, maps, updateRootMapById } = useMapStore((state) => ({
    getMapByModelId: state.getMapByModelId,
    updateRootMapById: state.updateRootMapById,
    maps: state.maps,
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

  const nodeStructures = useNodeStructureStore((state) => state.nodeStructures);
  const { updateNodeStructure } = useNodeStructureStore();

  const handleId = `handle|nd|${nodeId}|model|${modelId}`;

  const { getModelById } = useModelStore((state) => ({
    getModelById: state.getModelById,
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

  const { setActiveTabIndex, setSliderOpen } = useTabStore((state) => ({
    setActiveTabIndex: state.setActiveTabIndex,
    setSliderOpen: state.setSliderOpen,
  }));

  const { matchRootMap } = useMatchData();

  const [value, setValue] = useState("");
  const [droppedItems, setDroppedItems] = useState<MappedItemDetails[]>([]);
  console.log("all maps", maps);

  useEffect(() => {
    const mapItem = getMapByModelId(modelId, nodeId);
    if (mapItem && mapItem.source) {
      console.log("map item", mapItem);
      const newItem: MappedItemDetails = {
        targetId: mapItem.source,
        targetFieldName: mapItem.sourceName,
        icon: "MapOutlined",
        type: mapItem.sourceDataType,
        typeError: mapItem.error,
        isError: mapItem.error,
        parentId: mapItem.sourceParentId,
        parentName: mapItem.sourceParentName,
      };

      setDroppedItems([newItem]);
    }
  }, []);

  const map = getMapByModelId(modelId, nodeId);
  if (!map) {
    return <div>No map available for the provided model ID.</div>;
  }

  console.log("map data", map);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const data = parseDragData(event);
    console.log("data here", data);

    console.log("handle drop called");
    let sourceData = event.dataTransfer.getData("text/plain");

    const sourceJSONData = JSON.parse(sourceData);
    let isCompatibleType = true;
    console.log("source json", sourceJSONData);
    const destDataType = map.destDataType;
    console.log("in check compat", destDataType, sourceJSONData.type);
    if (Array.isArray(sourceJSONData.type)) {
      isCompatibleType = checkTypeCompatibility(
        destDataType,
        sourceJSONData.type[0]
      );
    } else {
      isCompatibleType = checkTypeCompatibility(
        destDataType,
        sourceJSONData.type
      );
    }

    const newItem: MappedItemDetails = {
      targetId: sourceJSONData.dropDetails.droppedId,
      targetFieldName: sourceJSONData.dropDetails.droppedName,
      icon: "MapOutlined",
      type: sourceJSONData.type,
      typeError: !isCompatibleType,
      isError: false,
      parentId: sourceJSONData.dropDetails.parentId,
      parentName: sourceJSONData.parentName,
    };

    setDroppedItems([newItem]);

    // if (sourceJSONData.dropDetails.doPreviousOutputCheck) validateNode(nodeId);

    const updatedMapDetail: MapDetail = {
      ...map,
      source: newItem.targetId,
      sourceName: newItem.targetFieldName,
      sourceDataType: newItem.type,
      error: newItem.isError,
      sourceParentId: newItem.parentId,
      sourceParentName: newItem.parentName,
    };
    updateRootMapById(map.id, nodeId, updatedMapDetail);
    console.log("in drops", map.id, nodeId);
    matchRootMap(modelId, nodeId);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handle change called");
    const newValue = event.target.value;
    setValue(newValue);
  };

  const handleChipDelete = (index: number) => {
    const newItems = droppedItems.filter((_, i) => i !== index);
    setDroppedItems(newItems);
    const updatedMapDetail: MapDetail = {
      ...map,
      source: "",
      sourceName: "",
      sourceDataType: "",
      error: false,
      sourceParentId: null,
      sourceParentName: null,
    };
    updateRootMapById(map.id, nodeId, updatedMapDetail);
  };

  const handleBlur = () => {
    console.log("handle blur called");
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Necessary to allow the drop event
  };

  const handleOnPropertiesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("mapdetailid", +map.id);
    console.log("rootMapId", +map.id);
    setEditedMapId(map.id);
    setRootMapId(map.id);
    setRootNodeId(nodeId);
    setIsTranformProp(false);
    setIsMappingProp(true);
    setIsComplexItem(true);
    setActiveTabIndex(1);
    setSliderOpen(true);
    setIsEditingParentProp(true);
  };

  const handleOnTransformClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("mapdetailid", +map.id);
    console.log("rootMapId", +map.id);
    setEditedMapId(map.id);
    setRootMapId(map.id);
    setRootNodeId(nodeId);
    setIsTranformProp(true);
    setIsMappingProp(false);
    setIsComplexItem(true);
    setActiveTabIndex(1);
    setSliderOpen(true);
    setIsEditingParentProp(true);
  };

  const toggleShowMappingModel = (modelId: string) => {
    const { edgeId } = getConnectedTargetNodeAndEdgeIdByHandle(
      nodeId,
      handleId
    );
    if (!edgeId) {
      const modelToBeMapped = getModelById(modelId);
      const currentNode = getNodeById(nodeId);

      if (modelToBeMapped) {
        const newNodeId = uuidv4();
        const newNode = createMappingModelNode(
          newNodeId,
          modelToBeMapped.modelId,
          nodeId,
          modelToBeMapped.modelId,
          modelToBeMapped.modelName,
          map.id,
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

  return (
    <>
      <ListItem>
        <TextField
          fullWidth
          label="label"
          variant="outlined"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            readOnly: droppedItems.length > 0,
            startAdornment: droppedItems.map((item, index) => (
              <InputAdornment position="start" key={index}>
                <Chip
                  label={
                    item.parentName
                      ? `${item.parentName}-${item.targetFieldName}`
                      : item.targetFieldName
                  }
                  onDelete={() => handleChipDelete(index)}
                  icon={React.createElement(
                    MuiIcons[item.icon as keyof typeof MuiIcons]
                  )}
                  sx={{
                    marginRight: "5px",
                    backgroundColor: item.isError ? "red" : "primary.main",
                  }}
                />
              </InputAdornment>
            )),
            endAdornment: (
              <InputAdornment position="end">
                <MuiIcons.TextSnippetOutlined color="primary" />
              </InputAdornment>
            ),
          }}
          error={droppedItems.some((item) => item.isError)}
          helperText={
            droppedItems.some((item) => item.isError) ? "Type mismatch" : ""
          }
        />
        <Box mt={1}>
          <Tooltip title="Properties">
            <IconButton
              onClick={handleOnPropertiesClick}
              sx={{ paddingLeft: 2, margin: 0 }}
            >
              <MuiIcons.BuildCircleOutlined sx={{ color: "red" }} />
            </IconButton>
          </Tooltip>
        </Box>

        <Box mt={1}>
          <Tooltip title="Transformation">
            <IconButton
              onClick={handleOnTransformClick}
              sx={{ paddingLeft: 2, margin: 0 }}
            >
              <MuiIcons.TransformOutlined sx={{ color: "red" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </ListItem>
      <Box>
        <MappingInputHandleWrapper
          modelId={modelId}
          nodeId={nodeId}
          toggleShowMappingModel={toggleShowMappingModel}
        />
      </Box>
    </>
  );
};
