import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useModelStore from "../../../store/modelStore/ModelDetailsFromBackendStore";
import { Box, Button, Divider, ListSubheader, Typography } from "@mui/material";
import { useModelNodesStore } from "../../../store/modelStore/ModelNodesStore";
import { createModelNode } from "../../../helpers/createModelNode";
import { v4 as uuidv4 } from "uuid";
import { getAttributeIdFromHandle } from "../../../helpers/createModelData";
import { useTabStore } from "../../../store/TabStateManagmentStore";
// import { useFlowNodeStore } from "../../../store/";
import { Node } from "reactflow";
// import { validateAllNodesModelInputs } from "../../../Helpers/Canvas/CanvasValidation";
import { ListItem } from "../../sidebarTabComponents/propertiesTab/components/RecursiveDropdownv3";

interface ContextMenuProps {
  mouseX: number | null;
  mouseY: number | null;
  handleClose: () => void;
  nodeId: string;
  sourcePage?: string;
}

function findLastChildWithProperties(data: ListItem[]): any[] | null {
  let lastProperties = null;

  for (const item of data) {
    if (item.properties && item.properties.length > 0) {
      lastProperties = item.properties; // Update last found properties
    }
    if (item.children.length > 0) {
      const childProperties = findLastChildWithProperties(item.children);
      if (childProperties) {
        lastProperties = childProperties; // Update with deeper nested properties
      }
    }
  }

  return lastProperties;
}

export const ModelNodeContextMenu: React.FC<ContextMenuProps> = ({
  mouseX,
  mouseY,
  handleClose,
  nodeId,
  sourcePage,
}) => {
  console.log("rendering this menu", sourcePage);
  const open = mouseX !== null && mouseY !== null;
  const getNodeById = useModelNodesStore((state) => state.getNodeById);

  const getSourceNodeAndHandleByTargetNodeId = useModelNodesStore(
    (state) => state.getSourceNodeAndHandleByTargetNodeId
  );
  const removeEdge = useModelNodesStore((state) => state.removeEdge);
  const removeNodeById = useModelNodesStore((state) => state.removeNodeById);
  const removeNodeAndDescendants = useModelNodesStore(
    (state) => state.removeNodeAndDescendants
  );
  const addNode = useModelNodesStore((state) => state.addNode);
  const addEdge = useModelNodesStore((state) => state.addEdge);
  // const currentNode = useModelNodesStore((state) => state.currentNode);

  const getModelById = useModelStore((state) => state.getModelById);
  const updateAttributeValueOfAModel = useModelStore(
    (state) => state.updateAttributeValueOfAModel
  );
  const updatePropertyCurrentValue = useModelStore(
    (state) => state.updatePropertyCurrentValue
  );
  const { getAttributeProperties, updatePropertyCurrentListValues } =
    useModelStore((state) => ({
      getAttributeProperties: state.getAttributeProperties,
      updatePropertyCurrentListValues: state.updatePropertyCurrentListValues,
    }));

  const replaceModelContextMenuSource = useTabStore(
    (state) => state.replaceModelContextMenuSource
  );

  const setSliderOpen = useTabStore((state) => state.setSliderOpen);
  // const { addFlowNode, removeFlowNode, getFlowNodeById, currentFlowNode } =
  //   useFlowNodeStore((state) => ({
  //     addFlowNode: state.addNode,
  //     removeFlowNode: state.removeNode,
  //     getFlowNodeById: state.getNodeById,
  //     currentFlowNode: state.currentNode,
  //   }));

  let currentNode: Node | null;
  // if (sourcePage === "validationSet") {
  //   currentNode = currentFlowNode;
  // } else {
  currentNode = useModelNodesStore((state) => state.currentNode);
  // }

  if (!currentNode || currentNode === null) return;

  const handleReplace = (
    e: React.MouseEvent<HTMLLIElement>,
    selectedModelId: string
  ) => {
    e.stopPropagation();
    console.log("handling replace");
    setSliderOpen(false);
    const currentDataSourceId = currentNode?.data.modelDetails.dataSourceId;

    if (
      currentDataSourceId &&
      currentDataSourceId !== selectedModelId &&
      currentNode
    ) {
      //starting to replace the model
      const selectedModel = getModelById(selectedModelId);
      if (!selectedModel) return;

      // if (sourcePage === "validationSet") {
      //   console.log("sourcePage is ", sourcePage);
      //   const newNodeId = uuidv4();
      //   const newNode = createModelNode(
      //     newNodeId,
      //     selectedModel.modelId,
      //     selectedModel.modelName,
      //     "inputNode",
      //     undefined,
      //     currentNode?.position,
      //     sourcePage
      //   );
      //   addFlowNode(newNode);
      //   if (currentNode) removeFlowNode(currentNode.id);
      //   validateAllNodesModelInputs(selectedModel.modelId);
      // } else if (currentNode) {

      const { connectingEdge, sourceHandleId, sourceNode } =
        getSourceNodeAndHandleByTargetNodeId(currentNode.id);
      if (connectingEdge && sourceHandleId && sourceNode) {
        removeEdge(connectingEdge.id);
        removeNodeAndDescendants(currentNode.id);
        const sourceDataSourceId = sourceNode?.data.modelDetails.dataSourceId;

        //add new node
        const newNodeId = uuidv4();
        const newNode = createModelNode(
          newNodeId,
          selectedModel.modelId,
          selectedModel.modelName,
          replaceModelContextMenuSource,
          //"model",
          undefined,
          currentNode.position
        );
        console.log(`newNode:`, newNode); // Log the new node object to verify its properties

        addNode(newNode);

        // add new edge

        const newEdge = {
          id: uuidv4(),
          source: sourceNode.id,
          target: newNode.id,
          sourceHandle: sourceHandleId,
          type: "smoothstep",
        };
        console.log(`newEdge:`, newEdge); // Log the new edge object to check its properties

        addEdge(newEdge);

        if (sourceHandleId) {
          const attributeId = getAttributeIdFromHandle(sourceHandleId);

          if (attributeId) {
            updateAttributeValueOfAModel(
              sourceDataSourceId,
              attributeId,
              "dataSourceId",
              selectedModelId
            );
            updateAttributeValueOfAModel(
              sourceDataSourceId,
              attributeId,
              "dataSourceFriendlyName",
              selectedModel.modelName
            );
            updatePropertyCurrentValue(
              sourceDataSourceId,
              attributeId,
              "1",
              selectedModel.modelId
            );
            const attributeProperties = getAttributeProperties(
              sourceDataSourceId,
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
                    childProp.currentValue = selectedModelId;
                  });
                  updatePropertyCurrentListValues(
                    sourceDataSourceId,
                    attributeId,
                    "1",
                    attributeProp.currentListValues
                  );
                }
              });
            }
          }
        }
      } else {
        // alert("only single node");
        removeNodeAndDescendants(currentNode.id);
        const newNodeId = uuidv4();
        const newNode = createModelNode(
          newNodeId,
          selectedModel.modelId,
          selectedModel.modelName,
          replaceModelContextMenuSource,
          // "model",
          undefined,
          currentNode.position
        );
        console.log(`newNode:`, newNode); // Log the new node object to verify its properties

        addNode(newNode);
      }
      // }
    }

    handleClose();
  };
  const models = useModelStore((state) => state.models);

  return (
    <Box>
      <Menu
        keepMounted
        open={open}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          mouseX !== null && mouseY !== null
            ? { top: mouseY, left: mouseX }
            : undefined
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPaper-root": {
            minWidth: "240px",
          },
        }}
      >
        <MenuItem disabled sx={{ justifyContent: "center", opacity: 1 }}>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ fontWeight: "bold", color: "purple" }}
          >
            Replace Model
          </Typography>
        </MenuItem>
        <Divider />
        {models.map((model) => (
          <MenuItem
            key={model.modelId}
            onClick={(e) => handleReplace(e, model.modelId)}
          >
            {model.modelName}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
