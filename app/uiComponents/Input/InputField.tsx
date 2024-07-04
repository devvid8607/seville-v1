import React, { useState, useEffect } from "react";
import UploadInputComponent from "./UploadInputComponent";
import {
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
  Chip,
  Autocomplete,
  useTheme,
  InputAdornment,
  ListItem,
  Typography,
  IconButton,
  SxProps,
  Box,
  List,
  Popover,
  TextFieldProps as MuiTextFieldProps,
} from "@mui/material";
import {
  Search,
  VisibilityOffOutlined,
  VisibilityOutlined,
  Clear,
} from "@mui/icons-material";

type TextFieldProps = {
  id?: string;
  value: string | number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  color?: "primary" | "secondary" | "info" | "warning" | "success";
  fullWidth?: boolean;
  helperText?: string;
  sx?: SxProps;
  disabled?: boolean;
  type?: string;
  size?: "small" | "medium";
  required?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  tabIndex?: number | undefined;
};

type SearchTextFieldProps = TextFieldProps & {
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
};

type OptionObject = {
  label: string;
  value: string | number;
};

export type SelectFieldProps = {
  options: OptionObject[] | number[] | string[];
  label?: string;
  helperText?: string;
  value: string | number;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  fullWidth?: boolean;
  sx?: SxProps;
  disabled?: boolean;
  variant?: "standard" | "filled" | "outlined";
  InputProps?: any;
  size?: "small" | "medium";
};

type CheckboxFieldProps = {
  checked: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  sx?: SxProps;
};

type MultiChipTextFieldProps = {
  value: string[];
  handleChange: (newValue: string[]) => void;
  label: string;
};

type CheckboxListFieldProps = {
  value: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  sx?: SxProps;
};

const StringTextField: React.FC<TextFieldProps> = (props) => {
  const {
    handleChange,
    error,
    helperText,
    sx,
    size = "small",
    ...otherProps
  } = props;
  const theme = useTheme();
  return (
    <TextField
      onChange={handleChange}
      error={error}
      helperText={error && helperText}
      size={size}
      {...otherProps}
      sx={{
        ...sx,
        ".MuiFormHelperText-root": {
          color: error ? theme.palette.error.main : "inherit",
          textWrap: "noWrap",
          // fontSize: "12px",
          // fontWeight: "normal",
        },
      }}
    />
  );
};

const PasswordTextField: React.FC<TextFieldProps> = (props) => {
  const { handleChange, error, helperText, sx, ...otherProps } = props;
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  return (
    <TextField
      onChange={handleChange}
      error={error}
      helperText={error && helperText}
      type={showPassword ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleClickShowPassword}
              edge="end"
            >
              {!showPassword ? (
                <VisibilityOffOutlined />
              ) : (
                <VisibilityOutlined />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        ".MuiFormHelperText-root": {
          color: error ? theme.palette.error.main : "inherit",
          textWrap: "noWrap",
        },
        ".MuiSvgIcon-root": {
          color: "rgba(0,0,0,0.4)",
          fontSize: "20px",
        },
        ...sx,
      }}
      FormHelperTextProps={{
        sx: {
          lineHeight: 1.5,
          mx: 0,
          fontWeight: 600,
        },
      }}
      {...otherProps}
    />
  );
};

const DateTextField: React.FC<TextFieldProps> = (props) => {
  const { handleChange, ...otherProps } = props;
  return (
    <TextField
      onChange={handleChange}
      type="date"
      InputLabelProps={{
        shrink: true,
      }}
      {...otherProps}
    />
  );
};

const SelectTextField: React.FC<SelectFieldProps> = (props) => {
  const theme = useTheme();
  const {
    handleChange,
    value,
    options,
    sx,
    size = "small",
    ...otherProps
  } = props;
  return (
    <TextField
      id="Select"
      select
      value={value}
      onChange={(e) =>
        handleChange(e as unknown as React.ChangeEvent<HTMLSelectElement>)
      }
      size={size}
      sx={{
        "& .MuiSelect-icon": {
          color: theme.palette.text.primary,
        },
        ...sx,
      }}
      {...otherProps}
    >
      {options.map((option: OptionObject | number | string, index: number) => (
        <MenuItem
          key={index}
          value={
            typeof option === "object" ? (option as OptionObject).value : option
          }
        >
          {typeof option === "object" ? (option as OptionObject).label : option}
        </MenuItem>
      ))}
    </TextField>
  );
};

const CheckboxTextField: React.FC<CheckboxFieldProps> = (props) => {
  const { checked, handleChange, label, sx } = props;

  return label ? (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
          sx={sx}
        />
      }
      label={label}
    />
  ) : (
    <Checkbox
      checked={checked}
      onChange={handleChange}
      inputProps={{ "aria-label": "controlled" }}
      sx={sx}
    />
  );
};

const MultiChipTextField: React.FC<MultiChipTextFieldProps> = ({
  label,
  value,
  handleChange,
}) => {
  const theme = useTheme();

  const [inValidEmail, setInValidEmail] = useState(false);

  // Function to check s patter
  const isValidEmail = (email: string) => {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmedEmail);
  };

  const handleInputChange = (
    _event: React.ChangeEvent<{}>,
    newValue: string | string[]
  ) => {
    setInValidEmail(false); // Reset to false initially

    if (Array.isArray(newValue)) {
      // Filter out invalid emails
      const validEmails = newValue.filter((email) => isValidEmail(email));

      // Check if any invalid emails are found
      if (validEmails.length !== newValue.length) {
        setInValidEmail(true);
      }

      handleChange(validEmails);
    } else {
      // If single value entered, validate and update if valid
      if (isValidEmail(newValue)) {
        handleChange([newValue]);
      } else {
        setInValidEmail(true);
      }
    }
  };

  return (
    <Autocomplete
      multiple
      options={value.map((option) => option)}
      value={value}
      onChange={handleInputChange}
      freeSolo
      renderTags={(tag: readonly string[], getTagProps) =>
        tag.map((option: string, index: number) => (
          <Chip
            size="small"
            label={option}
            sx={{
              backgroundColor: theme.palette.primary.light,
              color: "black",
            }}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder="Press Enter key to enter another email"
          error={inValidEmail}
          helperText={inValidEmail ? "Invalid Email Format" : ""}
        />
      )}
    />
  );
};

const SearchTextField = (props: SearchTextFieldProps) => {
  const { label, sx, value, handleChange, onClear, ...otherProps } = props;
  const theme = useTheme();
  return (
    <TextField
      label={label}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={onClear}
              sx={{
                display: value ? "" : "none",
                cursor: "pointer",
                p: 0,
                "& .MuiSvgIcon-root": {
                  color: "black",
                  width: theme.spacing(2),
                  height: theme.spacing(2),
                },
              }}
            >
              <Clear />
            </IconButton>
          </InputAdornment>
        ),
      }}
      variant="outlined"
      sx={{
        "& .MuiSvgIcon-root": {
          color: "black",
          width: theme.spacing(3),
          height: theme.spacing(3),
        },
        // position: "fixed",
        ...sx,
      }}
      value={value}
      onChange={handleChange}
      {...otherProps}
    />
  );
};

type PasswordStrengthFieldProps = Omit<TextFieldProps, "value"> & {
  value: string;
};
const PasswordStrengthField = (props: PasswordStrengthFieldProps) => {
  const { value, handleChange: setValue, label, ...otherProps } = props;
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [passwordStrength, setPasswordStrength] = useState("Weak");

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setValue(event);

    // Evaluate password strength
    evaluatePasswordStrength(newPassword);

    if (newPassword) {
      setAnchorEl(event.currentTarget);
    }
  };

  const evaluatePasswordStrength = (password: string) => {
    let strength = "Weak";
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    if (
      isLongEnough &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    ) {
      strength = "Strong";
    } else if (
      hasUpperCase &&
      hasLowerCase &&
      (hasNumber || hasSpecialChar || isLongEnough)
    ) {
      strength = "Average";
    }

    setPasswordStrength(strength);
  };

  const open = Boolean(anchorEl);

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "Strong":
        return "green";
      case "Average":
        return "orange";
      case "Weak":
      default:
        return "red";
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <PasswordTextField
        label={label}
        value={value}
        handleChange={handlePasswordChange}
        fullWidth
        {...otherProps}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        disableAutoFocus
        disableEnforceFocus
      >
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box
              sx={{
                backgroundColor: getStrengthColor(passwordStrength),
                flex: 1,
                height: "4px",
              }}
            ></Box>
            <Box
              sx={{
                backgroundColor: getStrengthColor(passwordStrength),
                flex: 1,
                height: "4px",
              }}
            ></Box>
            <Box
              sx={{
                backgroundColor: getStrengthColor(passwordStrength),
                flex: 1,
                height: "4px",
              }}
            ></Box>
          </Box>

          <Typography variant="h6">
            Password Strength:&nbsp;
            <Typography
              component={"span"}
              variant="h6"
              sx={{ color: getStrengthColor(passwordStrength) }}
            >
              {passwordStrength}
            </Typography>
          </Typography>

          <Box>
            <Typography variant="body2">It's better to have:</Typography>
            <List
              sx={{
                py: 0,
                ".MuiListItem-root": { p: 0 },
                ".MuiTypography-root": { fontWeight: "bold" },
              }}
            >
              <ListItem
                sx={{
                  textDecoration: /[A-Z]/.test(value) ? "line-through" : "none",
                  color: /[A-Z]/.test(value)
                    ? theme.palette.text.secondary
                    : "inherit",
                }}
              >
                <Typography>Upper & lower case letters</Typography>
              </ListItem>
              <ListItem
                sx={{
                  textDecoration: /[0-9]/.test(value) ? "line-through" : "none",
                  color: /[0-9]/.test(value)
                    ? theme.palette.text.secondary
                    : "inherit",
                }}
              >
                <Typography>A number</Typography>
              </ListItem>
              <ListItem
                sx={{
                  textDecoration: /[!@#$%^&*(),.?":{}|<>]/.test(value)
                    ? "line-through"
                    : "none",
                  color: /[!@#$%^&*(),.?":{}|<>]/.test(value)
                    ? theme.palette.text.secondary
                    : "inherit",
                }}
              >
                <Typography> A symbol (#$&)</Typography>
              </ListItem>
              <ListItem
                sx={{
                  textDecoration: value.length >= 8 ? "line-through" : "none",
                  color:
                    value.length >= 8
                      ? theme.palette.text.secondary
                      : "inherit",
                }}
              >
                <Typography> A longer password (8+ characters)</Typography>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default PasswordStrengthField;

export {
  UploadInputComponent,
  SelectTextField,
  StringTextField,
  DateTextField,
  CheckboxTextField,
  MultiChipTextField,
  SearchTextField,
  // CheckboxListField,
  PasswordTextField,
  PasswordStrengthField,
};
