import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
interface NewModelModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    description: string;
    template: string;
  }) => void;
  createError: string | null;
}

const CreateFlowItemModal: React.FC<NewModelModalProps> = ({
  open,
  onClose,
  onCreate,
  createError,
}) => {
  const [name, setName] = useState("test name");
  const [description, setDescription] = useState("test desc");
  const [template, setTemplate] = useState("template1");

  const handleCreate = () => {
    onCreate({ name, description, template });
    setName("");
    setDescription("");
    setTemplate("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Model</DialogTitle>
      <DialogContent>
        {createError && <Alert severity="error">{createError}</Alert>}
        <TextField
          sx={{ mt: 2 }}
          autoFocus
          size="small"
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          sx={{ mt: 2 }}
          margin="dense"
          size="small"
          label="Description"
          type="text"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <Select
            sx={{ mt: 2 }}
            size="small"
            value={template}
            onChange={(e) => setTemplate(e.target.value as string)}
          >
            <MenuItem value="template1">Template 1</MenuItem>
            <MenuItem value="template2">Template 2</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFlowItemModal;
