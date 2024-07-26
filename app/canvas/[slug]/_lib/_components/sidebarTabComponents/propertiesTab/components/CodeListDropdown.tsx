import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextFieldProps,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useCodeListStore } from "../../../../_nodes/codeListNode/store/CodeListStore";
import { useAllCodesStore } from "@/app/canvas/[slug]/modelCreator/_lib/_store/modelStore/AllCodeListStore";

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

export const CodeListDropdown: React.FC<SmallDropdownProps> = ({
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

  const allcodes = useAllCodesStore((state) => state.allCodes);
  const fetchAndSetAllCodes = useAllCodesStore(
    (state) => state.fetchAndSetAllCodes
  );

  useEffect(() => {
    if (allcodes.length === 0) fetchAndSetAllCodes();
  }, [allcodes]);

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
    <FormControl fullWidth required={required} sx={{ mt: 2 }}>
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
        {allcodes.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
