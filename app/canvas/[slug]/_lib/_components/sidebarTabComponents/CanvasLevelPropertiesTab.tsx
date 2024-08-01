import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import useModelBackendStore from "@/app/canvasBuilderv2/model/_lib/_store/modelStore/ModelBackEndStore";
import { useTabStore } from "../../_store/TabStateManagmentStore";
import CreateFlowItemModal from "../createFlowItemModal/CreateFlowItemModal";
export const CanvasLevelPropertiesTab = () => {
  const { header, updateHeader, updateHeaderDescription } =
    useModelBackendStore();

  const isLayoutIdNull = useTabStore((state) => state.isLayoutIdNull);
  const [canvasName, setCanvasName] = useState(header?.canvasName || "");
  const [canvasDesc, setCanvasDesc] = useState(header?.canvasDesc || "");

  const [openDialog, setOpenDialog] = useState(false);
  const handleClose = () => {
    setOpenDialog(false);
  };
  const handleCreate = (data: {
    name: string;
    description: string;
    template: string;
    userId?: string;
  }) => {
    setOpenDialog(false);
    console.log("Creating new layout with:", data);
    data.userId = "dummyUser";
    // mutation.mutate(data);
  };

  const handleCanvasNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCanvasName(event.target.value);
  };

  const handleCanvasDescChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCanvasDesc(event.target.value);
  };

  const handleCanvasNameBlur = () => {
    updateHeader({ canvasName });
  };

  const handleCanvasDescBlur = () => {
    updateHeaderDescription({ canvasDesc });
  };

  useEffect(() => {
    setCanvasName(header?.canvasName || "");
    setCanvasDesc(header?.canvasDesc || "");
  }, [header?.canvasName, header?.canvasDesc]);
  if (isLayoutIdNull) {
    return (
      <Box
        height="40vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography>This layout is not saved</Typography>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => setOpenDialog(true)}
        >
          Save Layout
        </Button>
        <CreateFlowItemModal
          title="Add New Layout"
          open={openDialog}
          onClose={handleClose}
          onCreate={handleCreate}
          createError=""
          isSave={true}
        />
      </Box>
    );
  }
  return (
    <Box>
      <Typography variant="body1" pb={2}>
        Canvas Details
      </Typography>
      <Paper elevation={3} sx={{ padding: 3, marginRight: 2 }}>
        <Box display="flex" flexDirection="column" gap={2} pr={1}>
          <TextField
            required
            size="small"
            placeholder="Canvas Name"
            variant="outlined"
            label="Canvas Name"
            value={canvasName}
            onChange={handleCanvasNameChange}
            onBlur={handleCanvasNameBlur}
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
            label="Canvas Description"
            value={canvasDesc}
            onChange={handleCanvasDescChange}
            onBlur={handleCanvasDescBlur}
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
            value={header?.canvasId}
            label="System Id"
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
            value={header?.createdBy}
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
            value={header?.modifiedBy}
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
            value={header?.dateCreated}
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
            value={header?.dateModified}
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
