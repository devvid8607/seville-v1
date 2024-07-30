import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useTabStore } from "@/app/canvas/[slug]/_lib/_store/TabStateManagmentStore";
import { getAttributeIdFromHandle } from "../../../_helpers/createModelData";
import { createModelNode } from "@/app/canvas/[slug]/flowComponents/_lib/_helpers/createModelNode";
import useModelStore, {
  Model,
} from "../../../_store/modelStore/ModelDetailsFromBackendStore";
import { useModelNodesStore } from "../../../_store/modelStore/ModelNodesStore";
// import { useFlowNodeStore } from "../../../store/";
import { Node, useEdges } from "reactflow";
// import { validateAllNodesModelInputs } from "../../../Helpers/Canvas/CanvasValidation";
import { findLastChildWithProperties } from "../../../_helpers/helperFunction";
import { useToolboxStore } from "@/app/canvas/[slug]/_lib/_nodes/flowtoolbox/store/FlowToolBoxStore";
import {
  ToolBoxType,
  ToolboxCategory,
} from "../../../_queries/useToolBoxQueries";
import { queryClient } from "@/app/providers/QueryClientProvider";
import {
  fetchModelById,
  handleModelSelection,
} from "../../../_queries/useModelQueries";
import { useAllModelsStore } from "../../../_store/modelStore/AllModelsStore";
import { CloseOutlined } from "@mui/icons-material";

interface ContextMenuProps {
  mouseX: number | null;
  mouseY: number | null;
  handleClose: () => void;
  nodeId: string;
  sourcePage?: string;
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

type CombinedItem = {
  id: string;
  name: string;
};

export const ModelNodeContextMenu: React.FC<ContextMenuProps> = ({
  mouseX,
  mouseY,
  handleClose,
  nodeId,
  sourcePage,
}) => {
  console.log("rendering this menu", sourcePage);
  const open = mouseX !== null && mouseY !== null;

  const [errorText, setErrorText] = useState<string | null>(null);

  //#region store imports
  //#region useModelNodesStore imports
  const getSourceNodeAndHandleByTargetNodeId = useModelNodesStore(
    (state) => state.getSourceNodeAndHandleByTargetNodeId
  );
  const removeEdge = useModelNodesStore((state) => state.removeEdge);

  const removeNodeAndDescendants = useModelNodesStore(
    (state) => state.removeNodeAndDescendants
  );
  const addNode = useModelNodesStore((state) => state.addNode);
  const addEdge = useModelNodesStore((state) => state.addEdge);
  //#endregion
  //#region useModelStore imports
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
  const models = useModelStore((state) => state.models);
  const addModelToStore = useModelStore((state) => state.addModelToStore);
  //#endregion
  //#region usetabstore
  const replaceModelContextMenuSource = useTabStore(
    (state) => state.replaceModelContextMenuSource
  );
  const setSliderOpen = useTabStore((state) => state.setSliderOpen);
  //#endregion

  //#region toolbox imports
  const getItemsByType = useToolboxStore((state) => state.getItemsByType);
  const toolboxItems = useToolboxStore((state) => state.toolboxItems);
  //#endregion
  //#endregion

  // const { addFlowNode, removeFlowNode, getFlowNodeById, currentFlowNode } =
  //   useFlowNodeStore((state) => ({
  //     addFlowNode: state.addNode,
  //     removeFlowNode: state.removeNode,
  //     getFlowNodeById: state.getNodeById,
  //     currentFlowNode: state.currentNode,
  //   }));

  let currentNode: Node | null;
  currentNode = useModelNodesStore((state) => state.currentNode);
  // if (sourcePage === "validationSet") {
  //   currentNode = currentFlowNode;
  // } else {

  // }

  if (!currentNode || currentNode === null) return;

  const handleReplace = async (
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
      let selectedModel = getModelById(selectedModelId);
      if (!selectedModel) {
        //return;
        selectedModel = await handleModelSelection(selectedModelId);
        console.log("selectedmodel", selectedModel);
        //no model found from api
        if (!selectedModel) {
          setErrorText("Model Details not found");
        }
      }

      const { connectingEdge, sourceHandleId, sourceNode } =
        getSourceNodeAndHandleByTargetNodeId(currentNode.id);
      if (connectingEdge && sourceHandleId && sourceNode && selectedModel) {
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
        handleClose();
      } else if (selectedModel) {
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
        console.log(`newNode:`, newNode);
        addNode(newNode);
        handleClose();
      }
      // }
    }

    //handleClose();
  };
  // const [combinedModels, setCombinedModels] = useState<CombinedItem[]>([]);
  // useEffect(() => {
  //   const modelsFromModelStore = models.map((model) => ({
  //     id: model.modelId,
  //     name: model.modelName,
  //   }));

  //   const modelsFromToolboxStore = getItemsByType(ToolboxCategory.Model).map(
  //     (item) => ({
  //       id: item.configuration.entityId,
  //       name: item.name,
  //     })
  //   );

  //   const combinedMap: Record<string, CombinedItem> = {};

  //   modelsFromToolboxStore.forEach((item) => {
  //     combinedMap[item.id] = item;
  //   });

  //   modelsFromModelStore.forEach((item) => {
  //     combinedMap[item.id] = item; // This will overwrite if the id already exists
  //   });

  //   const combined = Object.values(combinedMap);
  //   setCombinedModels(combined);
  // }, [models, toolboxItems, getItemsByType]);
  const allModels = useAllModelsStore((state) => state.allModels);
  const fetchAndSetAllModels = useAllModelsStore(
    (state) => state.fetchAndSetAllModels
  );

  useEffect(() => {
    if (allModels.length === 0) fetchAndSetAllModels();
  }, [allModels]);

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
        {errorText ? <MenuItem>{errorText}</MenuItem> : ""}
        {allModels.length > 0 ? (
          allModels.map((model) => (
            <MenuItem
              key={model.id}
              onClick={(e) => handleReplace(e, model.id)}
            >
              {model.name}
            </MenuItem>
          ))
        ) : (
          <div>
            <CircularProgress />
          </div>
        )}
      </Menu>
    </Box>
  );
};
