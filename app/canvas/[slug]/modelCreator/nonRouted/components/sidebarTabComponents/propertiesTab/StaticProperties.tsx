import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useState, useEffect } from "react";
import { useTabStore } from "../../../../../nonRouted/store/TabStateManagmentStore";
import useModelStore from "../../../store/modelStore/ModelDetailsFromBackendStore";
// import dataTypeDataDromJSON from "../../SidebarTabComponents/PropertiesTab/Data/DataTypes.json";
import {
  IconLookup,
  iconLookup,
} from "../../../../../nonRouted/constants/IconConstants";
import { FieldType } from "../../../types/FieldType";
import { ModelPropertiesContent } from "./ModelPropertiesContent";
import useDataTypesStore from "../../../../../nonRouted/store/DataTypesStore";
import { useModelNodesStore } from "../../../store/modelStore/ModelNodesStore";

export const StaticProperties: React.FC = () => {
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
  const updateAttributeValueOfAModel = useModelStore(
    (state) => state.updateAttributeValueOfAModel
  );
  const getAttributeById = useModelStore((state) => state.getAttributeById);
  const updateProperties = useModelStore((state) => state.updateProperties);

  const attribute = useModelStore(
    useCallback(
      (state) => state.getAttributeById(modelId, attributeId),
      [modelId, attributeId]
    )
  );
  //#endregion

  const { storeDataTypes } = useDataTypesStore((state) => ({
    storeDataTypes: state.dataTypes,
  }));

  //#endregion

  //#region state vars and useeffect
  const [name, setName] = useState(attribute?.name || "");
  const [friendlyName, setFriendlyName] = useState(
    attribute?.friendlyName || ""
  );
  const [description, setDescription] = useState(attribute?.description || "");
  useEffect(() => {
    setName(attribute?.name || "");
    setFriendlyName(attribute?.friendlyName || "");
    setDescription(attribute?.description || "");
  }, [attribute]);
  //#endregion

  //#region event handlers
  const handleCheckboxChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = event.target;
      updateAttributeValueOfAModel(
        modelId,
        attributeId,
        name as keyof FieldType,
        checked
      );
    },
    [modelId, attributeId, updateAttributeValueOfAModel]
  );

  const handlePropertyChange =
    (propertyName: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("handling change for " + propertyName);
      updateAttributeValueOfAModel(
        modelId,
        attributeId,
        propertyName,
        event.target.value
      );
    };

  const handleSelectChange =
    (propertyName: any) => (event: SelectChangeEvent) => {
      console.log("handling select change for " + propertyName);
      const newValue = event.target.value;
      //changing datatype property to selected type

      // if (newValue !== "model") {
      // updateAttributeValueOfAModel(modelId, attributeId, "showModel", null);
      const attribute = getAttributeById(modelId, attributeId);
      if (currentNode && attribute) {
        //construct the handle id
        const handleId = `handle|nd|${currentNode.id}|attr|${attributeId}|dt|${attribute?.dataType}`;
        const { edgeId, targetNode } = getConnectedTargetNodeAndEdgeIdByHandle(
          currentNode.id,
          handleId
        );
        console.log(edgeId, targetNode);
        if (edgeId) removeEdge(edgeId);
        if (targetNode) removeNodeById(targetNode.id);
      }
      updateAttributeValueOfAModel(
        modelId,
        attributeId,
        "dataSourceFriendlyName",
        null
      );

      updateAttributeValueOfAModel(modelId, attributeId, "dataSourceId", null);
      updateAttributeValueOfAModel(
        modelId,
        attributeId,
        "childDataType",
        event.target.value
      );
      // }
      updateAttributeValueOfAModel(
        modelId,
        attributeId,
        propertyName,
        newValue
      );
      //when type changes updating the associated props
      // const properties = (propertiesData as any)[newValue]?.Properties || [];
      const selectedTypeData = storeDataTypes.find(
        (type) => type.code === newValue
      );
      const properties = selectedTypeData?.properties || [];
      updateProperties(modelId, attributeId, properties);
      const iconName = iconLookup[selectedTypeData?.icon as keyof IconLookup];
      if (iconName) {
        updateAttributeValueOfAModel(modelId, attributeId, "icon", iconName);
      }
    };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleNameBlur = () =>
    updateAttributeValueOfAModel(modelId, attributeId, "name", name);
  const handleFriendlyNameBlur = () =>
    updateAttributeValueOfAModel(
      modelId,
      attributeId,
      "friendlyName",
      friendlyName
    );
  const handleDescriptionBlur = () =>
    updateAttributeValueOfAModel(
      modelId,
      attributeId,
      "description",
      description
    );
  //#endregion

  return !isModelPropertyShowing ? (
    <Box>
      <Typography variant="body1" pb={2}>
        GENERAL
      </Typography>
      <Paper elevation={3} sx={{ padding: 3, marginRight: 2 }}>
        <FormControl>
          <Box display="flex" flexDirection="column" gap={2} pr={1}>
            <TextField
              required
              size="small"
              value={name}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              placeholder="Name"
              variant="outlined"
              label="Name"
              disabled={attribute?.locked}
              sx={{
                input: {
                  "&::placeholder": {
                    opacity: 1,
                    fontSize: "0.75rem",
                  },
                },
              }}
            />
            <TextField
              required
              size="small"
              placeholder="Friendly Name"
              value={friendlyName}
              onChange={(e) => setFriendlyName(e.target.value)}
              onBlur={handleFriendlyNameBlur}
              // onChange={handlePropertyChange("friendlyName")}
              // value={attribute?.friendlyName}
              variant="outlined"
              label="Friendly Name"
              disabled={attribute?.locked}
              sx={{
                input: {
                  "&::placeholder": {
                    opacity: 1,
                    fontSize: "0.75rem",
                  },
                },
              }}
            />
            <TextField
              required
              size="small"
              placeholder="Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              // value={attribute?.description}
              label="Description"
              disabled={attribute?.locked}
              // onChange={handlePropertyChange("description")}
              sx={{
                input: {
                  "&::placeholder": {
                    opacity: 1,
                    fontSize: "0.75rem",
                  },
                },
              }}
            />
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-evenly"
            >
              <Typography variant="body2">Not Null</Typography>
              <Checkbox
                checked={attribute?.notNull || false}
                onChange={handleCheckboxChange}
                name="notNull"
                disabled={attribute?.locked}
              />
            </Box>

            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-evenly"
            >
              <Typography variant="body2">Enabled</Typography>
              <Checkbox
                checked={attribute?.enabled || false}
                onChange={handleCheckboxChange}
                name="enabled"
                disabled={attribute?.locked}
              />
            </Box>

            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-evenly"
            >
              <Typography variant="body2">Deletable</Typography>
              <Checkbox
                checked={attribute?.isRemovable || false}
                // onChange={handleCheckboxChange}
                name="isRemovable"
                disabled={attribute?.locked}
              />
            </Box>

            <FormControl fullWidth size="small" required>
              <InputLabel>Type</InputLabel>
              <Select
                value={attribute?.dataType}
                label="Type"
                disabled={attribute?.locked}
                onChange={handleSelectChange("dataType")}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                {storeDataTypes.map((type) => (
                  <MenuItem key={type.id} value={type.code}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </FormControl>
      </Paper>
    </Box>
  ) : (
    <Box>
      <ModelPropertiesContent />
    </Box>
  );
};
