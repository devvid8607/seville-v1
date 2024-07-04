export type CustomInputProps = {
  value: string | number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder?: string;
  error?: boolean;
  color?: "primary" | "secondary" | "info" | "warning" | "success";
  fullWidth?: boolean;
  size?: "small" | "medium";
  type?: "password" | "number";
  helperText?: string;
};
