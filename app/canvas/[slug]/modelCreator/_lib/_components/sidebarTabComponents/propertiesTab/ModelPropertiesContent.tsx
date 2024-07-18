import React, { useState, useEffect } from "react";
import { useTabStore } from "../../../../../_lib/_store/TabStateManagmentStore";
import useModelStore from "../../../_store/modelStore/ModelDetailsFromBackendStore";
import { Box, Paper, TextField, Typography } from "@mui/material";

export const ModelPropertiesContent = () => {
  const modelId = useTabStore((state) => state.modelId);
  if (!modelId) return;

  const getModelById = useModelStore((state) => state.getModelById);
  const updateModelProperty = useModelStore(
    (state) => state.updateModelProperty
  );

  const currentModel = getModelById(modelId);
  if (!currentModel) return;

  const [friendlyName, setFriendlyName] = useState(
    currentModel?.modelFriendlyName || ""
  );
  const [desc, setDesc] = useState(currentModel?.modelDesc || "");

  useEffect(() => {
    setDesc(currentModel?.modelDesc || "");
    setFriendlyName(currentModel?.modelFriendlyName || "");
  }, [modelId]);

  const handleFriendlyNameBlur = () => {
    if (friendlyName !== "")
      updateModelProperty(modelId, "modelFriendlyName", friendlyName);
  };

  const handleFriendlyNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFriendlyName(event.target.value);
  };

  const handleDescNameBlur = () =>
    updateModelProperty(modelId, "modelDesc", desc);
  const handleDescChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDesc(event.target.value);
  };

  return (
    <Box>
      <Typography variant="body1" pb={2}>
        GENERAL
      </Typography>
      <Paper elevation={3} sx={{ padding: 3, marginRight: 2 }}>
        <Box display="flex" flexDirection="column" gap={2} pr={1}>
          <TextField
            required
            size="small"
            placeholder="Friendly Name"
            variant="outlined"
            label="Friendly Name"
            value={friendlyName}
            onChange={handleFriendlyNameChange}
            onBlur={handleFriendlyNameBlur}
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
            label="Description"
            value={desc}
            onChange={handleDescChange}
            onBlur={handleDescNameBlur}
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
            disabled
            variant="outlined"
            value={currentModel?.modelName}
            label="System Name"
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
            disabled
            size="small"
            value={currentModel?.createdBy}
            variant="outlined"
            label="Created By"
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
            disabled
            size="small"
            value={currentModel?.modifiedBy}
            variant="outlined"
            label="Modified By"
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
            disabled
            size="small"
            value={currentModel?.dateCreated}
            variant="outlined"
            label="Created On"
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
            disabled
            size="small"
            value={currentModel?.dateModified}
            variant="outlined"
            label="Modified On"
            sx={{
              input: {
                "&::placeholder": {
                  opacity: 1,
                  fontSize: "0.75rem",
                },
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};
