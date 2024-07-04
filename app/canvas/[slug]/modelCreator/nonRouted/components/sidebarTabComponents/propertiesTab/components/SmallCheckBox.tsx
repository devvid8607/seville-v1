import { Checkbox, FormControlLabel } from "@mui/material";
import React, { useState } from "react";

type SmallCheckboxProps = {
  id: string;
  type: string;
  label: string;
  visible: boolean;
  required: boolean;
  enabled: boolean;
  defaultValue: boolean;
  currentValue: boolean;
  size?: "small" | "medium";
  config: {
    color?: "primary" | "secondary" | "default";
    labelPlacement?: "end" | "start" | "top" | "bottom";
  };
  updatePropertyValueToModel: (propertyName: string, newValue: any) => void;
};

export const SmallCheckbox: React.FC<SmallCheckboxProps> = ({
  label,
  visible,
  required,
  enabled,
  defaultValue,
  id,
  currentValue,
  config: { color, labelPlacement },
  updatePropertyValueToModel,
}) => {
  const [checked, setChecked] = useState<boolean>(
    currentValue !== undefined ? currentValue : defaultValue
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    updatePropertyValueToModel(id, event.target.checked);
  };

  if (!visible) return null;

  const control = (
    <Checkbox
      checked={checked}
      onChange={handleChange}
      color={color || "primary"}
      disabled={!enabled}
      required={required}
    />
  );

  return (
    <FormControlLabel
      sx={{ m: 0 }}
      control={control}
      label={label}
      labelPlacement={labelPlacement || "start"}
    />
  );
};
