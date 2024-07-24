import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import { DeleteForeverOutlined } from "@mui/icons-material";

export interface DataItem {
  value: string | number;
}

interface TableComponentProps {
  data: DataItem[];
  onAddRow: (newData: DataItem[]) => void;
  onDeleteRow: (newData: DataItem[]) => void;
  onUpdateRow: (newData: DataItem[]) => void;
}

const SampleTable: React.FC<TableComponentProps> = ({
  data,
  onAddRow,
  onDeleteRow,
  onUpdateRow,
}) => {
  const [newRow, setNewRow] = useState<DataItem>({ value: "" });
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string | number>("");
  console.log("data here", data);
  const handleAddRow = () => {
    if (
      newRow.value === "" ||
      newRow.value === undefined ||
      newRow.value === null
    ) {
      return;
    }
    const updatedData = [...data, newRow];
    onAddRow(updatedData);
    setNewRow({ value: "" });
  };

  const handleDeleteRow = (rowIndex: number) => {
    const updatedData = data.filter((_, index) => index !== rowIndex);
    onDeleteRow(updatedData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setNewRow({ value });
  };

  const handleCellDoubleClick = (rowIndex: number, value: string | number) => {
    setEditRowIndex(rowIndex);
    setEditValue(value);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditValue(e.target.value);
  };

  const handleEditInputBlur = () => {
    if (editRowIndex !== null) {
      const updatedData = data.map((row, index) => {
        if (index === editRowIndex) {
          return { value: editValue };
        }
        return row;
      });
      onUpdateRow(updatedData);
      setEditRowIndex(null);
      setEditValue("");
    }
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Value</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell
                    onDoubleClick={() =>
                      handleCellDoubleClick(rowIndex, row.value)
                    }
                  >
                    {editRowIndex === rowIndex ? (
                      <TextField
                        value={editValue}
                        onChange={handleEditInputChange}
                        onBlur={handleEditInputBlur}
                        autoFocus
                      />
                    ) : (
                      row.value
                    )}
                  </TableCell>
                  <TableCell>
                    {/* <Button onClick={() => handleDeleteRow(rowIndex)}>
                      Delete
                    </Button> */}
                    <IconButton onClick={() => handleDeleteRow(rowIndex)}>
                      <DeleteForeverOutlined color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} style={{ textAlign: "center" }}>
                  No data available
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell>
                <TextField
                  value={newRow.value || ""}
                  onChange={handleInputChange}
                />
              </TableCell>
              <TableCell>
                <Button onClick={handleAddRow}>Add Row</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SampleTable;
