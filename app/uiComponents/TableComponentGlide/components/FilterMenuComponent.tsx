import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import { ArrowLeftOutlined } from "@mui/icons-material";
import MenuComponent from "../../Menu/MenuComponent";
import { ColumnConfigurationType } from "../types";

interface FilterMenuComponentProps {
  openMenu: HTMLElement | null;
  onCloseMenu: () => void;
  columns: ColumnConfigurationType[];
}

const FilterMenuComponent = ({
  openMenu,
  onCloseMenu,
  columns,
}: FilterMenuComponentProps) => {
  const theme = useTheme();

  const [nestedYearMenu, setNestedYearMenu] = useState<HTMLElement | null>(
    null
  );
  const [nestedSortMenu, setNestedSortMenu] = useState<HTMLElement | null>(
    null
  );

  const handleNestedYearMenu = (e: React.MouseEvent<HTMLElement>) => {
    setNestedYearMenu(e.currentTarget);
  };

  const handleNestedSortMenu = (e: React.MouseEvent<HTMLElement>) => {
    setNestedSortMenu(e.currentTarget);
  };
  return (
    <Menu
      open={Boolean(openMenu)}
      onClose={onCloseMenu}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      anchorEl={openMenu}
    >
      <MenuItem onClick={handleNestedYearMenu}>
        <ListItemIcon>
          <ArrowLeftOutlined sx={{ color: theme.palette.text.primary }} />
        </ListItemIcon>
        <ListItemText>Year</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleNestedSortMenu}>
        <ListItemIcon>
          <ArrowLeftOutlined sx={{ color: theme.palette.text.primary }} />
        </ListItemIcon>
        <ListItemText>Sort</ListItemText>
      </MenuItem>
      <MenuComponent
        open={Boolean(nestedYearMenu)}
        onClose={() => setNestedYearMenu(null)}
        anchorEl={nestedYearMenu}
        items={[
          { label: "2024", onClick: () => alert("hello") },
          { label: "2023", onClick: () => alert("hello") },
          { label: "2022", onClick: () => alert("hello") },
        ]}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      />
      <MenuComponent
        open={Boolean(nestedSortMenu)}
        onClose={() => setNestedSortMenu(null)}
        anchorEl={nestedSortMenu}
        items={columns
          .filter((column) => column.isVisible)
          .map((column) => ({
            label: column.title,
            onClick: () => alert(column.title),
          }))}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      />
    </Menu>
  );
};

export default FilterMenuComponent;
