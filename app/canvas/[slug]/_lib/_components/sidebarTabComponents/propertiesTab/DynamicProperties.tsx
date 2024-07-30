import { Box, Grid, Paper, Typography } from "@mui/material";
import React, { useCallback } from "react";
// import useModelNodeDataStore from "../../Store/SevilleModelNodeStore";
import useModelStore from "@/app/canvasBuilderv2/model/_lib/_store/modelStore/ModelDetailsFromBackendStore";
import { useModelNodesStore } from "@/app/canvasBuilderv2/model/_lib/_store/modelStore/ModelNodesStore";
import { useTabStore } from "../../../_store/TabStateManagmentStore";
import RecursiveDropdownv3 from "./components/RecursiveDropdownv3";
import { SmallCheckbox } from "./components/SmallCheckBox";
import { SmallDropdown } from "./components/SmallDropdown";
import { SmallModelDropdown } from "./components/SmallModelDropDown";
import { SmallNumberField } from "./components/SmallNumberField";
import { SmallRadioGroup } from "./components/SmallRadioGroup";
import { SmallRating } from "./components/SmallRating";
import { SmallSlider } from "./components/SmallSlider";
import { SmallSwitch } from "./components/SmallSwitch";
import { SmallTextField } from "./components/SmallTextField";
import { SmallToggleButton } from "./components/SmallToggleButton";
import { CodeListDropdown } from "./components/CodeListDropdown";
import { useCodeListStore } from "../../../_nodes/codeListNode/store/CodeListStore";

export const DynamicProperties: React.FC = React.memo(() => {
  //#region store imports

  //#region tabstore imports
  const attributeId = useTabStore((state) => state.attributeId);
  const modelId = useTabStore((state) => state.modelId);
  const isModelPropertyShowing = useTabStore(
    (state) => state.isModelPropertyShowing
  );
  //#endregion

  //#region useModelNodesStore imports
  const currentNode = useModelNodesStore((state) => state.currentNode);
  const getConnectedTargetNodeAndEdgeIdByHandle = useModelNodesStore(
    (state) => state.getConnectedTargetNodeAndEdgeIdByHandle
  );
  const removeEdge = useModelNodesStore((state) => state.removeEdge);
  const removeNodeById = useModelNodesStore((state) => state.removeNodeById);
  //#endregion

  //#region useModelStore imports
  const properties = useModelStore(
    useCallback(
      (state) => state.getAttributeProperties(modelId, attributeId),
      [modelId, attributeId]
    )
  );
  const updatePropertyCurrentValue = useModelStore(
    (state) => state.updatePropertyCurrentValue
  );
  const updateAttributeValueOfAModel = useModelStore(
    (state) => state.updateAttributeValueOfAModel
  );
  const updatePropertyCurrentListValues = useModelStore(
    (state) => state.updatePropertyCurrentListValues
  );

  const getModelById = useModelStore((state) => state.getModelById);
  //#endregion

  const getCodeById = useCodeListStore((state) => state.getCodeById);

  //#endregion

  if (!properties) return;
  const handleUpdatePropValueToStore = (propId: any, newValue: any) => {
    console.log("TBD", newValue, propId);
    updatePropertyCurrentValue(modelId, attributeId, propId, newValue);
  };

  const handleModelConnection = (newValue: any) => {
    //case where node is expanded and user trying to connect to another model

    if (currentNode) {
      //construct the handle id
      const handleId = `handle|nd|${currentNode.id}|attr|${attributeId}|dt|model`;
      const { edgeId, targetNode } = getConnectedTargetNodeAndEdgeIdByHandle(
        currentNode.id,
        handleId
      );
      if (edgeId) removeEdge(edgeId);
      if (targetNode) removeNodeById(targetNode.id);
    }
    const selectedModel = getModelById(newValue);
    console.log("TBD");
    if (selectedModel) {
      updateAttributeValueOfAModel(
        modelId,
        attributeId,
        "dataSourceId",
        newValue
      );
      updateAttributeValueOfAModel(
        modelId,
        attributeId,
        "dataSourceFriendlyName",
        selectedModel.modelName
      );
      updatePropertyCurrentValue(modelId, attributeId, "1", newValue);
    }
  };

  const handleCodeListConnection = (propId: any, newValue: any) => {
    //case where node is expanded and user trying to connect to another model

    console.log("newValue", newValue, propId);

    if (currentNode) {
      //construct the handle id
      const handleId = `handle|nd|${currentNode.id}|attr|${attributeId}|dt|model`;
      const { edgeId, targetNode } = getConnectedTargetNodeAndEdgeIdByHandle(
        currentNode.id,
        handleId
      );
      if (edgeId) removeEdge(edgeId);
      if (targetNode) removeNodeById(targetNode.id);
    }
    const selectedCode = getCodeById(newValue);
    console.log("TBD", selectedCode);
    if (selectedCode) {
      updateAttributeValueOfAModel(
        modelId,
        attributeId,
        "dataSourceId",
        newValue
      );
      updateAttributeValueOfAModel(
        modelId,
        attributeId,
        "dataSourceFriendlyName",
        selectedCode.name
      );
      updatePropertyCurrentValue(modelId, attributeId, propId, newValue);
    }
  };

  const handleUpdateValuesListToStore = (propId: any, newValue: any) => {
    console.log("TBD", newValue, propId);
    updatePropertyCurrentListValues(modelId, attributeId, "1", newValue);
  };

  const renderFields = properties.map((prop: any) => {
    switch (prop.type) {
      case "text":
        return (
          <Grid item key={prop.id}>
            <SmallTextField
              {...prop}
              updatePropertyValueToModel={(propId: any, newValue: any) =>
                handleUpdatePropValueToStore(propId, newValue)
              }
            />
          </Grid>
        );
      case "number":
        return (
          <Grid item key={prop.id}>
            <SmallNumberField
              {...prop}
              updatePropertyValueToModel={(propId: any, newValue: any) =>
                handleUpdatePropValueToStore(propId, newValue)
              }
            />
          </Grid>
        );
      case "dropdown":
        return (
          <Grid item key={prop.id}>
            <SmallDropdown
              {...prop}
              updatePropertyValueToModel={(propId: any, newValue: any) =>
                handleUpdatePropValueToStore(propId, newValue)
              }
            />
          </Grid>
        );
      case "switch":
        return (
          <Grid item key={prop.id}>
            <SmallSwitch
              {...prop}
              updatePropertyValueToModel={(propId: any, newValue: any) =>
                handleUpdatePropValueToStore(propId, newValue)
              }
            />
          </Grid>
        );
      case "checkbox":
        return (
          <Grid item key={prop.id}>
            <SmallCheckbox
              {...prop}
              updatePropertyValueToModel={(propId: any, newValue: any) =>
                handleUpdatePropValueToStore(propId, newValue)
              }
            />
          </Grid>
        );
      case "radioGroup":
        return (
          <Grid item key={prop.id}>
            <SmallRadioGroup
              {...prop}
              updatePropertyValueToModel={(propId: any, newValue: any) =>
                handleUpdatePropValueToStore(propId, newValue)
              }
            />
          </Grid>
        );
      case "rating":
        return (
          <Grid item key={prop.id}>
            <SmallRating
              {...prop}
              updatePropertyValueToModel={(propId: any, newValue: any) =>
                handleUpdatePropValueToStore(propId, newValue)
              }
            />
          </Grid>
        );
      case "slider":
        return (
          <Grid item key={prop.id}>
            <SmallSlider
              {...prop}
              updatePropertyValueToModel={(propId: any, newValue: any) =>
                handleUpdatePropValueToStore(propId, newValue)
              }
            />
          </Grid>
        );
      case "toggleButton":
        return (
          <Grid item key={prop.id}>
            <SmallToggleButton
              {...prop}
              updatePropertyValueToModel={(propId: any, newValue: any) =>
                handleUpdatePropValueToStore(propId, newValue)
              }
            />
          </Grid>
        );
      case "modeldropdown":
        return (
          <Grid item key={prop.id}>
            <SmallModelDropdown
              {...prop}
              getModelPropsFromAPI={(newValue: any) =>
                handleModelConnection(newValue)
              }
            />
          </Grid>
        );

      case "listdropdown":
        return (
          <Grid item key={prop.id}>
            <RecursiveDropdownv3
              {...prop}
              handleUpdateValuesList={(propId: any, newValue: any) =>
                handleUpdateValuesListToStore(propId, newValue)
              }
            />
          </Grid>
        );

      case "codeListDropdown":
        return (
          <Grid item key={prop.id}>
            <CodeListDropdown
              {...prop}
              updatePropertyValueToModel={(propId: any, newValue: any) =>
                handleCodeListConnection(propId, newValue)
              }
            />
          </Grid>
        );
    }
  });

  return !isModelPropertyShowing ? (
    <Box>
      <>
        {properties.length > 0 && (
          <>
            <Typography variant="body1" pt={3} pb={2}>
              OTHERS
            </Typography>
            <Paper elevation={3} sx={{ padding: 3, marginRight: 2 }}>
              <Box display="flex" flexDirection="column" gap={2} pr={1}>
                {renderFields}
              </Box>
            </Paper>
          </>
        )}
      </>
    </Box>
  ) : (
    <Box></Box>
  );
});
