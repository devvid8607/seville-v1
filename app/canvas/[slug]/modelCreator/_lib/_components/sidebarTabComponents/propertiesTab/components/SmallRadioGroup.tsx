import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";

type SmallRadioGroupProps = {
  id: string;
  type: string;
  label: string;
  tooltip?: string;
  visible: boolean;
  required: boolean;
  enabled: boolean;
  defaultValue: string;
  currentValue: string;
  size?: "small" | "medium"; // Assuming this affects custom styling, as MUI Radio doesn't directly use this
  config: {
    options: Array<{
      id: string;
      label: string;
    }>;
    orientation: "horizontal" | "vertical";
  };
  updatePropertyValueToModel: (propertyName: string, newValue: any) => void;
};

export const SmallRadioGroup: React.FC<SmallRadioGroupProps> = ({
  label,
  tooltip,
  visible,
  required,
  enabled,
  id,
  currentValue,
  defaultValue,
  config: { options, orientation },
  updatePropertyValueToModel,
}) => {
  const [value, setValue] = React.useState(
    currentValue ? currentValue : defaultValue
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    updatePropertyValueToModel(id, event.target.value);
  };

  if (!visible) return null;

  return (
    <FormControl component="fieldset" required={required} disabled={!enabled}>
      <FormLabel component="legend" title={tooltip}>
        {label}
      </FormLabel>
      <RadioGroup
        aria-label={label}
        name={label}
        value={value}
        onChange={handleChange}
        row={orientation === "vertical"}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.id}
            value={option.id}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
