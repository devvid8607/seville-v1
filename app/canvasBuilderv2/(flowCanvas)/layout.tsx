import NextBreadcrumb from "@/app/_lib/_components/Breadcrumbs";
import { Box, Typography } from "@mui/material";
import React, { ReactNode } from "react";
interface LayoutProps {
  children: ReactNode;
}

const Modellayout = ({ children }: LayoutProps) => {
  return (
    <div>
      <header>
        <Box display="flex" flexDirection="column" gap={2} mt={2} ml={2}>
          <NextBreadcrumb
            homeElement={<Typography>Home</Typography>}
            separator={<span> / </span>}
            capitalizeLinks={true}
          />
        </Box>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Modellayout;
