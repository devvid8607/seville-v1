import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextFieldProps,
} from "@mui/material";
import React, { useState, useEffect } from "react";

type SmallDropdownProps = {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  currentValue?: string;
  size?: TextFieldProps["size"];
  enabled?: boolean;
  config: {
    options: Array<{
      id: string;
      label: string;
    }>;
  };
  updatePropertyValueToModel: (propertyName: string, newValue: any) => void;
};

export const SmallDropdown: React.FC<SmallDropdownProps> = ({
  label,
  placeholder,
  required = false,
  defaultValue,
  size,
  id,
  currentValue,
  enabled = true,
  config: { options },
  updatePropertyValueToModel,
}) => {
  const [selectedValue, setSelectedValue] = useState(
    currentValue ? currentValue : defaultValue ? defaultValue : ""
  );

  useEffect(() => {
    setSelectedValue(
      currentValue ? currentValue : defaultValue ? defaultValue : ""
    );
  }, [currentValue, defaultValue]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedValue(event.target.value);
    updatePropertyValueToModel(id, event.target.value);
  };
  return (
    <FormControl fullWidth required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        size={size}
        value={selectedValue}
        label={label}
        onChange={handleChange}
        disabled={!enabled}
        displayEmpty
        inputProps={{ "aria-label": placeholder }}
      >
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
