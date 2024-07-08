import useDataTypesStore from "../../../../../../nonRouted/store/DataTypesStore";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import React, { useState, useEffect } from "react";
import { SmallTextField } from "./SmallTextField";
import { SmallNumberField } from "./SmallNumberField";
import { SmallDropdown } from "./SmallDropdown";
import { SmallSwitch } from "./SmallSwitch";
import { SmallCheckbox } from "./SmallCheckBox";
import { SmallRadioGroup } from "./SmallRadioGroup";
import { SmallRating } from "./SmallRating";
import { SmallSlider } from "./SmallSlider";
import { SmallToggleButton } from "./SmallToggleButton";
import { SmallModelDropdown } from "./SmallModelDropDown";

export type SmallListDropdownProps = {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  currentValue?: string;
  size?: TextFieldProps["size"];
  enabled?: boolean;
  currentListValues: any[];
  config: {
    options: Array<{
      id: string;
      label: string;
    }>;
    fromApi: boolean;
    ApiURL: string;
  };
  getModelPropsFromAPI: (newValue: any) => void;
  selectId: string;
};

export const SmallListDropdown: React.FC<SmallListDropdownProps> = ({
  label,
  placeholder,
  required = false,
  defaultValue,
  size,
  currentValue,
  currentListValues,
  enabled = true,
  // config: { options, fromApi, ApiURL },
  getModelPropsFromAPI,
  selectId,
}) => {
  const { storeDataTypes, setCurrentListValue } = useDataTypesStore(
    (state) => ({
      storeDataTypes: state.dataTypes,
      setCurrentListValue: state.setCurrentListValue,
    })
  );
  const [selectedValue, setSelectedValue] = useState(
    currentValue ? currentValue : defaultValue ? defaultValue : ""
  );

  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    if (currentListValues.length === 0) {
      //first time
      const item = { id: uuidv4(), type: "", properties: [], children: [] };
      setCurrentListValue(item);
    } else {
      setCurrentListValue(currentListValues);
    }
  }, [currentListValues]);

  const handleChange = (event: SelectChangeEvent<string>, selectId: string) => {
    setSelectedValue(event.target.value);

    const selectedTypeData = storeDataTypes.find(
      (type) => type.code === event.target.value
    );

    setProperties(selectedTypeData?.properties || []);
    const testItem = {
      selectId: selectId,
      dataType: event.target.value,
      properties: selectedTypeData?.properties,
    };
    setCurrentListValue(testItem);
  };

  const handleUpdatePropValueToStore = (propId: any, newValue: any) => {
    console.log("TBD1", newValue, propId);
    // updatePropertyCurrentValue(modelId, attributeId, propId, newValue);
  };

  const handleModelConnection = (newValue: any) => {
    //case where node is expanded and user trying to connect to another model
  };

  const renderFields = (properties: any[]) =>
    properties.map((prop: any) => {
      switch (prop.type) {
        case "text":
          return (
            <Grid item key={prop.id} mt={2}>
              <SmallTextField
                {...prop}
                updatePropertyValueToModel={(propId: any, newValue: any) =>
                  handleUpdatePropValueToStore(propId, newValue)
                }
              />
            </Grid>
          );
        case "number":
          return (
            <Grid item key={prop.id} mt={2}>
              <SmallNumberField
                {...prop}
                updatePropertyValueToModel={(propId: any, newValue: any) =>
                  handleUpdatePropValueToStore(propId, newValue)
                }
              />
            </Grid>
          );
        case "dropdown":
          return (
            <Grid item key={prop.id} mt={2}>
              <SmallDropdown
                {...prop}
                updatePropertyValueToModel={(propId: any, newValue: any) =>
                  handleUpdatePropValueToStore(propId, newValue)
                }
              />
            </Grid>
          );
        case "switch":
          return (
            <Grid item key={prop.id} mt={2}>
              <SmallSwitch
                {...prop}
                updatePropertyValueToModel={(propId: any, newValue: any) =>
                  handleUpdatePropValueToStore(propId, newValue)
                }
              />
            </Grid>
          );
        case "checkbox":
          return (
            <Grid item key={prop.id} mt={2}>
              <SmallCheckbox
                {...prop}
                updatePropertyValueToModel={(propId: any, newValue: any) =>
                  handleUpdatePropValueToStore(propId, newValue)
                }
              />
            </Grid>
          );
        case "radioGroup":
          return (
            <Grid item key={prop.id} mt={2}>
              <SmallRadioGroup
                {...prop}
                updatePropertyValueToModel={(propId: any, newValue: any) =>
                  handleUpdatePropValueToStore(propId, newValue)
                }
              />
            </Grid>
          );
        case "rating":
          return (
            <Grid item key={prop.id} mt={2}>
              <SmallRating
                {...prop}
                updatePropertyValueToModel={(propId: any, newValue: any) =>
                  handleUpdatePropValueToStore(propId, newValue)
                }
              />
            </Grid>
          );
        case "slider":
          return (
            <Grid item key={prop.id} mt={2}>
              <SmallSlider
                {...prop}
                updatePropertyValueToModel={(propId: any, newValue: any) =>
                  handleUpdatePropValueToStore(propId, newValue)
                }
              />
            </Grid>
          );
        case "toggleButton":
          return (
            <Grid item key={prop.id} mt={2}>
              <SmallToggleButton
                {...prop}
                updatePropertyValueToModel={(propId: any, newValue: any) =>
                  handleUpdatePropValueToStore(propId, newValue)
                }
              />
            </Grid>
          );
        case "modeldropdown":
          return (
            <Grid item key={prop.id} mt={2}>
              <SmallModelDropdown
                {...prop}
                getModelPropsFromAPI={(newValue: any) =>
                  handleModelConnection(newValue)
                }
              />
            </Grid>
          );

        case "listdropdown":
          return (
            <Grid item key={prop.id} mt={2}>
              <SmallListDropdown
                {...prop}
                getModelPropsFromAPI={(newValue: any) =>
                  handleModelConnection(newValue)
                }
                selectId={uuidv4()}
              />
            </Grid>
          );
      }
    });

  return (
    <>
      <FormControl fullWidth required={required}>
        <InputLabel>{label}</InputLabel>
        <Select
          size={size}
          value={selectedValue}
          label={label}
          onChange={(e) => handleChange(e, selectId)}
          disabled={!enabled}
          displayEmpty
          inputProps={{ "aria-label": placeholder }}
          id={selectId}
        >
          {storeDataTypes.map((type) => (
            <MenuItem key={type.id} value={type.code}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {properties.length > 0 && <Box mt={2}>{renderFields(properties)}</Box>}
    </>
  );
};
