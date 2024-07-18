"use client";

import React, { ReactNode } from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs, Typography } from "@mui/material";

type TBreadCrumbProps = {
  homeElement: ReactNode;
  separator: ReactNode;
  capitalizeLinks?: boolean;
};

const NextBreadcrumb = ({
  homeElement,
  separator,
  capitalizeLinks,
}: TBreadCrumbProps) => {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  return (
    <Breadcrumbs separator={separator} aria-label="breadcrumb">
      <Link href="/" passHref>
        <Typography component="span" color="inherit">
          {homeElement}
        </Typography>
      </Link>
      {pathNames.map((link, index) => {
        const href = `/${pathNames.slice(0, index + 1).join("/")}`;
        const itemLink = capitalizeLinks
          ? link[0].toUpperCase() + link.slice(1)
          : link;

        const isLast = index === pathNames.length - 1;
        return isLast ? (
          <Typography key={index} color="textPrimary">
            {itemLink}
          </Typography>
        ) : (
          <Link key={index} href={href} passHref>
            <Typography component="span" color="inherit">
              {itemLink}
            </Typography>
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default NextBreadcrumb;
