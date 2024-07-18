import { TextField, TextFieldProps } from "@mui/material";
import React, { useState, useEffect } from "react";

type SmallNumberFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  required?: boolean;
  defaultValue?: string;
  currentValue?: string;
  size?: TextFieldProps["size"];
  config?: {
    minValue?: string;
    maxValue?: string;
    errorMessage?: string;
    step?: string;
  };
  updatePropertyValueToModel: (propertyName: string, newValue: any) => void;
};

export const SmallNumberField: React.FC<SmallNumberFieldProps> = (props) => {
  const {
    label,
    placeholder,
    defaultValue,
    size,
    currentValue,
    id,
    required = false,
    config: { minValue = "", maxValue = "", step = "", errorMessage = "" } = {},
    updatePropertyValueToModel,
  } = props;

  const [localValue, setLocalValue] = useState(
    currentValue ? currentValue : defaultValue
  );
  const [error, setError] = useState("");
  useEffect(() => {
    setLocalValue(currentValue ? currentValue : defaultValue);
  }, [currentValue, defaultValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const numValue = Number(newValue);
    const numMinValue = Number(minValue);
    const numMaxValue = Number(maxValue);

    // Update local value with the new input
    setLocalValue(newValue);

    // Check if the newValue is outside the min and max bounds
    if (numMinValue && numValue < numMinValue) {
      setError(errorMessage || `Value must be at least ${minValue}.`);
    } else if (numMaxValue && numValue > numMaxValue) {
      setError(errorMessage || `Value must not exceed ${maxValue}.`);
    } else {
      setError(""); // Clear the error if value is within range
    }
  };

  const handleBlur = () => {
    const numValue = Number(localValue);
    const numMinValue = Number(minValue);
    const numMaxValue = Number(maxValue);

    // Ensure the value is within bounds before updating
    if (
      (numMinValue && numValue < numMinValue) ||
      (numMaxValue && numValue > numMaxValue)
    ) {
      // Here you might want to reset to the previous valid value or keep the bounds value
      console.error("Value out of bounds"); // or handle it as needed
    } else {
      // Call the update function on blur with the local state value
      updatePropertyValueToModel(id, localValue);
    }
  };

  return (
    <TextField
      fullWidth={true}
      required={required}
      size={size}
      placeholder={placeholder}
      variant="outlined"
      label={label}
      onChange={handleChange}
      type="number"
      value={localValue}
      onBlur={handleBlur}
      error={!!error}
      helperText={error ? error : null}
      inputProps={{ min: minValue, max: maxValue, step: step }}
      sx={{
        input: {
          "&::placeholder": {
            opacity: 1,
            fontSize: "0.5rem",
          },
        },
      }}
    />
  );
};
