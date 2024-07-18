import * as MuiIcons from "@mui/icons-material";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { ToggleButtonProps } from "@mui/material/ToggleButton";
import React, { useState } from "react";

type SmallToggleButtonProps = {
  id: string;
  type: string;
  label: string;
  visible: boolean;
  required?: boolean;
  enabled: boolean;
  defaultValue: string;
  currentValue: string;
  config: {
    exclusive: boolean;
    options: Array<{
      value: string;

      icon: string;
    }>;
    size?: ToggleButtonProps["size"];
    color?: "standard" | "primary" | "secondary";
  };
  updatePropertyValueToModel: (propertyName: string, newValue: any) => void;
};

export const SmallToggleButton: React.FC<SmallToggleButtonProps> = ({
  label,
  visible,
  enabled,
  defaultValue,
  id,
  currentValue,
  config: { exclusive, options, size, color },
  updatePropertyValueToModel,
}) => {
  const [selected, setSelected] = useState<string | null>(
    currentValue ? currentValue : defaultValue
  );

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    setSelected(newAlignment);
    updatePropertyValueToModel(id, newAlignment);
  };

  if (!visible) return null;

  return (
    <Box>
      <Typography gutterBottom>{label}</Typography>
      <ToggleButtonGroup
        size={size}
        value={selected}
        exclusive={exclusive}
        onChange={handleChange}
        aria-label={label}
        color={color as any}
        disabled={!enabled}
      >
        {options.map((option) => {
          // Dynamically get the icon component from MuiIcons using the icon name
          const IconComponent = option.icon
            ? MuiIcons[option.icon as keyof typeof MuiIcons]
            : null;

          return (
            <ToggleButton
              key={option.value}
              value={option.value}
              disabled={!enabled}
            >
              {IconComponent && <IconComponent sx={{ color: "red" }} />}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </Box>
  );
};
