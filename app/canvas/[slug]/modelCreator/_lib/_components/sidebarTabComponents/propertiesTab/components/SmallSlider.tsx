type SmallSliderProps = {
  id: string;
  type: string;
  label: string;
  visible: boolean;
  required?: boolean; // Sliders typically don't use 'required', but included for consistency
  enabled: boolean;
  size: "small" | "medium";
  defaultValue: number;
  currentValue: number;
  config: {
    min: number;
    max: number;
    step: number;
    marks?: Array<{ value: number; label: string }>;
    orientation: "horizontal" | "vertical";
    color?: "primary" | "secondary";
  };
  updatePropertyValueToModel: (propertyName: string, newValue: any) => void;
};

import React, { useState } from "react";
import { Box, Slider, Typography } from "@mui/material";

export const SmallSlider: React.FC<SmallSliderProps> = ({
  label,
  visible,
  enabled,
  size,
  defaultValue,
  id,
  currentValue,
  config: { min, max, step, marks, orientation, color },
  updatePropertyValueToModel,
}) => {
  const [value, setValue] = useState<number | number[]>(
    currentValue ? currentValue : defaultValue ? defaultValue : 0
  );

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue);
    updatePropertyValueToModel(id, newValue);
  };

  if (!visible) return null;

  return (
    <Box>
      <Typography id={`${label}-slider`} gutterBottom>
        {label}
      </Typography>
      <Slider
        size={size}
        aria-labelledby={`${label}-slider`}
        value={value}
        onChange={handleChange}
        disabled={!enabled}
        min={min}
        max={max}
        step={step}
        marks={marks}
        orientation={orientation}
        color={color}
        valueLabelDisplay="auto"
      />
    </Box>
  );
};
