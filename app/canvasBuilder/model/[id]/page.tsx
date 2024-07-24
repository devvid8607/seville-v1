"use client";

import NextBreadcrumb from "@/app/_lib/_components/Breadcrumbs";
import { NewModelCreator } from "@/app/canvas/[slug]/modelCreator/_lib/_components/model/NewModelCreator";
import { Typography } from "@mui/material";

interface ModelCreatorPageProps {
  params: {
    id: string;
  };
}

const ModelCreatorPage = ({ params }: ModelCreatorPageProps) => {
  return (
    <div>
      <NextBreadcrumb
        homeElement={<Typography>Home</Typography>}
        separator={<span> / </span>}
        capitalizeLinks={true}
      />
      {/* <h1>Model Creator</h1>
      <p>ID: {params.id}</p> */}
      <NewModelCreator />
    </div>
  );
};

export default ModelCreatorPage;
