import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  LinearProgress,
} from "@mui/material";
import { UploadFile, Close } from "@mui/icons-material";

type UploadInputProps = {
  maxFileSize?: number; // Maximum file size in bytes
  allowedFileTypes?: string[]; // Array of allowed file types (e.g., ['png', 'jpg', 'gif'])
  onFileUpload?: (file: File) => void; // Callback function when a file is uploaded
};

type LoadingInputProps = {
  file: File;
  progress: number;
  handleCancel: () => void;
  error: boolean;
};

// Function to convert the Byte in MB or KB
const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const UploadInputComponent: React.FC<UploadInputProps> = ({
  maxFileSize = 3145728, // Default to 3MB
  allowedFileTypes = ["svg", "png", "jpg", "gif"],
  onFileUpload,
}) => {
  const theme = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [isMaxLimit, setIsMaxLimit] = useState(false);
  const [isErrorUpload, setIsErrorUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && isFileAllowed(uploadedFile)) {
      setFile(uploadedFile);
      onFileUpload?.(uploadedFile);
      setIsLoading(true);
    }
  };

  const isFileMaxLimit = (file: File) => {
    if (file.size > maxFileSize) {
      setIsMaxLimit(true);
      return false;
    }
    return true;
  };

  const isFileAllowed = (file: File) => {
    const fileSize = file.size / 1024 / 1024; // Convert bytes to MB
    if (fileSize > 6) {
      setIsMaxLimit(true);
      return false;
    }

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!allowedFileTypes.includes(fileExtension || "")) {
      setIsErrorUpload(true);
      return false;
    }

    return true;
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && isFileAllowed(droppedFile)) {
      setFile(droppedFile);
      onFileUpload?.(droppedFile);
      setIsLoading(true);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setIsLoading(false);
    setProgress(0);
  };

  const UploadInputStyles = {
    container: {
      border: `1px solid ${theme.palette.divider} `,
      minWidth: "400px",
    },
    inputContainer: {
      border: isErrorUpload
        ? `1px solid ${theme.palette.error.main}`
        : `1px dashed ${theme.palette.divider}`,
      padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
      textAlign: "center",
      cursor: "pointer",
      backgroundColor: isErrorUpload ? "rgba(255, 86, 86, 0.10)" : "",
    },
    loadingContainer: {
      padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
    },
    icon: {
      width: theme.spacing(5),
      height: theme.spacing(5),
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    button: {
      textTransform: "none",
      color: theme.palette.text.primary,
    },
  };

  return (
    <Box sx={{ ...UploadInputStyles.container }}>
      <Typography
        variant="h6"
        p={`${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(1.5)}`}
      >
        Upload New Media
      </Typography>
      <Box p={2}>
        {!isLoading ? (
          <Box
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            sx={{
              ...UploadInputStyles.inputContainer,
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              gap={1}
              alignItems="center"
            >
              <Box
                sx={{
                  ...UploadInputStyles.icon,
                }}
              >
                <UploadFile
                  sx={{
                    color: theme.palette.primary.main,
                  }}
                />
              </Box>

              <input
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />

              <label
                htmlFor="file-upload"
                style={{ display: "flex", gap: theme.spacing(0.5) }}
              >
                <Typography
                  variant="body1"
                  color="primary"
                  sx={{ textDecoration: "underline" }}
                >
                  Click to upload
                </Typography>
                <Typography variant="body1"> or drag and drop</Typography>
              </label>
              {isErrorUpload ? (
                <Typography variant="body1" color="error">
                  Unsupported file
                </Typography>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  SVG, PNG, JPG or GIF (max. 3MB)
                </Typography>
              )}
            </Box>
          </Box>
        ) : (
          file && (
            <LoadingInput
              file={file}
              progress={progress}
              handleCancel={handleCancel}
              error={isMaxLimit}
            />
          )
        )}
      </Box>
      <Box pl={2} pr={2} textAlign="right">
        <Button
          sx={{ ...UploadInputStyles.button }}
          onClick={() => handleCancel()}
        >
          Cancel
        </Button>
        <Button
          sx={{
            ...UploadInputStyles.button,
            color: theme.palette.primary.main,
          }}
        >
          Confirm
        </Button>
      </Box>
    </Box>
  );
};

const LoadingInput: React.FC<LoadingInputProps> = ({
  file,
  progress,
  handleCancel,
  error,
}) => {
  const theme = useTheme();

  const LoadingInputStyles = {
    icon: {
      width: theme.spacing(5),
      height: theme.spacing(5),
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "&:hover": {
        cursor: "pointer",
      },
    },
  };

  return (
    <Box display="flex" gap={2}>
      <Box
        sx={{
          ...LoadingInputStyles.icon,
        }}
      >
        <UploadFile
          sx={{
            color: error
              ? theme.palette.error.main
              : theme.palette.primary.main,
          }}
        />
      </Box>
      <Box
        sx={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          color: error ? theme.palette.error.main : "",
        }}
      >
        <Typography>{file.name}</Typography>
        <Box display="flex" gap={1}>
          <Typography>{file && formatBytes(file.size, 2)}</Typography>

          <Typography>•</Typography>

          <Typography>{progress === 100 ? "Complete" : "Loading"}</Typography>
        </Box>

        {progress === 100 ? null : (
          <Box sx={{ width: "100%" }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={error ? "error" : "primary"}
            />
          </Box>
        )}
      </Box>
      <Box sx={{ ...LoadingInputStyles.icon, ml: "auto" }}>
        <Close onClick={() => handleCancel()} />
      </Box>
    </Box>
  );
};

export default UploadInputComponent;
