import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextFieldProps,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import useModelStore from "@/app/canvas/[slug]/modelCreator/_lib/_store/modelStore/ModelDetailsFromBackendStore";

export type SmallModelDropdownProps = {
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
    fromApi: boolean;
    ApiURL: string;
  };
  getModelPropsFromAPI: (newValue: any) => void;
};

export const SmallModelDropdown: React.FC<SmallModelDropdownProps> = ({
  label,
  placeholder,
  required = false,
  defaultValue,
  size,
  id,
  currentValue,
  enabled = true,
  // config: { options, fromApi, ApiURL },
  getModelPropsFromAPI,
}) => {
  const [selectedValue, setSelectedValue] = useState(
    currentValue ? currentValue : defaultValue ? defaultValue : ""
  );
  const models = useModelStore((state) => state.models);

  useEffect(() => {
    setSelectedValue(
      currentValue ? currentValue : defaultValue ? defaultValue : ""
    );
  }, [currentValue, defaultValue]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedValue(event.target.value);

    getModelPropsFromAPI(event.target.value);

    //get the selected model details from api
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
        {models.map((model) => (
          <MenuItem key={model.modelId} value={model.modelId}>
            {model.modelFriendlyName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
