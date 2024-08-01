import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import NextBreadcrumb from "../_lib/_components/Breadcrumbs";

const CanvasIndexPage = () => {
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
        mt={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Button variant="contained" sx={{ mb: 2 }}>
          <Link href="/canvasBuilderv2/model">Model Builder</Link>
        </Button>

        <Button variant="contained" sx={{ mb: 2 }}>
          <Link href="/canvasBuilderv2/validationSet">Validation Set</Link>
        </Button>

        <Button variant="contained" sx={{ mb: 2 }}>
          <Link href="/canvasBuilderv2/logicCreator">Logic Creator</Link>
        </Button>

        <Button variant="contained" sx={{ mb: 2 }}>
          Workflow Index
        </Button>

        <Button variant="contained" sx={{ mb: 2 }}>
          App Creator
        </Button>
      </Box>
    </>
  );
};

export default CanvasIndexPage;
