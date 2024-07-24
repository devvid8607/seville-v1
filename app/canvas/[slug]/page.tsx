// app/canvas/[slug]/page.tsx
"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
} from "@mui/material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import {
  logicCreatorData,
  modelIndexData,
  validationSetData,
} from "../dummyDataForIndex";
import { useRouter } from "next/navigation";
import NextBreadcrumb from "@/app/_lib/_components/Breadcrumbs";
import CreateFlowItemModal from "./_lib/_components/createFlowItemModal/CreateFlowItemModal";
import {
  useCreateModel,
  useCreateModelAndFetchCanvas,
  useFetchModels,
} from "./modelCreator/_lib/_queries/useModelQueries";
import { useCanvasData } from "./modelCreator/_lib/_queries/useCanvasQueries";

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

const fetchModels = async (): Promise<CanvasIndexItem[]> => {
  // Dummy API call for models
  return modelIndexData;
};

const fetchValidationSets = async (): Promise<CanvasIndexItem[]> => {
  // Dummy API call for validation sets
  return validationSetData;
};

const fetchLogicCreators = async (): Promise<CanvasIndexItem[]> => {
  // Dummy API call for logic creators
  return logicCreatorData;
};

interface Params {
  slug: string;
}

const CanvasTable: React.FC<{ params: Params }> = ({ params }) => {
  const { slug } = params;
  const router = useRouter();
  const currentPath = usePathname();

  const [createModelError, setCreateModelError] = useState<null | string>(null);
  const [selectedItem, setSelectedItem] = useState<CanvasIndexItem | null>(
    null
  );
  const [open, setOpen] = useState(false);

  //getting all models for showing index
  const {
    data: models,
    error: fetchModelError,
    isLoading: isFetchModelLoading,
    isError: isfetchModelError,
  } = useFetchModels();

  const {
    data: canvasDataOnEdit,
    error: canvasErrorOnEdit,
    isLoading: canvasLoadingOnEdit,
    refetch: refetchCanvasDataOnEdit,
    isError: isErrorCanvasDataOnEdit,
  } = useCanvasData("dummyuser", selectedItem?.id || null);

  const {
    createModel,
    createModelStatus,
    modelError,
    canvasData,
    canvasDataError,
    isCanvasDataLoading,
    isCanvasDataError,
  } = useCreateModelAndFetchCanvas();

  useEffect(() => {
    if (canvasData) {
      console.log("Canvas Data:", canvasData);
      router.push(`/canvas/${slug}/modelCreator?id=newModel&param=${slug}`);
    }
  }, [canvasData]);

  useEffect(() => {
    if (canvasDataOnEdit && selectedItem?.id) {
      console.log("Canvas Data on edit:", canvasDataOnEdit);
      router.push(
        `/canvas/${slug}/modelCreator?id=${selectedItem?.id}&param=${slug}`
      );
    }
  }, [canvasDataOnEdit]);

  const handleEdit = (item: CanvasIndexItem) => {
    console.log("current Path", currentPath, slug);
    if (slug === "model") {
      setSelectedItem(item);
      refetchCanvasDataOnEdit();
    }
    if (slug === "validationSet") {
      router.push(`/canvas/${slug}/flowComponents?id=${item.id}&param=${slug}`);
    }
    if (slug === "logicCreator") {
      router.push(`/canvas/${slug}/flowComponents?id=${item.id}&param=${slug}`);
    }
  };

  const handleNewModelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = (data: {
    name: string;
    description: string;
    template: string;
  }) => {
    console.log("Creating new model with:", data);
    createModel(data);
  };

  if (
    isCanvasDataLoading ||
    isFetchModelLoading ||
    canvasLoadingOnEdit ||
    createModelStatus === "pending"
  ) {
    return <div>Loading...</div>;
  }

  if (
    isfetchModelError ||
    isErrorCanvasDataOnEdit ||
    createModelStatus === "error" ||
    isCanvasDataError
  ) {
    return (
      <div>
        Error:
        {isfetchModelError
          ? fetchModelError.message
          : isErrorCanvasDataOnEdit
          ? canvasErrorOnEdit.message
          : createModelStatus === "error"
          ? modelError?.message
          : isCanvasDataError
          ? canvasDataError?.message
          : "Random error"}
      </div>
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
        <h1>Canvas Index</h1>
        {slug && <p>Selected Parameter: {slug}</p>}

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
            {slug && slug === "model" && (
              <Button variant="contained" onClick={handleNewModelClick}>
                Add New Model
              </Button>
            )}
            {slug && slug === "validationSet" && (
              <Button variant="contained">Add New Validation Set</Button>
            )}
            {slug && slug === "logicCreator" && (
              <Button variant="contained">Add New Logic</Button>
            )}
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
                        <IconButton
                          onClick={() => handleEdit(item)}
                          color="primary"
                        >
                          <EditOutlined />
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
        open={open}
        onClose={handleClose}
        onCreate={handleCreate}
        createError={createModelError}
      />
    </>
  );
};

export default CanvasTable;
