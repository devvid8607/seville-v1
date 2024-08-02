import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextFieldProps,
} from "@mui/material";
import React, { useState, useEffect } from "react";

import { useAllModelsStore } from "@/app/canvasBuilderv2/model/_lib/_store/modelStore/AllModelsStore";

export type SmallModelDropdownProps = {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  currentValue?: string;
  size?: TextFieldProps["size"];
  enabled?: boolean;
  // config: {
  //   options: Array<{
  //     id: string;
  //     label: string;
  //   }>;
  //   fromApi: boolean;
  //   ApiURL: string;
  // };
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
  const allModels = useAllModelsStore((state) => state.allModels);
  const fetchAndSetAllModels = useAllModelsStore(
    (state) => state.fetchAndSetAllModels
  );

  useEffect(() => {
    if (allModels.length === 0) fetchAndSetAllModels();
  }, [allModels]);

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
        {allModels && allModels.length > 0 ? (
          allModels.map((model) => (
            <MenuItem key={model.id} value={model.id}>
              {model.name}
            </MenuItem>
          ))
        ) : (
          <div>
            <CircularProgress />
          </div>
        )}
      </Select>
    </FormControl>
  );
};
