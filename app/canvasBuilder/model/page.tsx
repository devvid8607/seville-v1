"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import NextBreadcrumb from "@/app/_lib/_components/Breadcrumbs";
import CreateFlowItemModal from "@/app/canvas/[slug]/_lib/_components/createFlowItemModal/CreateFlowItemModal";
import {
  useCreateModel,
  useCreateModelAndFetchCanvas,
  useFetchModels,
} from "@/app/canvas/[slug]/modelCreator/_lib/_queries/useModelQueries";
import { useRouter } from "next/navigation";
import { useCanvasData } from "@/app/canvas/[slug]/modelCreator/_lib/_queries/useCanvasQueries";
import useModelBackendStore from "@/app/canvas/[slug]/modelCreator/_lib/_store/modelStore/ModelBackEndStore";
import { useModelNodesStore } from "@/app/canvas/[slug]/modelCreator/_lib/_store/modelStore/ModelNodesStore";
import useModelStore from "@/app/canvas/[slug]/modelCreator/_lib/_store/modelStore/ModelDetailsFromBackendStore";

interface CanvasIndexItem {
  id: string;
  name: string;
  friendlyName: string;
  description: string;
  createdBy: string;
  modifiedBy: string;
  dateCreated: string;
  dateModified: string;
}

const ModelIndex = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<CanvasIndexItem | null>(
    null
  );
  const [localModelId, setLocalModelId] = useState<string | null>("");

  const { mutation } = useCreateModel();
  const setAllValues = useModelBackendStore((state) => state.setAllValues);

  const { clearAllEdgedDataInStore, clearAllNodesDataInStore } =
    useModelNodesStore((state) => ({
      clearAllEdgedDataInStore: state.clearAllEdgedDataInStore,
      clearAllNodesDataInStore: state.clearAllNodesDataInStore,
    }));
  const clearModels = useModelStore((state) => state.clearModels);

  const {
    data: models,
    error: fetchModelError,
    isLoading: isFetchModelLoading,
    isError: isfetchModelError,
  } = useFetchModels();

  const {
    data: canvasData,
    isLoading,
    isError,
    error,
    refetch,
  } = useCanvasData("dummyuser", localModelId);

  const handleEdit = (item: CanvasIndexItem) => {
    setSelectedItem(item);
    setLocalModelId(item.id);
    if (item !== null) refetch();
  };

  const handleNewModelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleCreate = (data: {
    name: string;
    description: string;
    template: string;
  }) => {
    setOpenDialog(false);
    console.log("Creating new model with:", data);

    mutation.mutate(data, {
      onSuccess: (data) => {
        setLocalModelId(data.id);
      },
    });
  };

  useEffect(() => {
    if (canvasData) {
      setOpenDialog(false);
      console.log("Canvas Data:", canvasData);
      clearAllEdgedDataInStore();
      clearAllNodesDataInStore();
      clearModels();
      setAllValues({
        header: canvasData.canvasData.header,
        savedNodes: canvasData.canvasData.visibleNodes,
        savedEdges: canvasData.canvasData.visibleEdges,
        initialSchemaItems: canvasData.canvasData.systemNodes,
      });
      router.push(`/canvasBuilder/model/${localModelId}`);
    }
  }, [canvasData, localModelId, router]);

  if (isFetchModelLoading || isLoading) {
    return <CircularProgress />;
  }

  if (isfetchModelError || isError) {
    return (
      <Typography color="error">
        Error fetching models:
        {fetchModelError
          ? fetchModelError.message
          : isError
          ? error.message
          : ""}
      </Typography>
    );
  }

  return (
    <>
      <Box display="flex" flexDirection="column" gap={2} mt={2} ml={2}>
        <NextBreadcrumb
          homeElement={<Typography>Home</Typography>}
          separator={<span> / </span>}
          capitalizeLinks={true}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "95vh",
        }}
      >
        <h1>Model Index</h1>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            padding: "16px",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              alignSelf: "flex-end",
              marginRight: "190px",
              marginBottom: "16px",
            }}
          >
            <Button variant="contained" onClick={handleNewModelClick}>
              Add New Model
            </Button>
          </Box>
          <TableContainer sx={{ width: "80%", border: "1px solid black" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Friendly Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Modified By</TableCell>
                  <TableCell>Date Created</TableCell>
                  <TableCell>Date Modified</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {models &&
                  models.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.friendlyName}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.createdBy}</TableCell>
                      <TableCell>{item.modifiedBy}</TableCell>
                      <TableCell>{item.dateCreated}</TableCell>
                      <TableCell>{item.dateModified}</TableCell>
                      <TableCell>
                        <IconButton color="primary">
                          <EditOutlined onClick={() => handleEdit(item)} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <CreateFlowItemModal
        open={openDialog}
        onClose={handleClose}
        onCreate={handleCreate}
        createError=""
      />
    </>
  );
};

export default ModelIndex;
