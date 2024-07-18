import { TextField, TextFieldProps } from "@mui/material";
import React, { useState, useEffect } from "react";

type SmallTextFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  propertyName: string;
  required?: boolean;
  defaultValue?: string;
  currentValue?: string;
  size?: TextFieldProps["size"];
  config?: {
    minLength?: string;
    maxLength?: string;
    errorMessage?: string;
  };
  updatePropertyValueToModel: (propertyName: string, newValue: any) => void;
};

export const SmallTextField: React.FC<SmallTextFieldProps> = (props) => {
  const {
    label,
    placeholder,
    defaultValue,
    size = "small",
    required = false,
    propertyName,
    currentValue,
    id,
    config: { minLength = "", maxLength = "", errorMessage = "" } = {},
    updatePropertyValueToModel,
  } = props;

  // const [value, setValue] = useState(
  //   currentValue ? currentValue : defaultValue
  // );
  // const [error, setError] = useState("");

  // useEffect(() => {
  //   const minLen = Number(minLength);
  //   const maxLen = Number(maxLength);

  //   // Check for minLength and maxLength validation
  //   if (minLength && value && value.length < minLen) {
  //     setError(errorMessage);
  //   } else if (maxLength && value && value.length > maxLen) {
  //     setError(errorMessage);
  //   } else {
  //     setError(""); // Clear error if input is valid
  //   }
  // }, [value]);

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const inputValue = event.target.value;
  //   const minLen = Number(minLength);
  //   const maxLen = Number(maxLength);

  //   // Check for minLength and maxLength validation
  //   if (minLength && inputValue.length < minLen) {
  //     setError(errorMessage);
  //   } else if (maxLength && inputValue.length > maxLen) {
  //     setError(errorMessage);
  //   } else {
  //     setError(""); // Clear error if input is valid
  //   }

  //   setValue(inputValue);
  //   updatePropertyValueToModel(id, inputValue);
  // };

  const [localValue, setLocalValue] = useState(
    currentValue ? currentValue : defaultValue
  );
  const [error, setError] = useState("");

  useEffect(() => {
    setLocalValue(currentValue ? currentValue : defaultValue);
  }, [currentValue, defaultValue]);

  const handleBlur = () => {
    // Call the update function on blur with the local state value
    updatePropertyValueToModel(id, localValue);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setLocalValue(inputValue);

    // Validation logic remains the same
    const minLen = Number(minLength);
    const maxLen = Number(maxLength);

    if (minLength && inputValue.length < minLen) {
      setError(errorMessage);
    } else if (maxLength && inputValue.length > maxLen) {
      setError(errorMessage);
    } else {
      setError(""); // Clear the error if input is valid
    }
  };

  return (
    <TextField
      required={required}
      size={size}
      placeholder={placeholder}
      variant="outlined"
      label={label}
      onChange={handleChange}
      onBlur={handleBlur} // Add onBlur handler
      value={localValue} // Use localValue for the TextField value
      error={!!error}
      helperText={error ? error : null}
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
