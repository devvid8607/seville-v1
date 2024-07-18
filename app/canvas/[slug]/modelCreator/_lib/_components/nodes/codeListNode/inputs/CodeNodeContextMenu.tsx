import { Box, Divider, Menu, MenuItem, Typography } from "@mui/material";
import { useCodeListStore } from "../../../../../../_lib/_nodes/codeListNode/store/CodeListStore";
import { useModelNodesStore } from "../../../../_store/modelStore/ModelNodesStore";
import useModelStore from "../../../../_store/modelStore/ModelDetailsFromBackendStore";
import { createCodeListNode } from "../../../../../../_lib/_helpers/createCodeListNode";
import { getAttributeIdFromHandle } from "../../../../_helpers/createModelData";
import { v4 as uuidv4 } from "uuid";
import { findLastChildWithProperties } from "../../../../_helpers/helperFunction";

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

export const CodeNodeContextMenu: React.FC<ContextMenuProps> = ({
  mouseX,
  mouseY,
  handleClose,
  nodeId,
  sourcePage,
}) => {
  const open = mouseX !== null && mouseY !== null;
  const { codeLists, getCodeById } = useCodeListStore((state) => ({
    codeLists: state.codeLists,
    getCodeById: state.getCodeById,
  }));

  const {
    getSourceNodeAndHandleByTargetNodeId,
    removeEdge,
    removeNodeAndDescendants,
    addEdge,
    addNode,
    currentNode,
  } = useModelNodesStore((state) => ({
    getSourceNodeAndHandleByTargetNodeId:
      state.getSourceNodeAndHandleByTargetNodeId,
    removeEdge: state.removeEdge,
    removeNodeAndDescendants: state.removeNodeAndDescendants,
    addEdge: state.addEdge,
    addNode: state.addNode,
    currentNode: state.currentNode,
  }));

  const {
    updateAttributeValueOfAModel,
    updatePropertyCurrentValue,
    getAttributeProperties,
    updatePropertyCurrentListValues,
  } = useModelStore((state) => ({
    updateAttributeValueOfAModel: state.updateAttributeValueOfAModel,
    updatePropertyCurrentValue: state.updatePropertyCurrentValue,
    getAttributeProperties: state.getAttributeProperties,
    updatePropertyCurrentListValues: state.updatePropertyCurrentListValues,
  }));

  if (!currentNode || currentNode === null) return;

  const handleReplace = (selectedModelId: string) => {
    console.log("handling replace");

    const currentDataSourceId = currentNode?.data.modelDetails.dataSourceId;

    if (currentDataSourceId && currentDataSourceId !== selectedModelId) {
      //starting to replace the model
      const selectedModel = getCodeById(selectedModelId);
      if (!selectedModel) return;

      if (currentNode) {
        const { connectingEdge, sourceHandleId, sourceNode } =
          getSourceNodeAndHandleByTargetNodeId(currentNode.id);
        if (connectingEdge && sourceHandleId && sourceNode) {
          removeEdge(connectingEdge.id);
          removeNodeAndDescendants(currentNode.id);
          const sourceDataSourceId = sourceNode?.data.modelDetails.dataSourceId;

          //add new node
          const newNodeId = uuidv4();
          const newNode = createCodeListNode(
            newNodeId,
            "",
            "",
            "",
            selectedModel.id,
            selectedModel.name,
            "codeListNode",
            //"model",
            undefined,
            currentNode.position
          );
          console.log(`newNode:`, newNode);

          addNode(newNode);

          // add new edge

          const newEdge = {
            id: uuidv4(),
            source: sourceNode.id,
            target: newNode.id,
            sourceHandle: sourceHandleId,
            type: "smoothstep",
          };
          console.log(`newEdge:`, newEdge);

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
                selectedModel.name
              );
              updatePropertyCurrentValue(
                sourceDataSourceId,
                attributeId,
                "1",
                selectedModel.id
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
          removeNodeAndDescendants(currentNode.id);
          const newNodeId = uuidv4();
          const newNode = createCodeListNode(
            newNodeId,
            "",
            "",
            "",
            selectedModel.id,
            selectedModel.name,
            "codeListNode",
            undefined,
            currentNode.position
          );
          console.log(`newNode:`, newNode);

          addNode(newNode);
        }
      }
    }

    handleClose();
  };
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
            Replace Code List
          </Typography>
        </MenuItem>
        <Divider />
        {codeLists.map((model) => (
          <MenuItem key={model.id} onClick={() => handleReplace(model.id)}>
            {model.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
