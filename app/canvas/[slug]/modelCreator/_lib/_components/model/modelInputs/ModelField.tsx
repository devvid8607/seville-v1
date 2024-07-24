import * as MuiIcons from "@mui/icons-material";
import {
  DeleteForeverOutlined,
  KeyOutlined,
  LockOpenOutlined,
  LockOutlined,
  OutboundOutlined,
} from "@mui/icons-material";
import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { memo, useEffect } from "react";
import { useUpdateNodeInternals } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import {
  iconLookup,
  IconLookup,
} from "../../../../../_lib/_constants/IconConstants";
import { createModelNode } from "@/app/canvas/[slug]/flowComponents/_lib/_helpers/createModelNode";

import useModelStore from "../../../_store/modelStore/ModelDetailsFromBackendStore";
import { useModelNodesStore } from "../../../_store/modelStore/ModelNodesStore";
import { useTabStore } from "../../../../../_lib/_store/TabStateManagmentStore";
import { FieldType } from "../../../_types/FieldType";
import { HandleWrapper } from "./HandleWrapper";
import React, { useState } from "react";
import useDataTypesStore from "../../../../../_lib/_store/DataTypesStore";
import { getAttributeIdFromHandle } from "../../../_helpers/createModelData";

export const ModelField = memo(
  ({
    field,
    modelId,
    nodeId,
  }: {
    field: FieldType;
    modelId: string;
    nodeId: string;
  }) => {
    // #region consts and state variables
    const {
      name,
      locked,
      notNull,
      isRemovable,
      id,
      dataType,
      hasHandle,
      showModel,
      dataSourceId,
      dataSourceFriendlyName,
    } = field;

    const iconValue =
      iconLookup[dataType as keyof IconLookup] || "QuestionMarkOutlined";
    const IconComponent = MuiIcons[iconValue as keyof typeof MuiIcons];

    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [overId, setOverId] = useState<string | null>(null);
    const [dragPosition, setDragPosition] = useState<"above" | "below" | null>(
      null
    );
    // #endregion

    // #region store imports
    // #region usemodelstore imports
    const getModelById = useModelStore((state) => state.getModelById);
    const getAttributeById = useModelStore((state) => state.getAttributeById);
    const updateAttributeValueOfAModel = useModelStore(
      (state) => state.updateAttributeValueOfAModel
    );

    const updatePropertyCurrentValue = useModelStore(
      (state) => state.updatePropertyCurrentValue
    );
    const findPropertyIdByType = useModelStore(
      (state) => state.findPropertyIdByType
    );
    const reorderAttributes = useModelStore((state) => state.reorderAttributes);
    const removeAttribute = useModelStore((state) => state.removeAttribute);
    // #endregion

    // #region usetabstore imports
    const setActiveTabIndex = useTabStore((state) => state.setActiveTabIndex);
    const setSliderOpen = useTabStore((state) => state.setSliderOpen);
    const sliderOpen = useTabStore((state) => state.sliderOpen);
    const setModelId = useTabStore((state) => state.setModelId);
    const setAttributeId = useTabStore((state) => state.setAttributeId);
    const attributeId = useTabStore((state) => state.attributeId);
    const setIsModelPropertyShowing = useTabStore(
      (state) => state.setIsModelPropertyShowing
    );
    // #endregion

    // #region useModelNodesStore imports
    const addNode = useModelNodesStore((state) => state.addNode);
    const addEdge = useModelNodesStore((state) => state.addEdge);
    const getConnectedTargetNodeAndEdgeIdByHandle = useModelNodesStore(
      (state) => state.getConnectedTargetNodeAndEdgeIdByHandle
    );

    const removeEdge = useModelNodesStore((state) => state.removeEdge);
    const getNodeById = useModelNodesStore((state) => state.getNodeById);
    const removeNodeAndDescendants = useModelNodesStore(
      (state) => state.removeNodeAndDescendants
    );
    // #endregion

    const { storeDataTypes } = useDataTypesStore((state) => ({
      storeDataTypes: state.dataTypes,
    }));

    const updateNodeInternals = useUpdateNodeInternals();

    // #endregion

    // #region event handlers
    const handleSingleClick = (key: string, dataType: string) => {
      setIsModelPropertyShowing(false);
      setActiveTabIndex(1);
      if (!sliderOpen) setSliderOpen(true);

      //get properties form API based on datatype, and add it to the store
      //const properties = (propertiesData as any)[dataType]?.Properties || [];
      const selectedTypeData = storeDataTypes.find(
        (type) => type.code === dataType
      );
      const properties = selectedTypeData?.properties || [];
      useModelStore.getState().addAttributeProperties(modelId, id, properties);
      setAttributeId(id);
      setModelId(modelId);
      const propid = findPropertyIdByType(modelId, id, "modeldropdown");
      if (propid && dataSourceId)
        updatePropertyCurrentValue(modelId, id, propid, dataSourceId);
    };

    const toggleShowModel = (handleId: string) => {
      // console.log("handleid", handleId);
      const { edgeId } = getConnectedTargetNodeAndEdgeIdByHandle(
        nodeId,
        handleId
      );

      if (!edgeId && dataSourceId && dataSourceFriendlyName) {
        // console.log("no edge id", modelId, attributeId);
        //add edge and node
        const currentNode = getNodeById(nodeId);
        const newNodeId = uuidv4();
        let newNode;
        const currentAttrId = getAttributeIdFromHandle(handleId);
        let attributeAtWork;
        if (currentAttrId)
          attributeAtWork = getAttributeById(modelId, currentAttrId);
        // console.log("attratwork", attributeAtWork);

        if (
          dataType === "list" &&
          attributeAtWork &&
          attributeAtWork.childDataType &&
          attributeAtWork.childDataType === "model"
        ) {
          // console.log("path 1");
          newNode = createModelNode(
            newNodeId,
            dataSourceId,
            dataSourceFriendlyName,
            "modelNode",
            currentNode
          );
          addNode(newNode);
        } else if (
          dataType === "list" &&
          attributeAtWork &&
          attributeAtWork.childDataType &&
          attributeAtWork.childDataType === "codeList"
        ) {
          // console.log("path 2");
          newNode = createModelNode(
            newNodeId,
            dataSourceId,
            dataSourceFriendlyName,
            "codeListNode",
            currentNode
          );
          addNode(newNode);
        } else if (dataType === "model") {
          // console.log("path 3");
          newNode = createModelNode(
            newNodeId,
            dataSourceId,
            dataSourceFriendlyName,
            "modelNode",
            currentNode
          );
          addNode(newNode);
        } else if (dataType === "codeList") {
          // console.log("path 4");
          //create a code list node
          newNode = createModelNode(
            newNodeId,
            dataSourceId,
            dataSourceFriendlyName,
            "codeListNode",
            currentNode
          );
          addNode(newNode);
        }

        if (nodeId && newNode) {
          const newEdge = {
            id: uuidv4(),
            source: nodeId,
            target: newNode.id,
            sourceHandle: handleId,
            type: "smoothstep",
          };
          addEdge(newEdge);
        }
      } else {
        //if node and edge is connected then remove edge and node
        if (nodeId) {
          const { targetNode, edgeId } =
            getConnectedTargetNodeAndEdgeIdByHandle(nodeId, handleId);
          if (targetNode) removeNodeAndDescendants(targetNode.id);
          if (edgeId) removeEdge(edgeId);
        }
      }

      const currentModel = getModelById(modelId);
      if (currentModel) {
        const currentField = getAttributeById(modelId, id);
        if (currentField) {
          // console.log("currentfield", currentField);
          updateAttributeValueOfAModel(
            modelId,
            id,
            "showModel",
            !currentField.showModel
          );
        }
      }
    };

    const handleDeleteAttribute = (event: React.MouseEvent) => {
      event.stopPropagation();
      if (isRemovable) removeAttribute(modelId, id);
    };

    const handleNotNullUpdate = (event: React.MouseEvent) => {
      event.stopPropagation();
      updateAttributeValueOfAModel(modelId, id, "notNull", !notNull);
    };

    const handleDragStart = (
      event: React.DragEvent<HTMLDivElement>,
      id: string
    ) => {
      event.dataTransfer.setData("text/plain", id); // Store the dragged item's ID
      // No need to set state here if using dataTransfer, but keeping for visual cues
      setDraggedId(id);
      event.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (
      event: React.DragEvent<HTMLLIElement>,
      id: string
    ) => {
      event.preventDefault(); // Necessary to allow for dropping

      const targetRect = event.currentTarget.getBoundingClientRect();
      const relativeY = event.clientY - targetRect.top;

      // Determine if the drag is above or below the midpoint of the list item
      const position = relativeY < targetRect.height / 2 ? "above" : "below";
      setDragPosition(position);

      if (id === draggedId) return; // Ignore if dragging over itself
      setOverId(id); // Set the current item being dragged over
    };

    const handleDragLeave = (
      event: React.DragEvent<HTMLLIElement>,
      id: string
    ) => {
      event.preventDefault();
      setOverId(null); // Clear the drop target when leaving an item
    };

    const handleDrop = (event: React.DragEvent<HTMLLIElement>, id: string) => {
      event.preventDefault();
      const sourceId = event.dataTransfer.getData("text/plain"); // Retrieve the dragged item's ID
      const targetId = id;

      // console.log(sourceId, targetId);

      const model = getModelById(modelId);
      if (sourceId && modelId) {
        reorderAttributes(modelId, sourceId, targetId);
      }

      setDraggedId(null);
      setOverId(null);
    };
    // #endregion

    // #region useeffect
    useEffect(() => {
      updateNodeInternals(nodeId);
    }, [nodeId, field, modelId]);
    // #endregion

    return (
      <React.Fragment key={field.id}>
        {overId === field.id && dragPosition === "above" && !field.key && (
          <div style={{ height: "2px", backgroundColor: "red" }}></div>
        )}

        <ListItem
          sx={{
            backgroundColor: attributeId === id ? "#e0f7fa" : "#FAF9F6", // Highlight if selected
            mb: 2,
            "&:hover": {
              backgroundColor: attributeId === id ? "#b2ebf2" : "#f0f0f0", // Optional: change on hover
            },
          }}
          key={id}
          onClick={() => {
            handleSingleClick(id, dataType);
            // setSelectedId(id);
          }}
          onDragOver={(e) => handleDragOver(e, field.id)}
          onDragLeave={(e) => handleDragLeave(e, field.id)}
          onDrop={(e) => handleDrop(e, field.id)}
        >
          <Tooltip title={field.key ? "key" : "Click and Drag to Reorder"}>
            <ListItemIcon
              draggable={field.key ? false : true}
              onDragStart={(e) => handleDragStart(e, field.id)}
            >
              {field.key ? (
                <KeyOutlined color="primary" />
              ) : (
                <IconComponent color="primary" />
              )}
            </ListItemIcon>
          </Tooltip>
          <ListItemText sx={{ color: "black" }}>{name}</ListItemText>
          <Tooltip title={locked ? "Locked" : "Unlocked"}>
            <ListItemIcon>
              {locked ? (
                <LockOutlined color="error" />
              ) : (
                <LockOpenOutlined color="success" />
              )}
            </ListItemIcon>
          </Tooltip>
          <Tooltip title={notNull ? "Not nullable" : "Nullable"}>
            <ListItemIcon onClick={handleNotNullUpdate}>
              {notNull ? (
                <OutboundOutlined color="error" />
              ) : (
                <OutboundOutlined color="success" />
              )}
            </ListItemIcon>
          </Tooltip>
          <Tooltip title={isRemovable ? "Removable" : "Not removable"}>
            <ListItemIcon onClick={handleDeleteAttribute}>
              {isRemovable ? (
                <DeleteForeverOutlined color="success" />
              ) : (
                <DeleteForeverOutlined color="error" />
              )}
            </ListItemIcon>
          </Tooltip>

          <Box pl={1}>
            <HandleWrapper
              attributeId={id}
              dataType={dataType}
              dataSourceId={dataSourceId}
              toggleShowModel={toggleShowModel}
              nodeId={nodeId}
            />
          </Box>
        </ListItem>
        {overId === field.id && dragPosition === "below" && (
          <div style={{ height: "2px", backgroundColor: "red" }}></div> // Visual cue below item
        )}
      </React.Fragment>
    );
  }
);
