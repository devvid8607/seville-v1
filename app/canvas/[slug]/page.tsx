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

interface CanvasIndexItem {
  id: number;
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
  console.log("slug", slug);
  const [data, setData] = useState<CanvasIndexItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const currentPath = usePathname();

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let result: CanvasIndexItem[] = [];
        if (slug === "model") {
          result = await fetchModels();
        } else if (slug === "validationSet") {
          result = await fetchValidationSets();
        } else if (slug === "logicCreator") {
          result = await fetchLogicCreators();
        }
        setData(result);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleEdit = (item: CanvasIndexItem) => {
    console.log("current Path", currentPath, slug);
    if (slug === "model") {
      // router.push(`/canvas/modelCreator?id=${item.id}&param=${slug}`);
      router.push(`/canvas/${slug}/modelCreator?id=${item.id}&param=${slug}`);
    }
  };
  const handleNewModelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("current Path", currentPath, slug);
    if (slug === "model") {
      // router.push(`/canvas/modelCreator?id=${item.id}&param=${slug}`);
      router.push(`/canvas/${slug}/modelCreator?id=newModel&param=${slug}`);
    }
  };

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
        {loading ? (
          <p>Canvas Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
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
                  {data &&
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
        )}
      </Box>
    </>
  );
};

export default CanvasTable;
