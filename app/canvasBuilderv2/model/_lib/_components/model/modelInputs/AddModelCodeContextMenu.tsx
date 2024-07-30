import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { v4 as uuidv4 } from "uuid";

import { useTabStore } from "@/app/canvas/[slug]/_lib/_store/TabStateManagmentStore";
import {
  createModelData,
  getAttributeIdFromHandle,
  getDataTypeFromHandle,
  getNodeIDFromHandle,
} from "../../../_helpers/createModelData";
import { useModelNodesStore } from "../../../_store/modelStore/ModelNodesStore";
import { createModelNode } from "@/app/canvas/[slug]/flowComponents/_lib/_helpers/createModelNode";

import useModelStore from "../../../_store/modelStore/ModelDetailsFromBackendStore";
// import propertiesData from "../../../../../../canvas/[slug]/_lib/dummyData/typeProperties.json";
import { Box } from "@mui/material";
import { SmallModelDropdown } from "@/app/canvas/[slug]/_lib/_components/sidebarTabComponents/propertiesTab/components/SmallModelDropDown";
import useDataTypesStore from "@/app/canvas/[slug]/_lib/_store/DataTypesStore";

export const AddModelCodeContextMenu = () => {
  // #region store imports
  const { showContextMenu, setShowContextMenu, menuPosition, handleId } =
    useTabStore((state) => ({
      showContextMenu: state.showContextMenu,
      setShowContextMenu: state.setShowContextMenu,
      menuPosition: state.menuPosition,
      handleId: state.handleId,
    }));

  const getDataTypeByCode = useDataTypesStore(
    (state) => state.getDataTypeByCode
  );

  // #region useModelStore imports
  const addModelToStore = useModelStore((state) => state.addModelToStore);
  const updatePropertyCurrentValue = useModelStore(
    (state) => state.updatePropertyCurrentValue
  );
  const updateAttributeValueOfAModel = useModelStore(
    (state) => state.updateAttributeValueOfAModel
  );
  const updateProperties = useModelStore((state) => state.updateProperties);
  const getModelById = useModelStore((state) => state.getModelById);
  const cloneModel = useModelStore((state) => state.cloneModel);
  // #endregion

  // #region useModelNodeStore imports
  const getNodeById = useModelNodesStore((state) => state.getNodeById);

  const addNode = useModelNodesStore((state) => state.addNode);
  const addEdge = useModelNodesStore((state) => state.addEdge);
  // #endregion

  // #endregion

  const dropdownprop: any = {
    id: "1",
    type: "modeldropdown",
    label: "Default",
    tooltip: "Default Value",
    placeholder: "",
    visible: true,
    required: true,
    enabled: true,
    size: "small",
    defaultValue: "",
    currentValue: "",
    propertyName: "defaultValue",

    config: {
      fromApi: true,
      ApiURL: "",
    },
  };

  const handleClose = () => {
    setShowContextMenu(false); // Hide the context menu
  };

  const addNewModel = () => {
    console.log("hanldeId", handleId);
    setShowContextMenu(false);

    //new model created and added to store
    const newModel = createModelData();
    addModelToStore(newModel);
    //alert(handleId);
    if (handleId) {
      console.log(`handleId: ${handleId}`); // Log the handleId to verify it's being captured correctly

      const currentNodeId = getNodeIDFromHandle(handleId);
      const currentAttributeId = getAttributeIdFromHandle(handleId);
      const currentDataType = getDataTypeFromHandle(handleId);
      console.log(`currentNodeId: ${currentNodeId}`); // Log the currentNodeId to check the retrieved ID

      if (currentNodeId && currentAttributeId) {
        const currentNode = getNodeById(currentNodeId);
        if (currentNode) {
          const currentNodeDataSource =
            currentNode?.data.modelDetails.dataSourceId;
          console.log(`currentNodeDataSource: ${currentNodeDataSource}`); // Log the dataSourceId to ensure it's correct
          const newNodeId = uuidv4();
          console.log(`newNodeId: ${newNodeId}`); // Log the new node's ID for tracking

          const newNode = createModelNode(
            newNodeId,
            newModel.modelId,
            newModel.modelName,
            "modelNode",
            currentNode
          );
          console.log(`newNode:`, newNode); // Log the new node object to verify its properties

          addNode(newNode);
          console.log(`Node added with ID: ${newNode.id}`); // Confirm that the node has been added

          const newSourceHandle = `handle|nd|${currentNode.id}|attr|${currentAttributeId}|dt|model`;
          // Create edge from source to new node
          const newEdge = {
            id: uuidv4(),
            source: currentNode.id,
            target: newNode.id,
            sourceHandle: newSourceHandle,
            type: "smoothstep",
          };
          console.log(`newEdge:`, newEdge); // Log the new edge object to check its properties

          addEdge(newEdge);
          console.log(`Edge added with ID: ${newEdge.id}`); // Confirm that the edge has been added

          updateAttributeValueOfAModel(
            currentNodeDataSource,
            currentAttributeId,
            "dataSourceId",
            newModel.modelId
          );
          updateAttributeValueOfAModel(
            currentNodeDataSource,
            currentAttributeId,
            "dataSourceFriendlyName",
            newModel.modelName
          );
          updateAttributeValueOfAModel(
            currentNodeDataSource,
            currentAttributeId,
            "dataType",
            "model"
          );
          let properties = getDataTypeByCode("model");
          // const properties = (propertiesData as any)["model"]?.Properties || [];
          if (properties) {
            updateProperties(
              currentNodeDataSource,
              currentAttributeId,
              properties?.properties
            );
          }

          updatePropertyCurrentValue(
            currentNodeDataSource,
            currentAttributeId,
            "1",
            newModel.modelId
          );
        }

        // Create new node with these details and add to node store
      }
    } else {
      console.log("No handleId provided."); // Inform if the initial handleId is missing or undefined
    }
  };

  const handleModelChangeDropDown = (newValue: string) => {
    console.log(handleId);

    const selectedModel = getModelById(newValue);
    if (handleId && selectedModel) {
      const currentNodeId = getNodeIDFromHandle(handleId);
      const currentAttributeId = getAttributeIdFromHandle(handleId);
      if (currentNodeId && currentAttributeId) {
        const currentNode = getNodeById(currentNodeId);
        if (currentNode) {
          const currentNodeDataSource =
            currentNode?.data.modelDetails.dataSourceId;
          const newNodeId = uuidv4();
          const newNode = createModelNode(
            newNodeId,
            selectedModel.modelId,
            selectedModel.modelName,
            "modelNode",
            currentNode
          );
          addNode(newNode);
          const newSourceHandle = `handle|nd|${currentNode.id}|attr|${currentAttributeId}|dt|model`;
          const newEdge = {
            id: uuidv4(),
            source: currentNode.id,
            target: newNode.id,
            sourceHandle: newSourceHandle,
            type: "smoothstep",
          };
          addEdge(newEdge);

          updateAttributeValueOfAModel(
            currentNodeDataSource,
            currentAttributeId,
            "dataSourceId",
            selectedModel.modelId
          );
          updateAttributeValueOfAModel(
            currentNodeDataSource,
            currentAttributeId,
            "dataSourceFriendlyName",
            selectedModel.modelName
          );
          updateAttributeValueOfAModel(
            currentNodeDataSource,
            currentAttributeId,
            "dataType",
            "model"
          );
          //const properties = (propertiesData as any)["model"]?.Properties || [];
          const properties = getDataTypeByCode("model");
          if (properties)
            updateProperties(
              currentNodeDataSource,
              currentAttributeId,
              properties?.properties
            );
          updatePropertyCurrentValue(
            currentNodeDataSource,
            currentAttributeId,
            "1",
            selectedModel.modelId
          );
        }
      }
    }
  };

  const copyModel = (newValue: string) => {
    console.log(`Starting model copy with newValue: ${newValue}`); // Log the starting of the operation with the input value
    const result = cloneModel(newValue, "");
    console.log(`cloneModel result:`, result); // Log the result of cloning the model

    const newNodeId = uuidv4();
    console.log(`Generated newNodeId: ${newNodeId}`); // Log the newly generated node ID

    if (handleId) {
      console.log(`handleId: ${handleId}`); // Log the handleId to verify it's being captured correctly

      const currentNodeId = getNodeIDFromHandle(handleId);
      const currentAttributeId = getAttributeIdFromHandle(handleId);
      console.log(
        `currentNodeId: ${currentNodeId}, currentAttributeId: ${currentAttributeId}`
      ); // Log both currentNodeId and currentAttributeId

      if (
        result &&
        result.newModelId &&
        result.newModelName &&
        currentNodeId &&
        currentAttributeId
      ) {
        const currentNode = getNodeById(currentNodeId);
        console.log(`currentNode:`, currentNode); // Log the current node object
        const currentNodeDataSource =
          currentNode?.data.modelDetails.dataSourceId;
        if (currentNode) {
          const newNode = createModelNode(
            newNodeId,
            result.newModelId,
            result.newModelName,
            "modelNode",
            currentNode
          );
          console.log(`New node created:`, newNode); // Log the newly created node object

          // Added new node to the store
          addNode(newNode);
          console.log(`New node added to store with ID: ${newNodeId}`); // Confirm the node has been added
          const newSourceHandle = `handle|nd|${currentNode.id}|attr|${currentAttributeId}|dt|model`;
          const newEdge = {
            id: uuidv4(),
            source: currentNodeId,
            target: newNodeId,
            sourceHandle: newSourceHandle,
            type: "smoothstep",
          };
          addEdge(newEdge);
          console.log(`New edge created and added:`, newEdge); // Log the new edge object

          // Logging updates made to attributes and properties
          console.log(
            `Updating attribute and property values for node ${currentNodeId} and attribute ${currentAttributeId}`
          );
          updateAttributeValueOfAModel(
            currentNodeDataSource,
            currentAttributeId,
            "dataSourceId",
            result.newModelId
          );
          updateAttributeValueOfAModel(
            currentNodeDataSource,
            currentAttributeId,
            "dataSourceFriendlyName",
            result.newModelName
          );
          updateAttributeValueOfAModel(
            currentNodeDataSource,
            currentAttributeId,
            "dataType",
            "model"
          );
          const properties = getDataTypeByCode("model");
          // const properties = (propertiesData as any)["model"]?.Properties || [];
          if (properties)
            updateProperties(
              currentNodeId,
              currentAttributeId,
              properties?.properties
            );
          console.log(
            `Properties updated for node ${currentNodeId} and attribute ${currentAttributeId}`
          );

          updatePropertyCurrentValue(
            currentNodeDataSource,
            currentAttributeId,
            "1",
            result.newModelId
          );
          console.log(
            `Property current value updated for node ${currentNodeId} and attribute ${currentAttributeId}`
          );
        } else {
          console.log(`No current node found with ID: ${currentNodeId}`);
        }
      } else {
        console.log(
          `Missing data: result, currentNodeId, or currentAttributeId is null or undefined.`
        );
      }
    } else {
      console.log("No handleId provided.");
    }
  };

  const getMenuItems = () => {
    return [
      <MenuItem key="add-new-model" onClick={addNewModel}>
        Add New Model
      </MenuItem>,
      <MenuItem
        key="connect-existing-model"
        onClick={handleClose}
        sx={{ display: "block", width: "100%" }}
      >
        Connect Existing Model
        <Box sx={{ width: "100%", pt: 1 }}>
          {/* Box is a utility component for styling */}
          <SmallModelDropdown
            {...dropdownprop} // Ensure props are correctly passed
            getModelPropsFromAPI={(newValue: any) => {
              handleModelChangeDropDown(newValue);
            }}
          />
        </Box>
      </MenuItem>,
      <MenuItem
        key="copy-existing-model"
        onClick={handleClose}
        sx={{ display: "block", width: "100%" }}
      >
        Copy Existing Model
        <Box sx={{ width: "100%", pt: 1 }}>
          {/* Box is a utility component for styling */}
          <SmallModelDropdown
            {...dropdownprop} // Ensure props are correctly passed
            getModelPropsFromAPI={(newValue: any) => {
              copyModel(newValue);
            }}
          />
        </Box>
      </MenuItem>,
    ];
  };

  return (
    <Menu
      open={showContextMenu}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        menuPosition ? { top: menuPosition.y, left: menuPosition.x } : undefined
      }
    >
      {getMenuItems()}
    </Menu>
  );
};
