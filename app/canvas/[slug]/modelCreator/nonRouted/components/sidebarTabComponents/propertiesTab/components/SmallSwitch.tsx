import { FormControlLabel, Switch, SwitchProps } from "@mui/material";
import React, { useState } from "react";

type SmallSwitchProps = {
  id: string;
  type: string;
  label: string;
  visible: boolean;
  required: boolean;
  enabled: boolean;
  defaultValue: boolean;
  currentValue?: boolean;
  size?: "small" | "medium";
  config: {
    color?: SwitchProps["color"];
    labelPlacement?: "end" | "start" | "top" | "bottom";
  };
  updatePropertyValueToModel: (propertyName: string, newValue: any) => void;
};

export const SmallSwitch: React.FC<SmallSwitchProps> = ({
  label,
  visible,
  required,
  enabled,
  defaultValue,
  currentValue,
  id,
  config: { color, labelPlacement },
  updatePropertyValueToModel,
}) => {
  const [checked, setChecked] = useState(
    currentValue !== undefined ? currentValue : defaultValue
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Switch toggled to:", event.target.checked);
    setChecked(event.target.checked);
    updatePropertyValueToModel(id, event.target.checked);
  };

  if (!visible) return null;

  return (
    <FormControlLabel
      sx={{ m: 0 }}
      control={
        <Switch
          required={required}
          checked={checked}
          onChange={handleChange}
          color={color}
          disabled={!enabled}
        />
      }
      label={label}
      labelPlacement={labelPlacement}
    />
  );
};
