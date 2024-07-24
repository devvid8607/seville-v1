import * as MuiIcons from "@mui/icons-material";
import { DragHandleOutlined, LockOpen } from "@mui/icons-material";
import { Box, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getAttributeIdFromHandle } from "../../../_helpers/createModelData";
import { createModelNode } from "@/app/canvas/[slug]/flowComponents/_lib/_helpers/createModelNode";
import useModelBackendStore from "../../../_store/modelStore/ModelBackEndStore";
import useModelStore from "../../../_store/modelStore/ModelDetailsFromBackendStore";
import { useModelNodesStore } from "../../../_store/modelStore/ModelNodesStore";
import { useTabStore } from "../../../../../_lib/_store/TabStateManagmentStore";
import { ModelNodeContextMenu } from "./ModelNodeContextMenu";
import { Edge } from "reactflow";
import { findLastChildWithProperties } from "../../../_helpers/helperFunction";

// #region types and functions
interface ModelHeaderProps {
  nodeId: string;
  modelId: string;
}

// function findLastChildWithProperties(data: ListItem[]): any[] | null {
//   let lastProperties = null;

//   for (const item of data) {
//     if (item.properties && item.properties.length > 0) {
//       lastProperties = item.properties; // Update last found properties
//     }
//     if (item.children.length > 0) {
//       const childProperties = findLastChildWithProperties(item.children);
//       if (childProperties) {
//         lastProperties = childProperties; // Update with deeper nested properties
//       }
//     }
//   }

//   return lastProperties;
// }

const isRootNode = (nodeId: string, edges: Edge[]): boolean => {
  return !edges.some((edge) => edge.target === nodeId);
};
// #endregion

export const ModelHeader: React.FC<ModelHeaderProps> = ({
  nodeId,
  modelId,
}) => {
  // #region imports

  // #region useModelNodesStore imports
  const removeNodeAndDescendants = useModelNodesStore(
    (state) => state.removeNodeAndDescendants
  );
  const removeIncomingEdgesByNodeId = useModelNodesStore(
    (state) => state.removeIncomingEdgesByNodeId
  );
  const addNode = useModelNodesStore((state) => state.addNode);
  const getNodeById = useModelNodesStore((state) => state.getNodeById);
  const getSourceNodeAndHandleByTargetNodeId = useModelNodesStore(
    (state) => state.getSourceNodeAndHandleByTargetNodeId
  );
  const nodes = useModelNodesStore((state) => state.nodes);
  const edges = useModelNodesStore((state) => state.edges);
  const removeOutgoingEdgesFromNodeAndDescendants = useModelNodesStore(
    (state) => state.removeOutgoingEdgesFromNodeAndDescendants
  );
  const addEdge = useModelNodesStore((state) => state.addEdge);
  // #endregion

  // #region useModelStore imports
  const cloneModel = useModelStore((state) => state.cloneModel);
  const getModelById = useModelStore((state) => state.getModelById);
  const updateModelProperty = useModelStore(
    (state) => state.updateModelProperty
  );
  const updatePropertyCurrentValue = useModelStore(
    (state) => state.updatePropertyCurrentValue
  );
  const { getAttributeProperties, updatePropertyCurrentListValues } =
    useModelStore((state) => ({
      getAttributeProperties: state.getAttributeProperties,
      updatePropertyCurrentListValues: state.updatePropertyCurrentListValues,
    }));

  const { models } = useModelStore();

  const updateAttributeValueOfAModel = useModelStore(
    (state) => state.updateAttributeValueOfAModel
  );
  const removeAllAttributesFromModel = useModelStore(
    (state) => state.removeAllAttributesFromModel
  );
  // #endregion

  // #region useTabStore imports
  const showNodeContextMenu = useTabStore((state) => state.showNodeContextMenu);
  const setSliderOpen = useTabStore((state) => state.setSliderOpen);

  const setActiveTabIndex = useTabStore((state) => state.setActiveTabIndex);
  const setModelId = useTabStore((state) => state.setModelId);
  const setIsModelPropertyShowing = useTabStore(
    (state) => state.setIsModelPropertyShowing
  );
  const sliderOpen = useTabStore((state) => state.sliderOpen);

  const nodeContextMenuPosition = useTabStore(
    (state) => state.nodeContextMenuPosition
  );
  const setShowNodeContextMenu = useTabStore(
    (state) => state.setShowNodeContextMenu
  );
  const setReplaceModelContextMenuSource = useTabStore(
    (state) => state.setReplaceModelContextMenuSource
  );
  // #endregion

  // const { modelNodeSchemas } = useModelBackendStore();
  // #endregion

  // #region state vars
  let model = models.find((model) => model.modelId === modelId);
  // const IconComponent =
  //   MuiIcons[modelNodeSchemas.icon as keyof typeof MuiIcons];
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempFriendlyName, setTempFriendlyName] = useState<string>(
    model?.modelFriendlyName || ""
  );
  //#endregion

  // #region eventhandlers
  const handleMinimizeNode = (event: React.MouseEvent) => {
    event.stopPropagation();
    const rootNodes = nodes.filter((node) => isRootNode(node.id, edges));

    // Check if the current node is a root node
    const isCurrentNodeRoot = isRootNode(nodeId, edges);
    if (rootNodes.length <= 1 && isCurrentNodeRoot) {
      alert(
        "Minimization not allowed: this is the only root node on the canvas."
      );
    } else {
      removeIncomingEdgesByNodeId(nodeId);
      removeNodeAndDescendants(nodeId);
    }
  };

  const handleCopyClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    ///working code
    //clone model and add it to the model
    if (modelId) {
      const result = cloneModel(modelId, "");
      const newNodeId = uuidv4();
      const currentNode = getNodeById(nodeId);
      if (result && result.newModelId && result.newModelName) {
        //created new rweact flow node
        const newNode = createModelNode(
          newNodeId,
          result.newModelId,
          result.newModelName,
          "modelNode",
          undefined,
          currentNode?.position
        );
        //added new node to the store
        addNode(newNode);
        //create a new edge
        const { sourceNode, sourceHandleId } =
          getSourceNodeAndHandleByTargetNodeId(nodeId);
        if (sourceNode && sourceHandleId) {
          const newEdge = {
            id: uuidv4(),
            source: sourceNode.id,
            target: newNodeId,
            sourceHandle: sourceHandleId,
            type: "smoothstep",
          };
          const currentDataSource = sourceNode?.data.modelDetails.dataSourceId;
          console.log(currentNode);
          addEdge(newEdge);
          const attributeId = getAttributeIdFromHandle(sourceHandleId);
          if (attributeId) {
            updateAttributeValueOfAModel(
              currentDataSource,
              attributeId,
              "dataSourceId",
              result.newModelId
            );
            updateAttributeValueOfAModel(
              currentDataSource,
              attributeId,
              "dataSourceFriendlyName",
              result.newModelName
            );
            updatePropertyCurrentValue(
              currentDataSource,
              attributeId,
              "1",
              result.newModelId
            );

            const attributeProperties = getAttributeProperties(
              currentDataSource,
              attributeId
            );
            console.log("attribute:", attributeProperties);
            if (attributeProperties) {
              attributeProperties.map((attributeProp: any) => {
                if (
                  attributeProp.currentListValues &&
                  attributeProp.currentListValues.length > 0
                ) {
                  const lastChildProperties = findLastChildWithProperties(
                    attributeProp.currentListValues
                  );
                  console.log("lastChildProperties", lastChildProperties);
                  lastChildProperties?.map((childProp) => {
                    childProp.currentValue = result.newModelId;
                  });
                  updatePropertyCurrentListValues(
                    currentDataSource,
                    attributeId,
                    "1",
                    attributeProp.currentListValues
                  );
                }
              });
            }
          }
        }
        //remove old edges and nodes
        removeIncomingEdgesByNodeId(nodeId);
        removeNodeAndDescendants(nodeId);
      }
    }

    //working code ends
  };

  const handleReplaceNodeContextMenu = (event: React.MouseEvent) => {
    //event.stopPropagation();
    event.preventDefault();
    // Adjust these values as needed

    const offsetX = -2; // Move slightly to the left
    const offsetY = 4; // Move slightly down from the click position
    const position = {
      mouseX: event.clientX + offsetX,
      mouseY: event.clientY + offsetY,
    };

    setShowNodeContextMenu(true, position);
  };

  const handleClose = () => {
    setShowNodeContextMenu(false);
  };

  const handleDeleteAllAttributes = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (modelId) {
      removeAllAttributesFromModel(modelId);
    }
    if (nodeId) {
      removeOutgoingEdgesFromNodeAndDescendants(nodeId);
    }
  };

  const handleModelHeaderSingleClick = () => {
    setReplaceModelContextMenuSource("modelNode");
    if (modelId) setModelId(modelId);
    setIsModelPropertyShowing(true);
    setActiveTabIndex(1);
    if (!sliderOpen) setSliderOpen(true);
  };

  const handleDoubleClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    setIsEditing(true);
    setTempFriendlyName(model?.modelFriendlyName || "");
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempFriendlyName(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Logic to update the model's friendly name with tempFriendlyName
      console.log("Updated modelFriendlyName with:", tempFriendlyName);
      if (modelId && tempFriendlyName !== "")
        updateModelProperty(modelId, "modelFriendlyName", tempFriendlyName);

      setIsEditing(false);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Similarly, handle the logic to update model's friendly name on blur
    console.log("Updated modelFriendlyName with:", tempFriendlyName);
    if (modelId && tempFriendlyName !== "")
      updateModelProperty(modelId, "modelFriendlyName", tempFriendlyName);
    setIsEditing(false);
  };
  // #endregion

  // #region useeffect
  useEffect(() => {
    setTempFriendlyName(model?.modelFriendlyName || "");
  }, [modelId]);
  //#endregion

  return (
    <>
      <Box onClick={handleModelHeaderSingleClick}>
        <Box
          sx={{
            backgroundColor: model && model.isClone ? "#F0F3FF" : "#F0F3FF",
            borderBottom: "1px solid #aaa",
            height: "auto",
            pt: 2,
            pb: 2,
            gap: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              paddingLeft: 2,
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 4,
                height: 4,
                mr: 2,
                ml: 1,
              }}
            >
              <MuiIcons.SchemaOutlined />
            </Box>
            {isEditing ? (
              <TextField
                type="text"
                value={tempFriendlyName}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            ) : (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  m: 0,
                  whiteSpace: "nowrap",
                }}
                onDoubleClick={handleDoubleClick}
              >
                {model?.modelFriendlyName}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="" sx={{ cursor: "pointer", marginRight: 1 }}>
              <LockOpen />
            </Tooltip>
            <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
              <Tooltip title="Replace Node">
                <IconButton
                  aria-label="copy"
                  size="small"
                  onClick={handleReplaceNodeContextMenu}
                >
                  <MuiIcons.MoreVertOutlined sx={{ color: "black" }} />{" "}
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
              <Tooltip title="Copy Node">
                <IconButton
                  aria-label="copy"
                  size="small"
                  onClick={handleCopyClick}
                >
                  <MuiIcons.ContentCopyOutlined sx={{ color: "black" }} />{" "}
                  {/* Use the appropriate icon for copying */}
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
              <Tooltip title="Minimize Node">
                <IconButton
                  aria-label="minimize"
                  size="small"
                  onClick={handleMinimizeNode}
                  sx={{ pb: 2 }}
                >
                  <MuiIcons.MinimizeOutlined sx={{ color: "black" }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
              <Tooltip title="Delete All Attributes">
                <IconButton
                  aria-label="minimize"
                  size="small"
                  onClick={handleDeleteAllAttributes}
                >
                  <MuiIcons.CleaningServicesOutlined sx={{ color: "black" }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
              <span className="custom-drag-handle">
                <Tooltip title="Drag Node">
                  <DragHandleOutlined />
                </Tooltip>
              </span>
            </Box>
          </Box>
        </Box>
        {showNodeContextMenu && (
          <ModelNodeContextMenu
            mouseX={nodeContextMenuPosition?.mouseX ?? null}
            mouseY={nodeContextMenuPosition?.mouseY ?? null}
            handleClose={handleClose}
            nodeId={nodeId}
          />
        )}
      </Box>
    </>
  );
};
