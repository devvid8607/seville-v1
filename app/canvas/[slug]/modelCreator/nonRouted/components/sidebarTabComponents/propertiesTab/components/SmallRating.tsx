import { Box, Rating, Typography } from "@mui/material";
import React, { useState } from "react";
type SmallRatingProps = {
  id: string;
  type: string;
  label: string;
  visible: boolean;
  required?: boolean; // Optional because it's not directly used by Rating but might be for validation
  enabled: boolean;
  size: "small" | "medium" | "large";
  defaultValue: number;
  currentValue: number;
  config: {
    max: number;
    precision: number;
    readOnly: boolean;
    color: "primary" | "secondary";
  };
  updatePropertyValueToModel: (propertyName: string, newValue: any) => void;
};

export const SmallRating: React.FC<SmallRatingProps> = ({
  label,
  visible,
  enabled,
  defaultValue,
  currentValue,
  id,
  config: { max, precision, readOnly, color },
  updatePropertyValueToModel,
}) => {
  // Convert enabled to disabled for clarity in using the MUI Rating component
  const disabled = !enabled;
  console.log(currentValue);
  if (!visible) return null;
  const [value, setValue] = useState<number>(
    currentValue !== undefined ? currentValue : defaultValue ? defaultValue : 0
  );

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: number | null
  ) => {
    if (newValue) {
      setValue(newValue); // Update the local state
      updatePropertyValueToModel(id, newValue); // Update the value in the model/store
    } else {
      {
        setValue(0); // Update the local state
        updatePropertyValueToModel(id, 0); // Update the value in the model/store
      }
    }
  };

  return (
    <Box>
      <Typography component="legend">{label}</Typography>
      <Rating
        color={color}
        name={label}
        value={value}
        max={max}
        precision={precision}
        readOnly={readOnly}
        disabled={disabled}
        size="small"
        onChange={handleChange}
      />
    </Box>
  );
};
