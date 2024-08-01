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

import CreateFlowItemModal from "@/app/canvas/[slug]/_lib/_components/createFlowItemModal/CreateFlowItemModal";
import { useRouter } from "next/navigation";
import {
  CanvasIndexItem,
  useCreateModel,
  useFetchModels,
} from "./_lib/_queries/useModelQueries";
import { useFetchLayouts } from "./_lib/_queries/useLayoutQueries";
import LayoutsIndex from "./LayoutsIndex";
import ModelsIndex from "./ModelsIndex";

// const ModelIndex = () => {
//   const {
//     data: models,
//     error: fetchModelError,
//     isLoading: isFetchModelLoading,
//     isError: isfetchModelError,
//   } = useFetchModels();

//   const {
//     data: layouts,
//     error: fetchLayoutError,
//     isLoading: isFetchLayoutLoading,
//     isError: isfetchLayoutError,
//   } = useFetchLayouts("dummyuser");
//   const [openDialog, setOpenDialog] = useState(false);
//   const { mutation, modelId } = useCreateModel();
//   const [localModelId, setLocalModelId] = useState<string | null>("");
//   const [isEditing, setIsEditing] = useState(false);
//   const router = useRouter();

//   const handleNewModelClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//     setOpenDialog(true);
//   };

//   const handleNewLayoutClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//     setOpenDialog(true);
//   };

//   const handleClose = () => {
//     setOpenDialog(false);
//   };

//   const handleCreate = (data: {
//     name: string;
//     description: string;
//     template: string;
//   }) => {
//     setOpenDialog(false);
//     console.log("Creating new model with:", data);
//     mutation.mutate(data);
//   };

//   const handleModelEdit = (item: CanvasIndexItem) => {
//     setIsEditing(true);
//     setLocalModelId(item.id);
//   };

//   const handleLayoutEdit = (item: CanvasIndexItem) => {};

//   useEffect(() => {
//     if (modelId) {
//       setLocalModelId(modelId);
//     }
//   }, [modelId]);

//   useEffect(() => {
//     if (localModelId) {
//       setIsEditing(false);
//       router.push(`/canvasBuilderv2/model/${localModelId}`);
//     }
//   }, [localModelId, router]);

//   return (
//     <>
//       {/* layout index */}
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           paddingBottom: "10px",
//         }}
//       >
//         <h1>Layout Index</h1>

//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             width: "100%",
//             padding: "16px",
//             boxSizing: "border-box",
//           }}
//         >
//           <Box
//             sx={{
//               alignSelf: "flex-end",
//               marginRight: "190px",
//               marginBottom: "16px",
//             }}
//           >
//             <Button variant="contained" onClick={handleNewLayoutClick}>
//               Add New Layout
//             </Button>
//           </Box>
//           <TableContainer sx={{ width: "80%", border: "1px solid black" }}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>ID</TableCell>
//                   <TableCell>Friendly Name</TableCell>
//                   <TableCell>Description</TableCell>
//                   <TableCell>Created By</TableCell>
//                   <TableCell>Modified By</TableCell>
//                   <TableCell>Date Created</TableCell>
//                   <TableCell>Date Modified</TableCell>
//                   <TableCell>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {layouts && layouts.length > 0 ? (
//                   layouts.map((item) => (
//                     <TableRow key={item.id}>
//                       <TableCell>{item.id}</TableCell>
//                       <TableCell>{item.friendlyName}</TableCell>
//                       <TableCell>{item.description}</TableCell>
//                       <TableCell>{item.createdBy}</TableCell>
//                       <TableCell>{item.modifiedBy}</TableCell>
//                       <TableCell>{item.dateCreated}</TableCell>
//                       <TableCell>{item.dateModified}</TableCell>
//                       <TableCell>
//                         <IconButton color="primary">
//                           <EditOutlined
//                             onClick={() => handleLayoutEdit(item)}
//                           />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <CircularProgress />
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//       </Box>
//       {/* model index */}
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <h1>Model Index</h1>

//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             width: "100%",
//             padding: "16px",
//             boxSizing: "border-box",
//           }}
//         >
//           <Box
//             sx={{
//               alignSelf: "flex-end",
//               marginRight: "190px",
//               marginBottom: "16px",
//             }}
//           >
//             <Button variant="contained" onClick={handleNewModelClick}>
//               Add New Model
//             </Button>
//           </Box>
//           <TableContainer sx={{ width: "80%", border: "1px solid black" }}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>ID</TableCell>
//                   <TableCell>Friendly Name</TableCell>
//                   <TableCell>Description</TableCell>
//                   <TableCell>Created By</TableCell>
//                   <TableCell>Modified By</TableCell>
//                   <TableCell>Date Created</TableCell>
//                   <TableCell>Date Modified</TableCell>
//                   <TableCell>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {models && models.length > 0 ? (
//                   models.map((item) => (
//                     <TableRow key={item.id}>
//                       <TableCell>{item.id}</TableCell>
//                       <TableCell>{item.friendlyName}</TableCell>
//                       <TableCell>{item.description}</TableCell>
//                       <TableCell>{item.createdBy}</TableCell>
//                       <TableCell>{item.modifiedBy}</TableCell>
//                       <TableCell>{item.dateCreated}</TableCell>
//                       <TableCell>{item.dateModified}</TableCell>
//                       <TableCell>
//                         <IconButton color="primary">
//                           <EditOutlined onClick={() => handleModelEdit(item)} />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <CircularProgress />
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//       </Box>
//       <CreateFlowItemModal
//         open={openDialog}
//         onClose={handleClose}
//         onCreate={handleCreate}
//         createError=""
//       />
//     </>
//   );
// };

// export default ModelIndex;

const Index = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          width: "100%",
        }}
      >
        <LayoutsIndex />
        <ModelsIndex />
      </Box>
    </>
  );
};
export default Index;
