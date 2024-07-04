import React, { FC } from "react";
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SvgIconProps,
  SxProps,
  useTheme,
} from "@mui/material";

interface MenuItemProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: FC<SvgIconProps>;
}

interface MenuComponentProps {
  open: boolean;
  onClose: () => void;
  anchorOrigin: {
    vertical: "top" | "center" | "bottom" | number;
    horizontal: "left" | "center" | "right" | number;
  };
  transformOrigin: {
    vertical: "top" | "center" | "bottom" | number;
    horizontal: "left" | "center" | "right" | number;
  };
  anchorEl: null | HTMLElement;
  items: MenuItemProps[];
  sx?: SxProps;
}

const MenuComponent: React.FC<MenuComponentProps> = ({
  open,
  onClose,
  anchorOrigin,
  transformOrigin,
  anchorEl,
  items,
  sx,
}) => {
  const theme = useTheme();
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      anchorEl={anchorEl}
      sx={{ maxHeight: "250px", ...sx }}
      autoFocus={false}
    >
      {items.map((item, index) =>
        item.icon !== undefined ? (
          <MenuItem
            key={index}
            onClick={() => {
              onClose();
              item.onClick && item.onClick();
            }}
            disabled={item.disabled}
          >
            <ListItemIcon>
              {
                <item.icon
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "20px",
                  }}
                />
              }
            </ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem
            key={index}
            onClick={() => {
              onClose();
              item.onClick && item.onClick();
            }}
            disabled={item.disabled}
          >
            {item.label}
          </MenuItem>
        )
      )}
    </Menu>
  );
};

export default MenuComponent;
