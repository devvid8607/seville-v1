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
  Button,
  CircularProgress,
} from "@mui/material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import {
  useCreateLayout,
  useFetchLayouts,
} from "./_lib/_queries/useLayoutQueries";
import { CanvasIndexItem } from "./_lib/_queries/useModelQueries";
import CreateFlowItemModal from "@/app/canvas/[slug]/_lib/_components/createFlowItemModal/CreateFlowItemModal";
import { useRouter } from "next/navigation";

const LayoutsIndex = () => {
  const {
    data: layouts,
    error: fetchLayoutError,
    isLoading: isFetchLayoutLoading,
    isError: isfetchLayoutError,
  } = useFetchLayouts("dummyuser");
  const [openDialog, setOpenDialog] = useState(false);
  const [localLayoutId, setLocalLayoutId] = useState<string | null>("");
  const [localModelId, setLocalModelId] = useState<string | null>("");
  const [isEditing, setIsEditing] = useState(false);

  const handleNewLayoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenDialog(true);
  };
  const handleLayoutEdit = (item: CanvasIndexItem) => {
    // alert("editing" + item.id);
    setIsEditing(true);
    setLocalLayoutId(item.id);
  };
  const handleClose = () => {
    setOpenDialog(false);
  };
  const { mutation, layoutId } = useCreateLayout();
  const router = useRouter();

  const handleCreate = (data: {
    name: string;
    description: string;
    template: string;
    userId?: string;
  }) => {
    setOpenDialog(false);
    console.log("Creating new layout with:", data);
    data.userId = "dummyUser";
    mutation.mutate(data);
  };

  useEffect(() => {
    if (layoutId) {
      setLocalLayoutId(layoutId);
    }
  }, [layoutId]);

  useEffect(() => {
    if (localLayoutId) {
      // alert("use" + localLayoutId + "," + localModelId);
      setIsEditing(false);
      router.push(`/canvasBuilderv2/model/LayoutId:${localLayoutId}`);
    }
  }, [localLayoutId, router]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: "10px",
        width: "100%",
      }}
    >
      <h1>Layout Index</h1>

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
          <Button variant="contained" onClick={handleNewLayoutClick}>
            Add New Layout
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
              {layouts && layouts.length > 0 ? (
                layouts.map((item) => (
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
                        <EditOutlined onClick={() => handleLayoutEdit(item)} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <CircularProgress />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <CreateFlowItemModal
        title="Add New Layout"
        open={openDialog}
        onClose={handleClose}
        onCreate={handleCreate}
        createError=""
        isSave={false}
      />
    </Box>
  );
};

export default LayoutsIndex;
