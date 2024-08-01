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
  Button,
  CircularProgress,
} from "@mui/material";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { validationSetData } from "../_lib/dummyData/dummyDataForIndex";
import { logicCreatorData } from "../_lib/dummyData/dummyDataForIndex";
import { CanvasIndexItem } from "../../model/_lib/_queries/useModelQueries";
import { useRouter } from "next/navigation";

const FlowCanvas = ({ params }: { params: { flowType: string } }) => {
  const { flowType } = params;
  const router = useRouter();
  const [localFlowId, setLocalFlowId] = useState<string | null>("");

  const handleAddNewFlowItemClick = () => {};

  const handleEdit = (item: CanvasIndexItem) => {
    setLocalFlowId("1");
  };

  useEffect(() => {
    if (localFlowId) {
      router.push(`/canvasBuilderv2/${flowType}/${localFlowId}`);
    }
  }, [localFlowId, router]);

  let data;
  let header;
  if (flowType === "validationSet") {
    data = validationSetData;
    header = "Validation Set";
  } else if (flowType === "logicCreator") {
    data = logicCreatorData;
    header = "Logic Creator";
  }
  return (
    <>
      <div>Flow Canvas for: {flowType}</div>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "95vh",
        }}
      >
        <h1>{header} Index</h1>

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
            <Button variant="contained" onClick={handleAddNewFlowItemClick}>
              Add New {header}
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
                {data && data.length > 0 ? (
                  data.map((item) => (
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
                  ))
                ) : (
                  <CircularProgress />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default FlowCanvas;
